import prisma from '../../lib/db';
import schedule from 'node-schedule';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleMining(req, res);
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

async function handleMining(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Check if user is already mining
    const existingSession = await prisma.miningSession.findFirst({
      where: { userId: String(userId), status: 'in_progress' },
    });

    if (existingSession) {
      return res.status(400).json({ error: 'User is already mining' });
    }

    // Create a new mining session
    const miningSession = await prisma.miningSession.create({
      data: {
        userId: String(userId),
        startTime: new Date(),
        duration: 8 * 60 * 60, // 8 hours in seconds
        status: 'in_progress',
      },
    });

    // Schedule a task to update mining session status after the duration
    schedule.scheduleJob(new Date(Date.now() + miningSession.duration * 1000), async () => {
      await completeMiningSession(miningSession.id); // Pass the mining session ID
    });

    return res.status(200).json({ message: 'Mining started!' });
  } catch (error) {
    console.error('Error during mining:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function completeMiningSession(sessionId) {
  try {
    // Update mining session status to 'completed'
    await prisma.miningSession.update({
      where: { id: sessionId },
      data: { status: 'completed' },
    });

    // Update user's mining progress and in-game currency (coins)
    const session = await prisma.miningSession.findUnique({
      where: { id: sessionId },
    });
    const user = await prisma.user.update({
      where: { user_id: session.userId },
      data: {
        miningProgress: { increment: 1 },
        coins: { increment: 500 },
      },
    });

    // Add a new entry to the game history
    await prisma.gameHistory.create({
      data: {
        userId: session.userId,
        action: 'mining_completed',
      },
    });
  } catch (error) {
    console.error('Error completing mining session:', error);
  }
}
