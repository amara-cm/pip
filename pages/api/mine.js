import prisma from '../../lib/db'; // Importing Prisma client

export default async function handler(req, res) {
  const { userId } = req.body; // Assuming userId comes from the request body

  if (req.method === 'POST') {
    try {
      // Update mining progress and coins
      const user = await prisma.user.update({
        where: { user_id: userId },
        data: {
          // Assuming you have a field for tracking mining progress and coins
          miningProgress: { increment: 1 }, // Increment mining progress
          coins: { increment: 500 }, // Add 500 coins after mining
        },
      });
      return res.status(200).json({ message: 'Mining successful!', user });
    } catch (error) {
      console.error('Error during mining:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
