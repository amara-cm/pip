import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

const Friends = ({ updateCoins, showReward }) => {
  const [referrals, setReferrals] = useState([]); // Keeping this for future use if needed
  const [telegramUID, setTelegramUID] = useState('');

  useEffect(() => {
    // Simulate fetching user's Telegram UID
    const fetchTelegramUID = () => {
      const uid = '123456789'; // Example UID, replace with actual UID
      setTelegramUID(uid);
    };

    fetchTelegramUID();
  }, []);

  const handleInvite = async () => {
    const referralLink = `https://t.me/pinxhousebot?start=${telegramUID}`;

    // Open Telegram share link without showing the referral in state
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`, '_blank');

    // Send referral to the server
    const response = await fetch('/api/friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'YOUR_USER_ID', // Replace with actual user ID
        invitedUserId: telegramUID, // This could be the new user's ID if available
      }),
    });

    if (response.ok) {
      updateCoins(100); // Update coins locally
      showReward("+100 coins for successful invite!");
    } else {
      console.error("Error recording referral");
    }
  };

  const handleCopy = (referralLink) => {
    navigator.clipboard.writeText(referralLink);
    // No need for alert or displaying the referral link
  };

  const handleNewInviteeReward = () => {
    updateCoins(50); // Reward 50 coins to the new invitee
    showReward("+50 coins for joining through a referral!");
  };

    // Adding a referral
  const addReferral = async (referredUserId) => {
    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, referredUserId }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result.message); // Update referral count in UI
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Failed to add referral:', error);
    }
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
              style={{ pointerEvents: 'none' }} // Disable pointer events for the image
            />
          </button>
          <button onClick={() => handleCopy(`https://t.me/pinxhousebot?start=${telegramUID}`)} className="w-[50px] h-[35px] flex justify-center items-center">
            <img
              src="/icons/copy-btn.svg"
              alt="Copy Referral Link"
              style={{ pointerEvents: 'none' }} // Disable pointer events for the image
            />
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-start items-start w-screen h-[21.77vh] gap-[30px] p-4">
        <div className="w-[80%] font-semibold text-[1rem] leading-none text-left text-white">
          Friends
        </div>
        {/* No need to display the referral links anymore */}
      </div>

      <Footer currentPage="friends" />
    </div>
  );
};

export default Friends;
