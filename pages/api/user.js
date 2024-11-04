import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { telegramId, telegramUsername, ipAddress } = req.body;

  if (!telegramId || !telegramUsername) {
    return res.status(400).json({ error: 'Telegram ID and username are required' });
  }

  try {
    // Check if the user already exists
    let user = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      // If the user doesn't exist, create a new one
      user = await prisma.user.create({
        data: {
          telegramId,
          username: telegramUsername,
          ipAddress,
        },
      });
    } else {
      // Update user IP address if needed
      user = await prisma.user.update({
        where: { telegramId },
        data: {
          ipAddress,
        },
      });
    }

    // Return user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
}
