import { Telegraf } from 'telegraf';
import supabase from '../../lib/supabase'; // Import Supabase client from your lib/supabase.js

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

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

  // Store or update user data in Supabase
  try {
    const { data, error } = await supabase
      .from('users') // Make sure your table is named 'users' or adjust accordingly
      .upsert([
        {
          telegram_uid: id, // Use Telegram UID
          username,
          first_name,
        },
      ]);

    if (error) {
      throw error;
    }

    console.log(`User data for ${username || 'Pinx'} stored/updated successfully.`);
  } catch (error) {
    console.error('Error saving/updating user data in Supabase:', error);
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