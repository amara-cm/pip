import supabase from '../../lib/db';
import { generateToken } from '../../lib/paseto';

export default async function handler(req, res) {
  const { id, action } = req.body;

  if (req.method === 'POST') {
    if (action === 'menu_tap') {
      try {
        const token = await generateToken(id, '30m');
        const autoLoginLink = `https://yourgame.com/auto-login?token=${token}`;
        // Send auto-login link to the user via Telegram
        // sendTelegramMessage(id, `Click here to login: ${autoLoginLink}`);
        res.status(200).json({ token, autoLoginLink });
      } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
