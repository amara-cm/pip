// pages/api/gameHistory.js
import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, action, amount } = req.body;

    // Validate required fields
    if (!userId || !action) {
      return res.status(400).json({ error: 'User ID and action are required' });
    }

    try {
      const historyEntry = await prisma.gameHistory.create({
        data: {
          action,
          amount: amount || 0, // Default to 0 if amount is not provided
          userId,
        },
      });

      return res.status(201).json(historyEntry);
    } catch (error) {
      console.error('Error creating game history entry:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query;

    // Validate required query parameter
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const history = await prisma.gameHistory.findMany({
        where: { userId: Number(userId) },
      });

      return res.status(200).json(history);
    } catch (error) {
      console.error('Error fetching game history:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
