import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const GameError = () => {
  const router = useRouter();
  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);

  // Use effect to set the error once
  useEffect(() => {
    if (!hasErrorOccurred) {
      setHasErrorOccurred(true);
    }
  }, [hasErrorOccurred]);

  const handleRefresh = () => {
    // Reload the current page and reset the error state
    router.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-black text-white font-outfit font-semibold">
      <div className="text-20 mb-4">Oops! Something went wrong.</div>
      <div className="mb-2">
        Try Again
      </div>
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
      <div className="mt-4 text-red-500">
        If the issue persists, please check back later or contact support.
      </div>
    </div>
  );
};

export default GameError;
