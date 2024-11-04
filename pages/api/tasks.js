import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, title } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ error: 'User ID and title are required' });
    }

    try {
      const task = await prisma.task.create({
        data: {
          title,
          userId: Number(userId), // Ensure userId is a number
        },
      });

      return res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const tasks = await prisma.task.findMany({
        where: { userId: Number(userId) },
      });

      if (!tasks.length) {
        return res.status(404).json({ message: 'No tasks found for this user.' });
      }

      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
