import supabase from '../../lib/db';

export default async function handler(req, res) {
  const { userId, referredUserId } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Add referral logic
    const { error: referralError } = await supabase
      .from('Referral')
      .upsert({ user_id: userId, referralCount: supabase.rpc('increment', { field: 'referralCount' }) });

    if (referralError) throw referralError;

    // Add referred user logic
    const { error: userError } = await supabase
      .from('User')
      .insert({ user_id: referredUserId, referredById: userId });

    if (userError) throw userError;

    // Generate referral link with the user's Telegram ID
    const referralLink = `https://your_actual_domain.com/referral?userId=${userId}`;

    res.status(200).json({ message: 'Referral added successfully', referralLink });
  } catch (error) {
    console.error('Referral API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
