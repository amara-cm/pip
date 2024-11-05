import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}
