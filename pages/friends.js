import { useState } from 'react';

const Friends = () => {
  const [referrals, setReferrals] = useState([]);
  const [newReferralId, setNewReferralId] = useState('');

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
      <footer className="flex justify-around p-4 bg-gray-800 fixed bottom-0 w-full max-w-[30rem]">
        <button onClick={() => window.location.href = '/tasks'} className="text-white">Rewards</button>
        <button onClick={() => window.location.href = '/'} className="text-white">Home</button>
        <button onClick={() => window.location.href = '/friends'} className="text-white">Friends</button>
      </footer>
    </div>
  );
};

export default Friends;
