import supabase from '../../lib/db';

// Helper function to calculate daily streak reward
const calculateDailyReward = (streak) => {
  const rewards = [10, 20, 30, 40, 50, 60, 100]; // Rewards for days 1-7
  return rewards[Math.min(streak, 6)];
};

export default async function handler(req, res) {
  const { userId, action } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (action === 'claim') {
      // Daily login claim logic
      const now = new Date();
      const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const { data: userLogin, error: userLoginError } = await supabase
        .from('DailyLogin')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (userLoginError) throw userLoginError;

      // If no record or missed login day, reset streak
      let streak = 0;
      if (userLogin) {
        const lastClaim = userLogin.lastClaim.toISOString().slice(0, 10);
        const daysPassed = (new Date(today) - new Date(lastClaim)) / (1000 * 60 * 60 * 24);

        if (daysPassed === 1) {
          streak = userLogin.currentStreak + 1;  // Continue streak
        } else if (daysPassed > 1) {
          streak = 1;  // Reset streak
        }
      } else {
        streak = 1;  // First-time claim
      }

      const reward = calculateDailyReward(streak);

      const { error: transactionError } = await supabase.rpc('claim_daily_reward', { user_id: userId, streak, reward });

      if (transactionError) throw transactionError;

      res.status(200).json({ message: `Claimed ${reward} coins for day ${streak}` });
    } else if (action === 'completeTask') {
      const { taskId } = req.body;

      const { data: task, error: taskError } = await supabase
        .from('Task')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError) throw taskError;

      if (!task || task.isComplete) {
        return res.status(400).json({ message: 'Task already completed or not found.' });
      }

      const { error: transactionError } = await supabase.rpc('complete_task', { task_id: taskId, user_id: userId, reward: task.rewardCoins });

      if (transactionError) throw transactionError;

      res.status(200).json({ message: `Task completed, ${task.rewardCoins} coins added.` });
    } else if (action === 'createTask') {
      // Create a new task
      const { description, rewardCoins } = req.body;

      const { data: newTask, error: newTaskError } = await supabase
        .from('Task')
        .insert({ user_id: userId, description, rewardCoins })
        .single();

      if (newTaskError) throw newTaskError;

      res.status(201).json(newTask);
    } else if (action === 'fetchTasks') {
      // Fetch all tasks for the user
      const { data: tasks, error: tasksError } = await supabase
        .from('Task')
        .select('*')
        .eq('user_id', userId)
        .order('createdAt', { ascending: false });

      if (tasksError) throw tasksError;

      res.status(200).json(tasks);
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Tasks API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
