import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Handle POST request to save or retrieve mining progress
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId } = req.body;

    try {
      // Fetch the current user's mining session
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { miningStartTime, collectedStone, earnedCoins } = user;

      // Check if the mining session is still active
      if (miningStartTime) {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - new Date(miningStartTime)) / 1000); // seconds

        const remainingTime = Math.max(0, 28800 - elapsedTime); // 8 hours = 28800 seconds
        const stone = (elapsedTime >= 28800) ? collectedStone : collectedStone + (elapsedTime / 28800);

        return res.status(200).json({
          startTime: miningStartTime,
          duration: 28800,  // 8 hours
          timer: remainingTime,
          stone,
          coins: earnedCoins
        });
      } else {
        // If no active mining session
        return res.status(200).json({
          startTime: null,
          duration: 28800,  // 8 hours
          timer: 28800,
          stone: 0,
          coins: earnedCoins
        });
      }

    } catch (error) {
      return res.status(500).json({ error: 'Error fetching mining data' });
    }
  }

  // Handle PUT request to update mining progress
  if (req.method === 'PUT') {
    const { userId, startTime, stone, coins } = req.body;

    try {
      // Update mining session in the database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          miningStartTime: startTime,
          collectedStone: stone,
          earnedCoins: coins,
        },
      });

      return res.status(200).json({ message: 'Mining session updated successfully' });

    } catch (error) {
      return res.status(500).json({ error: 'Error updating mining session' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
