import { Telegraf } from 'telegraf';
import prisma from '../../lib/db';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleTelegramUser(req, res);
  }

  if (req.method === 'GET') {
    return handleUserFetch(req, res);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

async function handleTelegramUser(req, res) {
  try {
    const { id, username, first_name } = req.body;

    await prisma.user.upsert({
      where: { user_id: String(id) },
      update: { username, first_name },
      create: { user_id: String(id), username, first_name },
    });

    return res.status(200).json({ user_id: id, username, first_name });
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
