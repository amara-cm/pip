import supabase from '../../lib/supabase'; // Import Supabase client

export async function handler(req, res) {
  const { method } = req;
  const { userId, startTime, stone, coins } = req.body || {}; // Get values from request body

  if (method === 'GET') {
    await supabase
      .from('game_state')
      .select('start_time, duration, stone, coins')
      .eq('user_id', userId)
      .single(); // Fetch game state
    return; // Do nothing further
  }

  if (method === 'PUT') {
    await supabase
      .from('game_state')
      .upsert(
        {
          user_id: userId,
          start_time: startTime,
          duration: 28800, // 8 hours in seconds
          stone: stone,
          coins: coins,
        },
        { onConflict: ['user_id'] }
      );
    return; // Do nothing further
  }

  return; // Do nothing further for unsupported methods
}

export default handler;
