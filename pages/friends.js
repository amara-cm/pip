import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

const Friends = () => {
  const [referrals, setReferrals] = useState([]);
  const [newReferralId, setNewReferralId] = useState('');

  // Preload footer icons to ensure they're ready immediately
  useEffect(() => {
    const preloadImages = ['/icons/brewards.svg', '/icons/bsite.svg', '/icons/afriends.svg'];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleInvite = () => {
    setReferrals([...referrals, newReferralId]);
    setNewReferralId('');
  };

  return (
    <div className="flex flex-col items-center w-full h-screen bg-black text-white font-outfit font-semibold">
      <div className="w-full max-w-[30rem]">
        <div className="text-2xl mb-4">Invite Friends</div>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Enter referral ID"
            value={newReferralId}
            onChange={(e) => setNewReferralId(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-500 rounded-l"
          />
          <button onClick={handleInvite} className="px-4 py-2 bg-blue-500 rounded-r">
            Send
          </button>
        </div>
        <div className="text-2xl mb-4">Referrals</div>
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
