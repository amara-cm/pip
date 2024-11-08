import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, taskAction } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (taskAction === 'claimDailyLogin') {
        const dailyLogin = await prisma.dailyLogin.findUnique({
          where: { user_id: user.user_id },
        });

        const nextClaimDue = new Date();
        nextClaimDue.setUTCDate(nextClaimDue.getUTCDate() + 1); // Daily claim resets after 1 day

        await prisma.dailyLogin.update({
          where: { user_id: user.user_id },
          data: {
            currentStreak: dailyLogin ? dailyLogin.currentStreak + 1 : 1,
            lastClaim: new Date(),
            nextClaimDue,
          },
        });

        return res.status(200).json({ message: 'Daily login claimed!' });
      }

      // Handle task completion here
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
