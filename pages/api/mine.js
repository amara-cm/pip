import prisma from '../../lib/db';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { userId } = req.query;

    try {
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: { miningSessions: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const session = user.miningSessions.find(session => new Date(session.countdownEnd) > new Date());

      if (session) {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - new Date(session.createdAt)) / 1000); 
        const remainingTime = Math.max(0, 28800 - elapsedTime); 

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

      await prisma.user.update({
        where: { user_id: user.user_id },
        data: { coins },
      });

      const countdownEnd = new Date();
      countdownEnd.setSeconds(countdownEnd.getSeconds() + duration); 

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
      return res.status(500).json({ error: 'Error updating mining session.' });
    }
  }

  if (method === 'POST') {
    const { userId } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await prisma.miningSession.create({
        data: {
          user_id: user.user_id,
          countdownEnd: new Date(Date.now() + 28800 * 1000),
          stonesMined: 0,
          canSell: true,
        },
      });

      return res.status(201).json({ message: 'Mining started.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to start mining session.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
