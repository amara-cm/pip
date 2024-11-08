import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
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
            coins: user.coins + 500, // Add 500 coins on sell
          },
        });

        return res.status(200).json({ message: 'Coins updated!' });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
