import prisma from '../../lib/db'; // Importing Prisma client

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleMining(req, res); // Handle mining progress and coin increment
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

// Helper function to handle mining operation
async function handleMining(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Update user's mining progress and in-game currency (coins)
    const user = await prisma.user.update({
      where: { user_id: String(userId) },
      data: {
        miningProgress: { increment: 1 },  // Increment mining progress by 1
        coins: { increment: 500 },         // Increment coins by 500 after mining
      },
    });

    return res.status(200).json({ message: 'Mining successful!', user });
  } catch (error) {
    console.error('Error during mining:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
