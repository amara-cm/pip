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
    const response = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error handling Telegram data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleUserFetch(req, res) {
  try {
    const response = await fetch(/api/userProfile?userId=${req.query.userId});
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
