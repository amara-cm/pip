import { useState } from 'react';

const Friends = () => {
    const [referrals, setReferrals] = useState([]);
    const [userId, setUserId] = useState('lons'); // Replace with actual Telegram ID
    const [newReferralId, setNewReferralId] = useState('');

    const handleInvite = async () => {
        try {
            const response = await fetch('/api/referrals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inviterId: userId, inviteeId: newReferralId }),
            });

            if (!response.ok) {
                throw new Error('Failed to invite friend');
            }

            const { success, referralId } = await response.json();
            if (success) {
                setReferrals([...referrals, referralId]);
            }
        } catch (error) {
            console.error('Error inviting friend:', error);
        }
    };

    return (
        <div className="friends-scr">
            <div className="invite-section">
                <button className="invite-btn" onClick={handleInvite}>Invite</button>
                <input
                    type="text"
                    value={newReferralId}
                    onChange={(e) => setNewReferralId(e.target.value)}
                    placeholder="Enter referral ID"
                />
            </div>
            <div className="referrals-list">
                {referrals.map(ref => (
                    <div key={ref} className="referral">
                        <span>{ref}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Friends;
