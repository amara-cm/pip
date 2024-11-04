// pages/api/device.js
import prisma from '../../lib/db';

export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'];

  // Ensure the user-agent is present
  if (!userAgent) {
    return res.status(400).json({ error: 'User agent is required' });
  }

  try {
    // Log the device access
    await prisma.device_logs.create({
      data: {
        user_agent: userAgent,
        access_time: new Date(),
      },
    });

    // Check if the request is from a mobile device
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(userAgent);
    if (!isMobile) {
      await prisma.desktop_access_logs.create({
        data: {
          user_agent: userAgent,
          access_time: new Date(),
        },
      });
      return res.redirect(307, '/mobile-only');
    }

    // Redirect mobile users to the main page
    return res.redirect(307, '/');
  } catch (error) {
    console.error('Error logging to database:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
