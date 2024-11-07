import supabase from '../../lib/supabase';

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'POST') {
        const { userId, action, taskId } = req.body;

        // Handle "complete-task" action (for tasks that have a "Go" button)
        if (action === 'complete-task') {
            const tasksList = [
                { id: 1, name: 'Subscribe to Pinx channel', reward: 200, link: 'https://t.me/pinxann' },
                { id: 2, name: 'Boost Pinx channel', reward: 300, link: 'https://t.me/boost/pinxann' },
                { id: 3, name: 'Follow us on X', reward: 200, link: 'https://x.com/thepinxhouse' },
                { id: 4, name: 'Follow us on Instagram', reward: 200, link: 'https://www.instagram.com/realpinxhouse' },
                { id: 5, name: 'Subscribe to our YouTube channel', reward: 500, link: 'https://youtube.com/pink' }
            ];

            const task = tasksList.find(t => t.id === taskId);
            if (!task) {
                return res.status(400).json({ error: 'Task not found' });
            }

            // Reward user for completing the task
            const { error: coinsError } = await supabase
                .from('users')
                .update({ coins: supabase.raw(`coins + ${task.reward}`) })
                .eq('id', userId);

            if (coinsError) {
                return res.status(400).json({ error: coinsError.message });
            }

            return res.json({ message: 'Task completed and coins rewarded' });
        }

        // Handle "check-referrals" action (auto-tracking for invite tasks)
        if (action === 'check-referrals') {
            const { data: referralsData, error: referralsError } = await supabase
                .from('referrals')
                .select('invited_user_id')
                .eq('user_id', userId);

            if (referralsError) {
                return res.status(400).json({ error: referralsError.message });
            }

            const referralCount = referralsData.length;

            // Referral task progress
            const referralTasks = [
                { id: 6, name: 'Invite a friend', required: 1, reward: 50 },   // Invite 1 friend
                { id: 7, name: 'Invite 3 friends', required: 3, reward: 150 },  // Invite 3 friends
                { id: 8, name: 'Invite 10 friends', required: 10, reward: 500 } // Invite 10 friends
            ];

            let progress = {
                inviteOne: `${referralCount}/1`,
                inviteThree: `${referralCount}/3`,
                inviteTen: `${referralCount}/10`,
            };

            // Automatically show claim button when tasks are completed
            const completedTasks = referralTasks.filter(task => referralCount >= task.required);
            for (const task of completedTasks) {
                const { error: rewardError } = await supabase
                    .from('users')
                    .update({ coins: supabase.raw(`coins + ${task.reward}`) })
                    .eq('id', userId);

                if (rewardError) {
                    return res.status(400).json({ error: rewardError.message });
                }

                // Update progress to "Claim" when task is done
                if (task.required === 1) progress.inviteOne = 'Claim';
                if (task.required === 3) progress.inviteThree = 'Claim';
                if (task.required === 10) progress.inviteTen = 'Claim';
            }

            return res.json({ message: 'Referral progress checked', progress });
        }

        return res.status(400).json({ error: 'Invalid action' });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
