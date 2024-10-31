import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

const Friends = ({ updateCoins, showReward }) => {
  const [referrals, setReferrals] = useState([]);
  const [telegramUID, setTelegramUID] = useState('');

  useEffect(() => {
    // Simulate fetching user's Telegram UID
    const fetchTelegramUID = () => {
      // Replace this with actual fetching logic from Telegram API
      const uid = '123456789'; // Example UID, replace with actual UID
      setTelegramUID(uid);
    };

    fetchTelegramUID();
  }, []);

  const handleInvite = () => {
    const referralLink = `https://t.me/yourbotname?start=${telegramUID}`;
    setReferrals([...referrals, referralLink]);

    // Simulate sending the referral link within Telegram
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`, '_blank');

    // Reward inviter with 100 coins
    updateCoins(100);
    showReward("+100 coins for successful invite!");
  };

  const handleCopy = (referralLink) => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  const handleNewInviteeReward = () => {
    // Simulate rewarding the new invitee (you can replace this with actual logic)
    updateCoins(50); // Reward 50 coins to the new invitee
    showReward("+50 coins for joining through a referral!");
  };

  useEffect(() => {
    // Logic to check if the current user is an invitee (when they use a referral link)
    // For example, if you check URL parameters for ?start=inviterUID
    const urlParams = new URLSearchParams(window.location.search);
    const inviterUID = urlParams.get('start');

    if (inviterUID) {
      // If the invitee joins through a referral link, reward them
      handleNewInviteeReward();
    }
  }, []);

  return (
    <div className="friends-scr">
      <div className="frame">
        <div className="inv-text">Invite Friends</div>
        <div className="frame2">
          <button onClick={handleInvite} className="send-btn w-[64px] h-[64px]"></button>
          <button onClick={() => handleCopy(`https://t.me/yourbotname?start=${telegramUID}`)} className="copy-btn w-[64px] h-[64px]"></button>
        </div>
      </div>

      <div className="frame">
        <div className="inv-text">Referrals</div>
        <div className="flex flex-col gap-2">
          {referrals.map((ref, index) => (
            <div key={index} className="text-xl">{ref}</div>
          ))}
        </div>
      </div>

      <Footer currentPage="friends" />
    </div>
  );
};

export default Friends;
