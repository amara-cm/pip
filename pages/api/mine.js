import prisma from '../../lib/db';

// Helper function to check if the mining session is completed
const checkMiningCompletion = (countdownEnd) => {
  return new Date() >= new Date(countdownEnd);
};

export default async function handler(req, res) {
  const { userId, action } = req.body;  // action can be 'start', 'sell', or 'status'

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (action === 'start') {
      // Start mining logic
      const now = new Date();
      const countdownEnd = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8-hour countdown

      await prisma.miningSession.upsert({
        where: { user_id: userId },
        update: { countdownEnd, canSell: false, stonesMined: 0 },
        create: { user_id: userId, countdownEnd, stonesMined: 0, canSell: false },
      });

      res.status(200).json({ message: 'Mining started', countdownEnd });
    } 
    else if (action === 'sell') {
      // Sell mined stones (check if mining is complete)
      const miningSession = await prisma.miningSession.findUnique({
        where: { user_id: userId },
      });

      if (!miningSession) {
        return res.status(400).json({ message: 'No mining session found.' });
      }

      if (!checkMiningCompletion(miningSession.countdownEnd)) {
        return res.status(400).json({ message: 'Mining is not complete yet.' });
      }

      // Mining complete, allow sell
      await prisma.$transaction([
        prisma.user.update({
          where: { user_id: userId },
          data: { coins: { increment: 500 } },  // Add 500 coins
        }),
        prisma.miningSession.update({
          where: { user_id: userId },
          data: { canSell: true, stonesMined: 500, countdownEnd: null },  // Reset mining session
        })
      ]);

      res.status(200).json({ message: '500 coins added, mining session reset' });
    } 
    else if (action === 'status') {
      // Retrieve the current mining session data
      const miningSession = await prisma.miningSession.findUnique({
        where: { user_id: userId },
      });

      if (!miningSession) {
        return res.status(404).json({ message: 'No mining session found.' });
      }

      res.status(200).json(miningSession);
    } 
    else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Mining API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
