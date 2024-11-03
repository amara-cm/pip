import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { telegramUsername, telegramId, tasks, referral, miningProgress, rewards, inGameCurrency, ipAddress, gameHistory } = req.body;

  // Ensure required fields are present
  if (!telegramUsername || !telegramId) {
    return res.status(400).json({ error: 'Telegram username and ID are required' });
  }

  try {
    // Check if the user exists in the database
    const user = await prisma.user.upsert({
      where: { telegramId },
      update: {
        telegramUsername,
        tasks: tasks || undefined,
        referral: referral || undefined,
        miningProgress: miningProgress || undefined,
        rewards: rewards || undefined,
        inGameCurrency: inGameCurrency || undefined,
        ipAddress: ipAddress || undefined,
        gameHistory: gameHistory || undefined,
      },
      create: {
        telegramId,
        telegramUsername,
        tasks: tasks || [],
        referral: referral || null,
        miningProgress: miningProgress || 0,
        rewards: rewards || 0,
        inGameCurrency: inGameCurrency || 0,
        ipAddress: ipAddress || null,
        gameHistory: gameHistory || [],
      },
    });

    // Return user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating/fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
