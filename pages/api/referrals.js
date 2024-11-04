import prisma from '../../lib/db'; // Importing Prisma client

export default async function handler(req, res) {
  const { inviterId, inviteeId } = req.body; // Assuming these come from the request body

  if (req.method === 'POST') {
    try {
      // Create or update referral
      const referral = await prisma.referral.create({
        data: {
          inviterId: inviterId,
          inviteeId: inviteeId,
        },
      });

      // Reward both inviter and invitee
      await prisma.user.updateMany({
        where: {
          user_id: {
            in: [inviterId, inviteeId],
          },
        },
        data: {
          coins: { increment: 500 }, // Give 500 coins to both
        },
      });

      return res.status(201).json({ message: 'Referral successful!', referral });
    } catch (error) {
      console.error('Error during referral:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
