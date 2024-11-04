import prisma, { connectToDatabase } from './db';

export default async function handler(req, res) {
  await connectToDatabase();

  const { userId } = req.body;

  if (req.method === 'POST') {
    try {
      // Example logic for mining Pink Star Diamonds
      const miningProgress = await prisma.miningProgress.create({
        data: {
          userId,
          diamondsMined: 1, // Example increment, should be calculated based on time or other logic
          timestamp: new Date(),
        },
      });

      // Update user's total diamonds
      await prisma.user.update({
        where: { userId },
        data: {
          diamonds: { increment: 1 }, // Update the diamonds count
        },
      });

      return res.status(200).json(miningProgress);
    } catch (error) {
      console.error('Error during mining operation:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
