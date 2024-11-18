import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

const Friends = ({ updateCoins, showReward }) => {
  const [telegramUID, setTelegramUID] = useState('');

  useEffect(() => {
    // Fetch the user's Telegram UID from the API
    const fetchTelegramUID = async () => {
      try {
        const userId = 'current_user_id'; // Replace with the actual logic to get the current user's ID
        const response = await fetch(`/api/telegram?id=${userId}`);
        const data = await response.json();
        setTelegramUID(data.userId);
      } catch (error) {
        console.error('Error fetching Telegram UID:', error);
      }
    };

    fetchTelegramUID();
  }, []);

  const handleInvite = async () => {
    const referralLink = `https://t.me/pinxhousebot?start=${telegramUID}`;

    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`, '_blank');

    const response = await fetch('/api/referrals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'current_user_id', // Replace with actual user ID
        referredUserId: telegramUID,
      }),
    });

    if (response.ok) {
      updateCoins(100);
      showReward("+100 coins for successful invite!");
    } else {
      console.error("Error recording referral");
    }
  };

  const handleCopy = () => {
    const referralLink = `https://t.me/pinxhousebot?start=${telegramUID}`;
    navigator.clipboard.writeText(referralLink);
  };

  const handleNewInviteeReward = () => {
    updateCoins(50);
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
    <div className="relative flex flex-col w-screen h-screen bg-black">
      <div className="flex flex-col justify-center items-center w-screen h-[21.77vh] gap-[30px] p-4">
        <div className="w-auto font-outfit font-semibold text-[1rem] leading-none text-center text-white">
          Invite Friends to join and earn rewards together!
        </div>
        <div className="flex flex-row justify-center items-center gap-[5px]">
          <button onClick={handleInvite} className="w-[100px] h-[35px] flex justify-center items-center">
            <img
              src="/icons/sendinv-btn.svg"
              alt="Send Invite"
              style={{ pointerEvents: 'none' }}
            />
          </button>
          <button onClick={handleCopy} className="w-[50px] h-[35px] flex justify-center items-center">
            <img
              src="/icons/copy-btn.svg"
              alt="Copy Referral Link"
              style={{ pointerEvents: 'none' }}
            />
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-start items-start w-screen h-[21.77vh] gap-[30px] p-4">
        <div className="w-[80%] font-semibold text-[1rem] leading-none text-left text-white">
          Friends
        </div>
      </div>
      <Footer currentPage="friends" />
    </div>
  );
};

export default Friends;
