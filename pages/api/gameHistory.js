import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, action, amount } = req.body;

    if (!userId || !action) {
      return res.status(400).json({ error: 'User ID and action are required' });
    }

    try {
      const historyEntry = await prisma.gameHistory.create({
        data: {
          action,
          amount: amount || 0,
          userId,
        },
      });

      res.status(201).json(historyEntry);
    } catch (error) {
      console.error('Error creating game history entry:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const history = await prisma.gameHistory.findMany({
        where: { userId: Number(userId) },
      });

      res.status(200).json(history);
    } catch (error) {
      console.error('Error fetching game history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
