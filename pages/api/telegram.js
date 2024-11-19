import supabase from '../../lib/db';
import { generateToken } from '../../lib/paseto';

export default async function handler(req, res) {
  const { id, action } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!id || !action) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    switch (action) {
      case 'menu_tap':
        const token = await generateToken(id, '30m');
        const autoLoginLink = `https://yourgame.com/auto-login?token=${token}`;
        // Send auto-login link to the user via Telegram
        // sendTelegramMessage(id, `Click here to login: ${autoLoginLink}`);
        return res.status(200).json({ token, autoLoginLink });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
