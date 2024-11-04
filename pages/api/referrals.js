import prisma, { connectToDatabase } from './db';

export default async function handler(req, res) {
  await connectToDatabase();

  const { inviterId, inviteeId } = req.body;

  if (req.method === 'POST') {
    try {
      // Logic to handle friend invitation
      const referral = await prisma.referral.create({
        data: {
          inviterId,
          inviteeId,
        },
      });
      
      // Example: Update coins for both inviter and invitee
      await prisma.user.updateMany({
        where: {
          userId: { in: [inviterId, inviteeId] },
        },
        data: {
          coins: { increment: 100 }, // Example increment
        },
      });

      return res.status(200).json(referral);
    } catch (error) {
      console.error('Error handling referral:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
