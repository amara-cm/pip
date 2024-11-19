import supabase from '../../lib/db';
import { generateToken } from '../../lib/paseto';

export default async function handler(req, res) {
  const { id, action } = req.body;

  if (req.method === 'POST') {
    if (action === 'menu_tap') {
      try {
        const token = await generateToken(id);
        // Respond with the generated token
        res.status(200).json({ token });
      } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
    // Existing logic for other actions
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
