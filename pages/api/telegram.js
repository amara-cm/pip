import supabase from '../../lib/db';

export default async function handler(req, res) {
  const { id, action } = req.body;

  if (req.method === 'POST') {
    if (action === 'menu_tap') {
      try {
        // Update lastActive field
        const { error: userError } = await supabase
          .from('User')
          .update({ lastActive: new Date() })
          .eq('user_id', id);

        if (userError) throw userError;

        // Notify web app about the user activity
        res.status(200).json({ message: 'User interaction recorded and lastActive updated' });
      } catch (error) {
        console.error('Error updating lastActive:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
    // Existing logic for other actions
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
