import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { user_id, coins } = req.body;
    await prisma.user.update({
      where: { user_id: String(user_id) },
      data: { earned_coins: coins },
    });
    return res.status(200).json({ message: 'Coins updated' });
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

