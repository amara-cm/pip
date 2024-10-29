import prisma from '../../lib/db'; // Adjust the path if necessary

export default async function handler(req, res) {
    const userAgent = req.headers['user-agent'];

    try {
        // Log the user-agent to the device_logs table
        await prisma.device_logs.create({
            data: {
                user_agent: userAgent,
                access_time: new Date(),
            },
        });

        // Check if the request comes from a mobile device
        if (!/Mobi|Android|iPhone|iPad/i.test(userAgent)) {
            // If it's a desktop, log this access attempt
            await prisma.desktop_access_logs.create({
                data: {
                    user_agent: userAgent,
                    access_time: new Date(),
                },
            });

            // Redirect to the mobile-only page
            return res.redirect(307, '/mobile-only');
        }

        // If it's a mobile device, allow access to the main app
        return res.redirect(307, '/');
    } catch (error) {
        console.error('Error logging to database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
