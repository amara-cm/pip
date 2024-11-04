import prisma from '../../lib/db'; // Importing Prisma client

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleReferral(req, res); // Handle referral creation and rewarding
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

// Helper function to handle referral creation and rewards
async function handleReferral(req, res) {
  const { inviterId, inviteeId } = req.body;

  // Validate input data
  if (!inviterId || !inviteeId) {
    return res.status(400).json({ error: 'Inviter ID and Invitee ID are required' });
  }

  try {
    // Create the referral entry
    const referral = await prisma.referral.create({
      data: {
        inviterId: inviterId,
        inviteeId: inviteeId,
      },
    });

    // Reward both inviter and invitee with 500 coins each
    await prisma.user.updateMany({
      where: {
        user_id: {
          in: [inviterId, inviteeId],
        },
      },
      data: {
        coins: { increment: 500 }, // Increment coins by 500 for both users
      },
    });

    return res.status(201).json({ message: 'Referral successful!', referral });
  } catch (error) {
    console.error('Error during referral:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
