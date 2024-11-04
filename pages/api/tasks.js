import prisma from '../../lib/db'; // Import Prisma client

export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (req.body.taskId) {
      return handleTaskCompletion(req, res); // If taskId is present, it's for task completion
    }

    return handleTaskCreation(req, res); // If no taskId, it's for creating a new task
  }

  if (req.method === 'GET') {
    return handleTaskFetch(req, res); // Handling GET requests to fetch tasks
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

// Helper function to create a new task
async function handleTaskCreation(req, res) {
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

    return res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Helper function to fetch tasks for a specific user
async function handleTaskFetch(req, res) {
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
}

// Helper function to track completed tasks
async function handleTaskCompletion(req, res) {
  const { userId, taskId } = req.body;

  if (!userId || !taskId) {
    return res.status(400).json({ error: 'User ID and task ID are required' });
  }

  try {
    // Update or create task completion record
    const task = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        completed: true,
      },
    });

    return res.status(200).json({ message: 'Task completed successfully', task });
  } catch (error) {
    console.error('Error tracking task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
