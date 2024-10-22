import { useState } from 'react';
import styles from '../styles/Friends.module.css';

const Friends = () => {
  const [referrals, setReferrals] = useState([]);
  const [newReferralId, setNewReferralId] = useState('');

  const handleInvite = () => {
    setReferrals([...referrals, newReferralId]);
    setNewReferralId('');
  };

  return (
    <div className={styles['friends-scr']}>
      <div className={styles.frame}>
        <div className={styles['inv-text']}>Invite Friends</div>
        <div className={styles.frame2}>
          <input
            type="text"
            placeholder="Enter referral ID"
            value={newReferralId}
            onChange={(e) => setNewReferralId(e.target.value)}
          />
          <button className={styles['send-btn']} onClick={handleInvite}>Send</button>
        </div>
      </div>
      <div className={styles['referrals-list']}>
        {referrals.map((ref, index) => (
          <div key={index} className={styles.referral}>{ref}</div>
        ))}
      </div>
      <div className={styles['tab-bar']}>
        <button className={styles['tab-btn']} onClick={() => window.location.href = '/tasks'}>Rewards</button>
        <button className={styles['tab-btn']} onClick={() => window.location.href = '/home'}>Site</button>
        <button className={`${styles['tab-btn']} active`} onClick={() => window.location.href = '/friends'}>Friends</button>
      </div>
    </div>
  );
};

export default Friends;
