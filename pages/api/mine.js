import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handleMining = async (userId) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Create a new mining session
  const miningSession = await prisma.miningSession.create({
    data: {
      user_id: user.id,
      startTime: new Date(),
      duration: 28800, // Duration in seconds (8 hours)
      status: 'active',
    },
  });

  return miningSession;
};

export const completeMiningSession = async (userId) => {
  // Update the mining session to completed
  const miningSession = await prisma.miningSession.updateMany({
    where: {
      user_id: userId,
      status: 'active',
    },
    data: {
      status: 'completed',
      updatedAt: new Date(),
    },
  });

  // Update user earned coins based on the mining session
  if (miningSession.count > 0) {
    await prisma.user.update({
      where: { user_id: userId },
      data: {
        earned_coins: {
          increment: 500, // Assume 500 coins earned after mining
        },
      },
    });
  }

  return miningSession;
};
