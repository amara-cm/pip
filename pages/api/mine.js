import { supabase } from '../../lib/db'; // Import Supabase client

export async function handler(req, res) {
  const { method } = req;
  const { userId, startTime, stone, coins } = req.body || {}; // Get values from request body

  if (method === 'GET') {
    // Fetch saved game state for a user
    const { data, error } = await supabase
      .from('game_state')
      .select('start_time, duration, stone, coins')
      .eq('user_id', userId)
      .single(); // Expecting only one record for the user

    if (error) {
      return res.status(500).json({ message: 'Error fetching game state' });
    }

    return res.status(200).json(data);
  }

  if (method === 'PUT') {
    // Save or update game state for the user
    const { data, error } = await supabase
      .from('game_state')
      .upsert(
        {
          user_id: userId,
          start_time: startTime,
          duration: 28800, // 8 hours in seconds (for your mining duration)
          stone: stone,
          coins: coins,
        },
        { onConflict: ['user_id'] } // Ensures the record is updated if user_id exists
      );

    if (error) {
      return res.status(500).json({ message: 'Error saving game state' });
    }

    return res.status(200).json({ message: 'Game state saved successfully' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' }); // If an unsupported method is used
}

export default handler;
