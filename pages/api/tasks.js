import prisma from '../../lib/db';

// Define the tasks array with customizable properties
const tasks = [
  {
    id: 1,
    name: 'Invite Friends',
    reward: 100,
    completed: false,
    link: '', // Add your link here
    counter: {
      target: 3,
      current: 0,
    },
  },
  {
    id: 2,
    name: 'Subscribe to Pink Channel',
    reward: 200,
    completed: false,
    link: 'https://your-link.com/pink-channel', // Replace with the actual link
  },
  {
    id: 3,
    name: 'Join Pink Community',
    reward: 100,
    completed: false,
    link: 'https://your-link.com/pink-community', // Replace with the actual link
  },
  {
    id: 4,
    name: 'Follow us on X',
    reward: 200,
    completed: false,
    link: 'https://your-link.com/follow-x', // Replace with the actual link
  },
  {
    id: 5,
    name: 'Follow us on Instagram',
    reward: 200,
    completed: false,
    link: 'https://your-link.com/follow-instagram', // Replace with the actual link
  },
  {
    id: 6,
    name: 'Subscribe to our YouTube channel',
    reward: 100,
    completed: false,
    link: 'https://your-link.com/subscribe-youtube', // Replace with the actual link
  },
  {
    id: 7,
    name: 'Invite a Friend',
    reward: 50,
    completed: false,
    link: '', // Add your link here
  },
  {
    id: 8,
    name: 'Invite 3 Friends',
    reward: 150,
    completed: false,
    link: '', // Add your link here
  },
  {
    id: 9,
    name: 'Invite 10 Friends',
    reward: 500,
    completed: false,
    link: '', // Add your link here
  },
  // Add more tasks as needed...
];

// Game logic for handling task completion and rewards
const completeTask = (taskId) => {
  const task = tasks.find(t => t.id === taskId);
  if (task && !task.completed) {
    task.completed = true;
    // Update player's total coins
    playerCoins += task.reward;
    console.log(`Task completed: ${task.name}, Reward: ${task.reward} coins`);
    // Update the UI or notify player as needed
  } else {
    console.log(`Task not found or already completed.`);
  }
};

// Sample player state
let playerCoins = 0;

// Example usage: Completing a task
completeTask(1); // Completing "Invite Friends"
completeTask(2); // Completing "Subscribe to Pink Channel"

// Log player's coins after completing tasks
console.log(`Total coins: ${playerCoins}`);

// Function to display all tasks (customizable)
const displayTasks = () => {
  tasks.forEach(task => {
    console.log(`${task.name} - Reward: ${task.reward} - Completed: ${task.completed ? 'Yes' : 'No'}`);
  });
};

// Call to display all tasks
displayTasks();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { taskId, telegramId } = req.body;

  if (!taskId || !telegramId) {
    return res.status(400).json({ error: 'Task ID and Telegram ID are required' });
  }

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
    console.error('Error in tasks.js:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
