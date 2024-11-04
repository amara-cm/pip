// pages/api/device.js
import prisma from '../../lib/db';

export default async function handler(req, res) {
    const userAgent = req.headers['user-agent'];

    try {
        await prisma.device_logs.create({
            data: {
                user_agent: userAgent,
                access_time: new Date(),
            },
        });

        if (!/Mobi|Android|iPhone|iPad/i.test(userAgent)) {
            await prisma.desktop_access_logs.create({
                data: {
                    user_agent: userAgent,
                    access_time: new Date(),
                },
            });
            return res.redirect(307, '/mobile-only');
        }

        return res.redirect(307, '/');
    } catch (error) {
        console.error('Error logging to database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
