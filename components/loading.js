import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GameError from './GameError'; // Import the error component

const Loading = () => {
  const [progress, setProgress] = useState(1); // Start at 1%
  const [loadingError, setLoadingError] = useState(false); // Track if there's an error during preloading
  const [isPreloadingComplete, setIsPreloadingComplete] = useState(false); // Ensure we finish preloading
  const router = useRouter();

  useEffect(() => {
    const assets = [
      '/icons/arewards.svg',
      '/icons/asite.svg',
      '/icons/afriends.svg',
      '/icons/brewards.svg',
      '/icons/bsite.svg',
      '/icons/bfriends.svg',
      '/icons/completed.svg',
      '/icons/copy-btn.svg',
      '/icons/gamecoin.svg',
      '/icons/mine-btn.svg',
      '/icons/refresh.svg',
      '/icons/sell-btn.svg',
      '/icons/sendinv-btn.svg',
      '/mainicon.gif',
      '/icons/d1.svg',
      '/icons/d2.svg',
      '/icons/d3.svg',
      '/icons/d4.svg',
      '/icons/d5.svg',
      '/icons/d6.svg',
      '/icons/d7.svg',
    ];

    const preloadAsset = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    };

    const preloadAllAssets = async () => {
      try {
        await Promise.all(assets.map(preloadAsset));
        setIsPreloadingComplete(true); // Mark preloading complete
      } catch (error) {
        console.error('Error preloading assets:', error);
        setLoadingError(true); // Set error state if there's an issue preloading assets
      }
    };

    const incrementProgress = () => {
      let currentProgress = 1;
      const totalDuration = 3000; // 3 seconds
      const intervalTime = 30; // 30ms per increment
      const totalIncrements = totalDuration / intervalTime; // How many increments to 100%

      const interval = setInterval(() => {
        if (currentProgress < 100) {
          setProgress((prev) => Math.min(prev + (100 / totalIncrements), 100)); // Smoothly increment
          currentProgress += 100 / totalIncrements;
        } else {
          clearInterval(interval);
          if (isPreloadingComplete) {
            router.push('/home'); // Only route to home if preloading is also done
          }
        }
      }, intervalTime);
    };

    // Wait for both preloading and the 3 seconds to complete
    const startLoading = async () => {
      await preloadAllAssets(); // Start preloading
      setTimeout(() => {
        if (isPreloadingComplete) {
          router.push('/home'); // Ensure we only route to home after both preloading and timing are done
        }
      }, 3000); // Force a minimum of 3 seconds wait
    };

    startLoading(); // Start the loading process
    incrementProgress(); // Increment progress over 3 seconds

    return () => clearInterval(incrementProgress); // Clean up interval on unmount
  }, [router, isPreloadingComplete]);

  // If there's an error in preloading, show the GameError component
  if (loadingError) {
    return <GameError />;
  }

  // Otherwise, show the loading progress
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <p className="text-white mb-4">Loading {progress.toFixed(0)}%</p>
    </div>
  );
};

export default Loading;
