import prisma from "../../lib/db";

export default async function handler(req, res) {
  const { method, body } = req;
  const { userId, action, startTime, stone, coins } = body;

  switch (method) {
    case 'GET':
      try {
        const user = await prisma.user.findUnique({
          where: { user_id: userId },
          include: { miningSessions: true },
        });

        if (user && user.miningSessions.length > 0) {
          const currentSession = user.miningSessions[user.miningSessions.length - 1];
          const elapsedTime = Math.floor((new Date() - new Date(currentSession.startTime)) / 1000);
          const remainingTime = Math.max(0, currentSession.duration - elapsedTime);

          return res.status(200).json({
            startTime: currentSession.startTime,
            duration: currentSession.duration,
            coins: user.earned_coins,
            stone: currentSession.stone,
            remainingTime,
          });
        } else {
          return res.status(200).json({
            startTime: null,
            duration: 0,
            coins: user ? user.earned_coins : 0,
            stone: 0,
            remainingTime: 0,
          });
        }
      } catch (error) {
        console.error('Failed to retrieve mining data:', error);
        return res.status(500).json({ error: 'Failed to fetch data' });
      }

    case 'PUT':
      try {
        if (action === 'start-mining') {
          const miningSession = await prisma.miningSession.upsert({
            where: { user_id: userId },
            update: { startTime, status: 'active' },
            create: { user_id: userId, startTime, duration: 28800, status: 'active' },
          });

          return res.status(200).json({ message: 'Mining session started' });
        } else if (action === 'sell-stone') {
          const updatedSession = await prisma.miningSession.updateMany({
            where: { user_id: userId, status: 'active' },
            data: { status: 'completed' },
          });

          const updatedUser = await prisma.user.update({
            where: { user_id: userId },
            data: { earned_coins: { increment: 500 } },
          });

          return res.status(200).json({ message: 'Stone sold' });
        }
      } catch (error) {
        console.error('Error updating mining session:', error);
        return res.status(500).json({ error: 'Failed to save mining data' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).end(Method ${method} Not Allowed);
  }
}
