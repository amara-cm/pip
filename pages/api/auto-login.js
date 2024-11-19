import supabase from '../../lib/db';
import { validateToken, generateToken } from '../../lib/paseto';

export default async function handler(req, res) {
  const { token } = req.query;

  try {
    const userId = await validateToken(token);
    const { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('telegramId', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // User does not exist, create one
      const { error: createUserError } = await supabase
        .from('User')
        .insert({ telegramId: userId });

      if (createUserError) throw createUserError;
    }

    // Set session or PASETO for the user
    const newToken = await generateToken(userId, '30m');
    res.status(200).json({ message: 'User authenticated', userId, token: newToken });
  } catch (error) {
    console.error('Error during auto-login:', error);
    res.status(400).json({ message: 'Invalid token' });
  }
}
