import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, referredUserId } = req.body;

    try {
      const referrer = await prisma.user.findUnique({
        where: { user_id: userId },
      });

      if (!referrer) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Store referral
      await prisma.referral.upsert({
        where: { user_id: referrer.user_id },
        update: {
          referralCount: { increment: 1 }, // Increase referral count
        },
        create: {
          user_id: referrer.user_id,
          referralCount: 1,
          referralCoins: 0, // Can be updated later for rewards
        },
      });

      return res.status(200).json({ message: 'Referral stored' });
    } catch (error) {
      console.error('Error storing referral:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
