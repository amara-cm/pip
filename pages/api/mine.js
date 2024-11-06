// /pages/api/mine.js
import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../lib/supabase';  // Adjust import path if necessary

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { userId } = req.query;

    const { data, error } = await supabase
      .from('game_state')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return res.status(500).json({ message: 'Error fetching game state' });
    
    return res.status(200).json(data);
  }

  if (method === 'PUT') {
    const { userId, coins, stone, startTime, duration } = req.body;

    const { data, error } = await supabase
      .from('game_state')
      .upsert({
        user_id: userId,
        coins,
        stone,
        start_time: startTime,
        duration,
      }, { onConflict: ['user_id'] });

    if (error) return res.status(500).json({ message: 'Error updating game state' });

    return res.status(200).json(data);
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
