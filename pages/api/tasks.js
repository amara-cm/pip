// /pages/api/tasks.js
import prisma from '../../lib/db';

// Helper function to calculate daily streak reward
const calculateDailyReward = (streak) => {
  const rewards = [10, 20, 30, 40, 50, 60, 100]; // Rewards for days 1-7
  return rewards[Math.min(streak, 6)];
};

export default async function handler(req, res) {
  const { userId, action } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (action === 'claim') {
      // Daily login claim logic
      const now = new Date();
      const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const userLogin = await prisma.dailyLogin.findUnique({ where: { user_id: userId } });

      // If no record or missed login day, reset streak
      let streak = 0;
      if (userLogin) {
        const lastClaim = userLogin.lastClaim.toISOString().slice(0, 10);
        const daysPassed = (new Date(today) - new Date(lastClaim)) / (1000 * 60 * 60 * 24);

        if (daysPassed === 1) {
          streak = userLogin.currentStreak + 1;  // Continue streak
        } else if (daysPassed > 1) {
          streak = 1;  // Reset streak
        }
      } else {
        streak = 1;  // First time claim
      }

      const reward = calculateDailyReward(streak);

      await prisma.$transaction([
        prisma.dailyLogin.upsert({
          where: { user_id: userId },
          update: { currentStreak: streak, lastClaim: now, streakReward: reward },
          create: { user_id: userId, currentStreak: streak, lastClaim: now, streakReward: reward, nextClaimDue: new Date(now.setHours(24, 0, 0, 0)) },
        }),
        prisma.user.update({
          where: { user_id: userId },
          data: { coins: { increment: reward } },  // Add daily reward coins
        })
      ]);

      res.status(200).json({ message: `Claimed ${reward} coins for day ${streak}` });
    } 
    else if (action === 'completeTask') {
      const { taskId } = req.body;

      const task = await prisma.task.findUnique({ where: { id: taskId } });
      if (!task || task.isComplete) {
        return res.status(400).json({ message: 'Task already completed or not found.' });
      }

      await prisma.$transaction([
        prisma.task.update({
          where: { id: taskId },
          data: { isComplete: true },
        }),
        prisma.user.update({
          where: { user_id: userId },
          data: { coins: { increment: task.rewardCoins } },  // Add task reward coins
        })
      ]);

      res.status(200).json({ message: `Task completed, ${task.rewardCoins} coins added.` });
    } 
    else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Tasks API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
