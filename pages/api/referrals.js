import prisma from '../../lib/db';

export default async function handler(req, res) {
  const { inviterId, inviteeId } = req.body;

  try {
    const inviter = await prisma.user.findUnique({ where: { telegramId: inviterId } });
    if (!inviter) return res.status(404).json({ error: 'Inviter not found' });

    const invitee = await prisma.user.create({
      data: { telegramId: inviteeId, username: 'InviteeUsername' } // Adjust to capture actual username
    });

    await prisma.user.update({
      where: { telegramId: inviterId },
      data: { referrals: inviter.referrals + 1, points: inviter.points + 1000 }, // 1000 points for inviting
    });

    res.status(200).json({ success: true, referralId: invitee.telegramId });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
}
