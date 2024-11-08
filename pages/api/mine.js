import prisma from '../../lib/db';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    // Fetch mining state
    const { userId } = req.query;

    try {
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: { miningSessions: true }, // Fetch mining sessions related to the user
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check for an active mining session
      const session = user.miningSessions.find(session => new Date(session.countdownEnd) > new Date());

      if (session) {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - new Date(session.createdAt)) / 1000); // in seconds
        const remainingTime = Math.max(0, 28800 - elapsedTime); // 8 hours is 28800 seconds

        return res.status(200).json({
          startTime: session.createdAt,
          duration: 28800,
          remainingTime,
          stonesMined: session.stonesMined,
          coins: user.coins,
        });
      } else {
        return res.status(200).json({ coins: user.coins, stone: 0, timer: 28800 });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch user mining state.' });
    }
  }

  if (method === 'PUT') {
    const { userId, coins, stone, startTime, duration } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user's coins and start a new mining session
      await prisma.user.update({
        where: { user_id: user.user_id },
        data: {
          coins,
        },
      });

      const countdownEnd = new Date();
      countdownEnd.setSeconds(countdownEnd.getSeconds() + duration); // Set the new countdown

      await prisma.miningSession.create({
        data: {
          user_id: user.user_id,
          countdownEnd,
          stonesMined: stone,
          canSell: false,
        },
      });

      return res.status(200).json({ message: 'Mining session updated.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to update mining session.' });
    }
  }

  if (method === 'POST') {
    const { userId, action } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (action === 'mine') {
        const countdownEnd = new Date();
        countdownEnd.setHours(countdownEnd.getHours() + 8);

        await prisma.miningSession.create({
          data: {
            user_id: user.user_id,
            countdownEnd,
            stonesMined: 0, // Initially 0, updates later
            canSell: false, // False until countdown ends
          },
        });
        return res.status(200).json({ message: 'Mining started!' });
      }

      if (action === 'sell') {
        const session = await prisma.miningSession.findFirst({
          where: { user_id: user.user_id, canSell: true },
        });

        if (!session) {
          return res.status(400).json({ error: 'No completed mining session found.' });
        }

        await prisma.user.update({
          where: { user_id: user.user_id },
          data: {
            coins: { increment: 500 },
          },
        });

        await prisma.miningSession.delete({
          where: { id: session.id },
        });

        return res.status(200).json({ message: 'Stones sold, 500 coins added!' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to process mining action.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed.' });
  }
}
