import { PrismaClient } from '@prisma/client';

let prisma;
const instantiatePrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  } else {
    prisma.$disconnect(); // Disconnect the previous client
    prisma = new PrismaClient(); // Reinstantiate the Prisma client
  }
};

export default async function handler(req, res) {
  instantiatePrisma(); // Ensure Prisma client is instantiated

  const { id, username, first_name, action, earnedCoins, mineCountdown, dailyClaimTimer, gameInteractions, completedTasks, coins } = req.body;

  if (req.method === 'POST') {
    if (action === 'save' || action === 'retrieve') {
      try {
        if (action === 'save') {
          await prisma.userData.upsert({
            where: { user_id: id },
            update: { earnedCoins, mineCountdown, dailyClaimTimer, gameInteractions, completedTasks },
            create: { user_id: id, earnedCoins, mineCountdown, dailyClaimTimer, gameInteractions, completedTasks },
          });

          if (coins !== undefined) {
            await prisma.user.update({
              where: { user_id: id },
              data: { coins: { increment: coins } },
            });
          }

          return res.status(200).json({ message: 'User data saved successfully' });
        } else if (action === 'retrieve') {
          const userData = await prisma.userData.findUnique({
            where: { user_id: id },
          });

          if (userData) {
            const user = await prisma.user.findUnique({
              where: { user_id: id },
            });

            return res.status(200).json({ ...userData, coins: user ? user.coins : 0 });
          } else {
            return res.status(404).json({ message: 'No user data found.' });
          }
        }
      } catch (error) {
        console.error('User data API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      try {
        await prisma.user.upsert({
          where: { user_id: String(id) },
          update: { username, first_name },
          create: { user_id: String(id), username, first_name },
        });

        return res.status(201).json({ message: 'User created/updated', userId: String(id) });
      } catch (error) {
        console.error('Error upserting user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } else if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const user = await prisma.user.findUnique({
        where: { user_id: String(id) },
      });

      if (user) {
        return res.status(200).json({ userId: user.user_id, username: user.username, firstName: user.first_name });
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error finding user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
