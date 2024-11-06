import prisma from "../lib/db"; // Ensure you import your Prisma client

export default async function handler(req, res) {
  const { method } = req;
  const { userId, startTime, stone, coins } = req.body;

  if (method === "GET") {
    try {
      // Retrieve the game state for the user from the database
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: { miningSessions: true },
      });

      // Check if the user has a current mining session
      if (user && user.miningSessions.length > 0) {
        const currentSession = user.miningSessions[user.miningSessions.length - 1]; // Get the latest mining session

        const elapsedTime = Math.floor((new Date() - new Date(currentSession.startTime)) / 1000); // Elapsed time in seconds
        const remainingTime = Math.max(0, currentSession.duration - elapsedTime); // Remaining time for mining session

        return res.status(200).json({
          startTime: currentSession.startTime,
          duration: currentSession.duration,
          coins: user.earned_coins,
          stone: currentSession.stone,
          remainingTime: remainingTime,
        });
      } else {
        return res.status(200).json({
          startTime: null,
          duration: 0,
          coins: user ? user.earned_coins : 0,
          stone: 0,
          remainingTime: 0,
        });
      }
    } catch (error) {
      console.error("Failed to retrieve mining data:", error);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
  } else if (method === "PUT") {
    try {
      // Update mining session details
      const updatedSession = await prisma.miningSession.upsert({
        where: { user_id: userId },
        update: {
          startTime: startTime,
          stone: stone,
          status: stone > 0 ? 'mining' : 'idle',
        },
        create: {
          user_id: userId,
          startTime: startTime,
          duration: 28800, // Default 8-hour duration for mining
          stone: stone,
          status: "mining",
        },
      });

      // Update the user's earned coins
      const user = await prisma.user.update({
        where: { user_id: userId },
        data: {
          earned_coins: coins,
        },
      });

      return res.status(200).json({
        message: "Mining session updated",
        session: updatedSession,
        user: user,
      });
    } catch (error) {
      console.error("Error updating mining session:", error);
      return res.status(500).json({ error: "Failed to save mining data" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
