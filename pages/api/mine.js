import supabase from '../../lib/supabase'; // Adjust the path as necessary

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        const { userId } = req.query;

        // Fetch saved mining state for the user
        const { data, error } = await supabase
            .from('rewards_log')
            .select('claimed_at, user_id, day')
            .eq('user_id', userId)
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Calculate remaining time and coins
        const currentTime = new Date();
        const duration = 28800; // 8 hours in seconds
        const startTime = new Date(data.claimed_at);
        const elapsedTime = Math.floor((currentTime - startTime) / 1000); // in seconds
        const remainingTime = Math.max(0, duration - elapsedTime); // calculate remaining time

        // Fetch user's coins
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('coins')
            .eq('id', userId)
            .single();

        if (userError) {
            return res.status(400).json({ error: userError.message });
        }

        res.json({
            startTime: data.claimed_at,
            duration,
            coins: userData.coins,
            stone: elapsedTime < duration ? (elapsedTime / duration) * 1 : 0, // Calculate stone based on elapsed time
        });
    }

    if (method === 'PUT') {
        const { userId, coins, stone, startTime, duration } = req.body;

        // Update user's mining state
        const { error } = await supabase
            .from('rewards_log')
            .upsert([{ user_id: userId, claimed_at: new Date(startTime), day: 1 }]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Update user's coins
        await supabase
            .from('users')
            .update({ coins: coins + 500 }) // Add 500 coins after selling
            .eq('id', userId);

        res.json({ message: 'Game state updated successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
