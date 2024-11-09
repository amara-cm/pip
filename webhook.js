import { Telegraf } from 'telegraf';
import prisma from '../../lib/db'; // Ensure the path is correct

// Disable the default body parser for raw body handling
export const config = {
  api: {
    bodyParser: false,
  },
};

// Webhook handler
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const rawBody = await getRawBody(req); // Get raw body as a string
      const update = JSON.parse(rawBody); // Parse JSON

      await handleTelegramUpdate(update);
      return res.status(200).json({ message: 'Update received' });
    } catch (error) {
      console.error('Error processing update:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

// Function to handle Telegram updates
async function handleTelegramUpdate(update) {
  const { message } = update;

  if (!message || !message.from) return;

  const { id, username, first_name } = message.from;

  // Store or update user data in the database
  try {
    await prisma.user.upsert({
      where: { user_id: String(id) },
      update: {
        username,
        first_name,
        lastActive: new Date(), // Update last activity time
      },
      create: {
        user_id: String(id),
        username,
        first_name,
        lastActive: new Date(), // Set activity on creation
      },
    });

    console.log(`User data for ${username || 'Pinx'} stored/updated successfully.`);
  } catch (error) {
    console.error('Error saving/updating user data:', error);
  }
}

// Function to read raw body from the request (without micro)
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}