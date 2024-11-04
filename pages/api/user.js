// pages/api/user.js

import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { telegramId, username, ipAddress } = req.body;

  if (!telegramId || !username) {
    return res.status(400).json({ error: 'Telegram ID and username are required' });
  }

  try {
    // Upsert user to handle both create and update operations
    const user = await prisma.user.upsert({
      where: { telegramId },
      update: { username, ipAddress }, // Update existing user data
      create: { telegramId, username, ipAddress }, // Create new user
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error processing user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
