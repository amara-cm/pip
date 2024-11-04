import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { referrerId, referredUserId } = req.body;

    // Validate input
    if (!referrerId || !referredUserId) {
      return res.status(400).json({ error: 'Both referrer ID and referred user ID are required' });
    }

    try {
      // Check if the referred user exists
      const referredUser = await prisma.user.findUnique({
        where: { id: Number(referredUserId) }, // Ensure this is a number
      });

      if (!referredUser) {
        return res.status(404).json({ error: 'Referred user not found' });
      }

      // Update the referred user with the referrer ID
      const updatedUser = await prisma.user.update({
        where: { id: Number(referredUserId) },
        data: { referrerId: Number(referrerId) },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error processing referral:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query;

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      // Fetch referrals for the given user ID
      const referrals = await prisma.user.findMany({
        where: { referrerId: Number(userId) },
      });

      // Return the referrals found
      return res.status(200).json(referrals);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle unsupported methods
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
