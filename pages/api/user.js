// pages/api/user.js
import prisma from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { telegramId, telegramUsername, ipAddress, referrerId } = req.body;

    if (!telegramId || !telegramUsername) {
        return res.status(400).json({ error: 'Telegram ID and username are required' });
    }

    try {
        let user = await prisma.user.findUnique({
            where: { telegramId },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    telegramId,
                    username: telegramUsername,
                    ipAddress,
                    referrerId,
                },
            });
        } else {
            user = await prisma.user.update({
                where: { telegramId },
                data: { ipAddress },
            });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
