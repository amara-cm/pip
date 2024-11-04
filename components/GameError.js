import { useRouter } from 'next/router';
import { useState } from 'react';

const GameError = () => {
  const router = useRouter();
  const [reloadCount, setReloadCount] = useState(0);
  const maxReloadAttempts = 2; // Set a limit for reload attempts

  const handleRefresh = () => {
    // Prevent infinite reload loop by limiting the number of reload attempts
    if (reloadCount < maxReloadAttempts) {
      setReloadCount(reloadCount + 1);
      router.reload(); // Reload the current page
    } else {
      console.error('Error persists after multiple reload attempts.'); // Log an error message
      alert('The issue persists. Please try again later or contact support.'); // Inform the user
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-black text-white font-outfit font-semibold">
      <div className="text-20 mb-4">Try Again</div>
      <button 
        onClick={handleRefresh} 
        className="flex justify-center items-center"
      >
        <img 
          src="/icons/refresh.svg" 
          alt="Refresh" 
          style={{ pointerEvents: 'none' }} // Disable pointer events for the icon
        />
      </button>
      {reloadCount >= maxReloadAttempts && (
        <div className="mt-4 text-red-500">
          We've tried reloading multiple times. If the issue persists, please check back later or contact support.
        </div>
      )}
    </div>
  );
};

export default GameError;
