import prisma from '../../lib/db';

export default async function handler(req, res) {
  const { method } = req;

  // Fetch user mining state (GET request)
  if (method === 'GET') {
    const { userId } = req.query;

    try {
      // Fetch user data including mining sessions
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: { miningSessions: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const ongoingSession = user.miningSessions.find(session => session.countdownEnd && new Date(session.countdownEnd) > new Date());

      if (ongoingSession) {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - new Date(ongoingSession.createdAt)) / 1000);
        const remainingTime = Math.max(0, 28800 - elapsedTime); // 8 hours

        return res.status(200).json({
          startTime: ongoingSession.createdAt,
          duration: 28800,
          remainingTime,
          stonesMined: ongoingSession.stonesMined,
          coins: user.coins,
        });
      } else {
        return res.status(200).json({ coins: user.coins, stone: 0, timer: 28800 });
      }
    } catch (error) {
      console.error('Error fetching user mining state:', error);
      return res.status(500).json({ error: 'Failed to fetch user mining state.' });
    }
  }

  // Update user's mining session (PUT request)
  if (method === 'PUT') {
    const { userId, coins, stone, startTime, duration } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { user_id: userId } });
      if (!user) return res.status(404).json({ error: 'User not found' });

      await prisma.$transaction(async (tx) => {
        // Update user's coins
        await tx.user.update({
          where: { user_id: user.user_id },
          data: { coins },
        });

        // Set countdown end time for the mining session
        const countdownEnd = new Date();
        countdownEnd.setSeconds(countdownEnd.getSeconds() + duration);

        // Create or update the mining session
        await tx.miningSession.create({
          data: {
            user_id: user.user_id,
            countdownEnd,
            stonesMined: stone,
            canSell: false, // Stones not sellable until countdown ends
          },
        });
      });

      return res.status(200).json({ message: 'Mining session updated successfully.' });
    } catch (error) {
      console.error('Error updating mining session:', error);
      return res.status(500).json({ error: 'Failed to update mining session.' });
    }
  }

  // Start new mining session (POST request)
  if (method === 'POST') {
    const { userId } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { user_id: userId } });
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Start a new mining session with an 8-hour countdown
      await prisma.miningSession.create({
        data: {
          user_id: user.user_id,
          countdownEnd: new Date(Date.now() + 28800 * 1000), // 8 hours from now
          stonesMined: 0,
          canSell: false,
        },
      });

      return res.status(201).json({ message: 'Mining started successfully.' });
    } catch (error) {
      console.error('Error starting mining session:', error);
      return res.status(500).json({ error: 'Failed to start mining session.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
