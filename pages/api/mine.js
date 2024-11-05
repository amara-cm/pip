import prisma from '../../lib/db';

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
    const existingUser = await prisma.user.findUnique({
      where: { telegramId: String(userId) },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: { telegramId: String(userId) },
      });
    }

    const miningSession = await prisma.miningSession.findFirst({
      where: { userId: String(userId), status: 'in_progress' },
    });

    if (!miningSession) {
      // Create a new mining session with the start time
      await prisma.miningSession.create({
        data: {
          userId: String(userId),
          startTime: new Date(), // Store the current UTC time
          duration: 28800, // Set default duration (8 hours)
          status: 'in_progress',
        },
      });
    }

    // Fetch user's data again
    const user = await prisma.user.findUnique({
      where: { telegramId: String(userId) },
    });

    const updatedSession = await prisma.miningSession.findFirst({
      where: { userId: String(userId), status: 'in_progress' },
    });

    const elapsedSeconds = Math.floor((new Date() - updatedSession.startTime) / 1000);
    const remainingTime = Math.max(0, updatedSession.duration - elapsedSeconds);

    let response = {
      coins: user.coins,
      stone: user.diamonds,
      timer: remainingTime, // Return the calculated remaining time
      mining: true, // Indicate that mining is in progress
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error during fetching game state:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
