import supabase from '../../lib/supabase'; // Import your Supabase client

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'POST') {
        const { userId, invitedUserId } = req.body;

        // Insert a new referral record
        const { data, error } = await supabase
            .from('referrals')
            .insert([{ user_id: userId, invited_user_id: invitedUserId }]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Reward the user for inviting a friend
        const { error: rewardError } = await supabase
            .from('users')
            .update({ coins: supabase.raw('coins + 100') }) // Reward 100 coins for the inviter
            .eq('id', userId);

        if (rewardError) {
            return res.status(400).json({ error: rewardError.message });
        }

        res.json({ message: 'Referral recorded and coins rewarded' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
