import prisma from '../../lib/db';

export default async function handler(req, res) {
  const { taskId, telegramId } = req.body;

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const user = await prisma.user.findUnique({ where: { telegramId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.task.update({
      where: { id: taskId },
      data: { completedById: user.id },
    });

    const updatedUser = await prisma.user.update({
      where: { telegramId },
      data: { points: user.points + task.reward },
    });

    res.status(200).json({ success: true, points: updatedUser.points });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
}
