import prisma from '../../lib/db';
import fetch from 'node-fetch';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const notifyTelegram = async (telegramId, message) => {
  await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: telegramId, text: message }),
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { taskId, telegramId } = req.body;

  if (!taskId || !telegramId) {
    return res.status(400).json({ error: 'Task ID and Telegram ID are required' });
  }

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const user = await prisma.user.findUnique({ where: { telegramId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.task.update({
      where: { id: taskId },
      data: { completed: true, userId: user.id },
    });

    const updatedUser = await prisma.user.update({
      where: { telegramId },
      data: { points: user.points + task.reward },
    });

    await notifyTelegram(telegramId, `Task completed: ${task.taskName}. You have earned ${task.reward} points.`);

    res.status(200).json({ success: true, points: updatedUser.points });
  } catch (error) {
    console.error('Error in tasks.js:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
