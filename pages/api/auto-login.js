import supabase from '../../lib/db';
import { validateToken } from '../../lib/paseto';

export default async function handler(req, res) {
  const { token } = req.query;

  try {
    const userId = await validateToken(token);
    const { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // User does not exist, create one
      const { error: createUserError } = await supabase
        .from('User')
        .insert({ user_id: userId });

      if (createUserError) throw createUserError;
    }

    // Set session or PASETO for the user
    res.status(200).json({ message: 'User authenticated', userId });
  } catch (error) {
    console.error('Error during auto-login:', error);
    res.status(400).json({ message: 'Invalid token' });
  }
}