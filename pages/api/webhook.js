import { Telegraf } from 'telegraf';
import prisma from '../../lib/db'; // Ensure this is your Prisma client instance

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleTelegramUser(req, res); // Handle incoming Telegram updates
  }

  if (req.method === 'GET') {
    return handleUserFetch(req, res); // Fetch user data
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

async function handleTelegramUser(req, res) {
  try {
    const update = req.body;

    // Check if the necessary data is present
    if (!update.message || !update.message.from) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const { id: userId, username } = update.message.from;

    // Ensure the user_id is a string
    const userIdString = String(userId);

    // Upsert user data in Neon Postgres using Prisma
    await prisma.user.upsert({
      where: { user_id: userIdString },
      update: {}, // No updates necessary
      create: { user_id: userIdString, username },
    });

    return res.status(200).json({ user_id: userIdString, username });
  } catch (error) {
    console.error('Error handling Telegram data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleUserFetch(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
