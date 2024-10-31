import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

const Friends = ({ updateCoins, showReward }) => {
  const [referrals, setReferrals] = useState([]);
  const [telegramUID, setTelegramUID] = useState('');

  useEffect(() => {
    // Simulate fetching user's Telegram UID
    const fetchTelegramUID = () => {
      const uid = '123456789'; // Example UID, replace with actual UID
      setTelegramUID(uid);
    };

    fetchTelegramUID();
  }, []);

  const handleInvite = () => {
    const referralLink = `https://t.me/yourbotname?start=${telegramUID}`;
    setReferrals([...referrals, referralLink]);

    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`, '_blank');

    updateCoins(100);
    showReward("+100 coins for successful invite!");
  };

  const handleCopy = (referralLink) => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  const handleNewInviteeReward = () => {
    updateCoins(50); // Reward 50 coins to the new invitee
    showReward("+50 coins for joining through a referral!");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviterUID = urlParams.get('start');

    if (inviterUID) {
      handleNewInviteeReward();
    }
  }, []);

  return (
    <div className="flex justify-center items-start flex-col w-screen h-screen bg-black">
      <div className="flex flex-col justify-center items-center w-screen h-[21.77vh] gap-[30px]">
        <div className="w-[64.55%] font-outfit font-semibold text-[1.5rem] leading-none text-center text-white">Invite Friends to join and earn rewards together!</div>
        <div className="flex flex-row justify-center items-center gap-[5px]">
          <button onClick={handleInvite} className="w-[100px] h-[35px] flex justify-center items-center">
            <img
              src="/icons/sendinv-btn.svg"
              alt="Send Invite"
              style={{ pointerEvents: 'none' }} // Disable pointer events for the image
            />
          </button>
          <button onClick={() => handleCopy(`https://t.me/yourbotname?start=${telegramUID}`)} className="w-[50px] h-[35px] flex justify-center items-center">
            <img
              src="/icons/copy-btn.svg"
              alt="Copy Referral Link"
              style={{ pointerEvents: 'none' }} // Disable pointer events for the image
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-center items-start w-screen h-[21.77vh] gap-[30px]">
        <div className="w-[64.55%] font-semibold text-[1.5rem] leading-none text-center text-white">Referrals</div>
        <div className="flex flex-col gap-2">
          {referrals.map((ref, index) => (
            <div key={index} className="text-xl text-white">{ref}</div>
          ))}
        </div>
      </div>

      <Footer currentPage="friends" />
    </div>
  );
};

export default Friends;
