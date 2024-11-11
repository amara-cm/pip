// /pages/api/referrals.js
import prisma from '../../lib/db';

export default async function handler(req, res) {
  const { userId, referredUserId } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Add referral logic
    await prisma.referral.upsert({
      where: { user_id: userId },
      update: {
        referralCount: { increment: 1 },
      },
      create: { user_id: userId, referralCount: 1 },
    });

    // Add referred user logic
    await prisma.user.create({
      data: {
        user_id: referredUserId,
        referredById: userId,
      }
    });

    res.status(200).json({ message: 'Referral added successfully' });
  } catch (error) {
    console.error('Referral API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
