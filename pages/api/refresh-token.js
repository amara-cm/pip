import { refreshToken } from '../../lib/paseto';

export default async function handler(req, res) {
  const { userId, token } = req.body;

  if (req.method === 'POST') {
    try {
      const newToken = await refreshToken(userId, token);
      res.status(200).json({ token: newToken });
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(400).json({ message: 'Invalid token' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
