import supabase from '../../lib/db';
import { generateToken } from '../../lib/paseto';

const checkMiningCompletion = (countdownEnd) => {
  return new Date() >= new Date(countdownEnd);
};

export default async function handler(req, res) {
  const { userId, action } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (action === 'start') {
      const now = new Date();
      const countdownEnd = new Date(now.getTime() + 8 * 60 * 60 * 1000);

      const { error } = await supabase
        .from('MiningSession')
        .upsert({ user_id: userId, countdownEnd, stonesMined: 0, canSell: false });

      if (error) throw error;

      const token = await generateToken(userId, '30m');
      res.status(200).json({ message: 'Mining started', countdownEnd, token });
    } else if (action === 'sell') {
      const { data: miningSession, error: miningError } = await supabase
        .from('MiningSession')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (miningError) throw miningError;

      if (!miningSession) {
        return res.status(400).json({ message: 'No mining session found.' });
      }

      if (!checkMiningCompletion(miningSession.countdownEnd)) {
        return res.status(400).json({ message: 'Mining is not complete yet.' });
      }

      const { error: transactionError } = await supabase.rpc('sell_mined_stones', { user_id: userId });

      if (transactionError) throw transactionError;

      const token = await generateToken(userId, '30m');
      res.status(200).json({ message: '500 coins added, mining session reset', token });
    } else if (action === 'status') {
      const { data: miningSession, error } = await supabase
        .from('MiningSession')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (!miningSession) {
        return res.status(404).json({ message: 'No mining session found.' });
      }

      const token = await generateToken(userId, '30m');
      res.status(200).json({ ...miningSession, token });
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Mining API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
