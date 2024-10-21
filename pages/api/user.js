import prisma from '../../lib/db';

export default async function handler(req, res) {
  // Check for the request method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { telegramUsername } = req.body; // Expecting telegramUsername in the request body

  // Validate telegramUsername
  if (!telegramUsername) {
    return res.status(400).json({ error: 'Telegram username is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { telegramUsername: telegramUsername }, // Fetch the user by telegramUsername
    });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user); // Respond with user data
  } catch (error) {
    console.error('Error fetching user:', error); // Log error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma Client disconnects after the request
  }
}
