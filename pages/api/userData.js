import prisma from '../../lib/db';

export default async function handler(req, res) {
    const { userId, action, earnedCoins, mineCountdown, dailyClaimTimer, gameInteractions, completedTasks, coins } = req.body;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        if (action === 'save') {
            await prisma.userData.upsert({
                where: { user_id: userId },
                update: { earnedCoins, mineCountdown, dailyClaimTimer, gameInteractions, completedTasks },
                create: { user_id: userId, earnedCoins, mineCountdown, dailyClaimTimer, gameInteractions, completedTasks },
            });

            if (coins !== undefined) {
                await prisma.user.update({
                    where: { user_id: userId },
                    data: { coins: { increment: coins } },
                });
            }

            res.status(200).json({ message: 'User data saved successfully' });
        } else if (action === 'retrieve') {
            const userData = await prisma.userData.findUnique({
                where: { user_id: userId },
            });

            if (userData) {
                const user = await prisma.user.findUnique({
                    where: { user_id: userId },
                });

                res.status(200).json({ ...userData, coins: user ? user.coins : 0 });
            } else {
                res.status(404).json({ message: 'No user data found.' });
            }
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        console.error('User data API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
