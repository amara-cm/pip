import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, coins } = req.body;

    try {
      const user = await prisma.user.update({
        where: { user_id: userId },
        data: { coins: { increment: coins } }, // Increment coins
      });

      return res.status(200).json({ message: `Coins updated to ${user.coins}` });
    } catch (error) {
      console.error('Error updating coins:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
