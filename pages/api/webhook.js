import { Telegraf } from 'telegraf';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../lib/db';
import { generateToken } from '../../lib/paseto';

const PASETO_SECRET = process.env.PASETO_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const rawBody = await getRawBody(req);
      const update = JSON.parse(rawBody);

      await handleTelegramUpdate(update, res);
    } catch (error) {
      console.error('Error processing update:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

async function handleTelegramUpdate(update, res) {
  const { message } = update;

  if (!message || !message.from) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const { id, username, first_name } = message.from;
  const uniqueId = uuidv4();

  try {
    const { error: userError } = await supabase
      .from('User')
      .upsert({ id: uniqueId, user_id: id, username, first_name, lastActive: new Date() });

    if (userError) throw userError;

    const token = await generateToken(id, '30m');
    const autoLoginLink = `https://yourgame.com/auto-login?token=${token}`;

    // Send auto-login link to the user via Telegram (assuming you have a method to do this)
    // sendTelegramMessage(id, `Click here to login: ${autoLoginLink}`);

    return res.status(200).json({ message: 'Update received', autoLoginLink });
  } catch (error) {
    console.error('Error saving/updating user data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

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
