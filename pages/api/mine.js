import prisma from '../../lib/db';

export default async function handler(req, res) {
  // Ensure that only POST requests are handled
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { telegramId } = req.body;

  // Validate the input
  if (!telegramId) {
    return res.status(400).json({ error: 'Telegram ID is required' });
  }

  try {
    // Fetch the user based on telegramId
    const user = await prisma.user.findUnique({ where: { telegramId } });
    
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stonesMined = 1; // Define the amount of stones mined
    // Update the user's points by adding the mined stones
    const updatedUser = await prisma.user.update({
      where: { telegramId },
      data: { points: user.points + stonesMined },
    });

    // Respond with success and the updated points
    return res.status(200).json({ success: true, points: updatedUser.points });
  } catch (error) {
    console.error('Error in mine.js:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
