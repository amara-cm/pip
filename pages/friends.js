import { useState } from 'react';

const Friends = () => {
  const [referrals, setReferrals] = useState([]);
  const [newReferralId, setNewReferralId] = useState('');

  const handleInvite = () => {
    // Mock invite logic
    setReferrals([...referrals, newReferralId]);
    setNewReferralId('');
  };

  return (
    <div className="friends-scr">
      <div className="frame">
        <div className="inv-text">Invite Friends</div>
        <div className="frame2">
          <input
            type="text"
            placeholder="Enter referral ID"
            value={newReferralId}
            onChange={(e) => setNewReferralId(e.target.value)}
          />
          <button className="send-btn" onClick={handleInvite}>Send</button>
        </div>
      </div>
      <div className="referrals-list">
        {referrals.map((ref, index) => (
          <div key={index} className="referral">{ref}</div>
        ))}
      </div>
      <div className="tab-bar">
        <button className="tab-btn tab-rewards" onClick={() => window.location.href = '/tasks'}>Rewards</button>
        <button className="tab-btn tab-site" onClick={() => window.location.href = '/home'}>Site</button>
        <button className="tab-btn tab-friends active" onClick={() => window.location.href = '/friends'}>Friends</button>
      </div>
    </div>
  );
};

export default Friends;
