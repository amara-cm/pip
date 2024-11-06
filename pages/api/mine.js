import prisma from "../../lib/db";

export default async function handler(req, res) {
  const { userId, startTime, stone, coins } = req.body;

  if (req.method === 'PUT') {
    // Update mining session
    try {
      // Get the current user
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: {
          miningSessions: true, // To track the mining session for the user
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create or update a mining session for the user
      const miningSession = await prisma.miningSession.upsert({
        where: { user_id: userId },
        update: {
          startTime: new Date(startTime),
          stone: stone,
          coins: coins,
        },
        create: {
          user_id: userId,
          startTime: new Date(startTime),
          stone: stone,
          coins: coins,
          duration: 28800, // 8 hours duration
          status: 'mining',
        },
      });

      return res.status(200).json(miningSession);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === 'GET') {
    // Get the current mining session of the user
    const { userId } = req.query;

    try {
      const miningSession = await prisma.miningSession.findUnique({
        where: { user_id: userId },
      });

      if (!miningSession) {
        return res.status(404).json({ message: "Mining session not found" });
      }

      return res.status(200).json(miningSession);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Method not allowed
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
