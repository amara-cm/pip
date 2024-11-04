import { Telegraf } from 'telegraf'; // Telegram API
import prisma from '../../lib/db';   // Prisma client for DB access

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Handling requests from Telegram (webhook-based user creation)
    if (req.body.message) {
      return handleTelegramUser(req, res); // If message data is present, it's from Telegram
    }

    // Handling regular POST requests (manually creating/updating users)
    return handleUserCreation(req, res);
  }

  if (req.method === 'GET') {
    return handleUserFetch(req, res); // Handling fetching user details
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

// Helper function to handle Telegram user creation/upsert
async function handleTelegramUser(req, res) {
  try {
    const { message } = req.body;

    if (!message.from || !message.from.id || !message.from.username) {
      return res.status(400).json({ error: 'Invalid request from Telegram' });
    }

    const userId = String(message.from.id);
    const username = message.from.username;

    // Upsert user data in Neon Postgres using Prisma
    const user = await prisma.user.upsert({
      where: { user_id: userId },
      update: {}, // No updates necessary
      create: { user_id: userId, username },
    });

    return res.status(200).json({ message: 'User stored successfully', user });
  } catch (error) {
    console.error('Error handling Telegram data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Helper function to handle manual user creation/upsert
async function handleUserCreation(req, res) {
  try {
    const { userId, username } = req.body;

    if (!userId || !username) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    // Upsert user in the database
    const user = await prisma.user.upsert({
      where: { user_id: userId },
      update: {}, // No updates necessary
      create: { user_id: userId, username },
    });

    return res.status(201).json({ message: 'User added or already exists', user });
  } catch (error) {
    console.error('Error inserting user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Helper function to fetch user data by userId
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
