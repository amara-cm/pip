// pages/api/referrals.js
import prisma from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { referrerId, referredUserId } = req.body;

        if (!referrerId || !referredUserId) {
            return res.status(400).json({ error: 'Both referrer ID and referred user ID are required' });
        }

        try {
            const referredUser = await prisma.user.findUnique({
                where: { id: referredUserId },
            });

            if (!referredUser) {
                return res.status(404).json({ error: 'Referred user not found' });
            }

            const updatedUser = await prisma.user.update({
                where: { id: referredUserId },
                data: { referrerId },
            });

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error processing referral:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'GET') {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const referrals = await prisma.user.findMany({
                where: { referrerId: Number(userId) },
            });

            res.status(200).json(referrals);
        } catch (error) {
            console.error('Error fetching referrals:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
