import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  const client = await connectToDatabase();

  if (req.method === 'POST') {
    const { userId, username } = req.body;

    try {
      await client.query(
        'INSERT INTO users (user_id, username) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING',
        [userId, username]
      );
      return res.status(201).json({ message: 'User added or already exists.' });
    } catch (error) {
      console.error('Error inserting user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query;

    try {
      const { rows } = await client.query('SELECT * FROM users WHERE user_id = $1', [userId]);
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
