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

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: String(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ...
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
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
