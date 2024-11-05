import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case 'POST':
      const userId = body.userId;

      // Start mining session
      if (body.action === 'start-mining') {
        // Check if there's already an active mining session
        const existingSession = await prisma.miningSession.findFirst({
          where: { user_id: userId, status: 'active' },
        });

        if (existingSession) {
          return res.status(400).json({ error: 'Mining session already active' });
        }

        const miningSession = await prisma.miningSession.create({
          data: {
            user_id: userId,
            startTime: new Date(),
            duration: 28800, // 8 hours
            status: 'active',
          },
        });
        return res.status(201).json(miningSession);
      }

      // Sell stone
      if (body.action === 'sell-stone') {
        await prisma.miningSession.updateMany({
          where: { user_id: userId, status: 'active' },
          data: { status: 'completed' },
        });
        await prisma.user.update({
          where: { user_id: userId },
          data: { earned_coins: { increment: 500 } },
        });
        return res.status(200).json({ message: 'Stone sold' });
      }

      // Get mining session
      if (body.action === 'get-mining-session') {
        const miningSession = await prisma.miningSession.findFirst({
          where: { user_id: userId, status: 'active' },
        });
        return res.status(200).json(miningSession);
      }

      return res.status(400).json({ error: 'Invalid action' });
    
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
