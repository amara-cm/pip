import supabase from '../../lib/db';

export default async function handler(req, res) {
  const { id, username, first_name, action, earnedCoins, mineCountdown, dailyClaimTimer, gameInteractions, completedTasks, coins } = req.body;

  if (req.method === 'POST') {
    if (action === 'save' || action === 'retrieve') {
      try {
        if (action === 'save') {
          const { error: userDataError } = await supabase
            .from('UserData')
            .upsert({ user_id: id, earnedCoins, mineCountdown, dailyClaimTimer, gameInteractions, completedTasks });

          if (userDataError) throw userDataError;

          if (coins !== undefined) {
            const { error: userError } = await supabase
              .from('User')
              .update({ coins })
              .eq('user_id', id);

            if (userError) throw userError;
          }

          return res.status(200).json({ message: 'User data saved successfully' });
        } else if (action === 'retrieve') {
          const { data: userData, error: userDataError } = await supabase
            .from('UserData')
            .select('*')
            .eq('user_id', id)
            .single();

          if (userDataError) throw userDataError;

          if (userData) {
            const { data: user, error: userError } = await supabase
              .from('User')
              .select('*')
              .eq('user_id', id)
              .single();

            if (userError) throw userError;

            return res.status(200).json({ ...userData, coins: user ? user.coins : 0 });
          } else {
            return res.status(404).json({ message: 'No user data found.' });
          }
        }
      } catch (error) {
        console.error('User data API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      try {
        const { error: userError } = await supabase
          .from('User')
          .upsert({ user_id: id, username, first_name });

        if (userError) throw userError;

        return res.status(201).json({ message: 'User created/updated', userId: id });
      } catch (error) {
        console.error('Error upserting user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } else if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const { data: user, error: userError } = await supabase
        .from('User')
        .select('*')
        .eq('user_id', id)
        .single();

      if (userError) throw userError;

      if (user) {
        return res.status(200).json({ userId: user.user_id, username: user.username, firstName: user.first_name });
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error finding user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
