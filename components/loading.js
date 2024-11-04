import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GameError from './GameError'; // Import the error component

const Loading = () => {
  const [progress, setProgress] = useState(1); // Start at 1%
  const [loadingError, setLoadingError] = useState(false); // Track if there's an error during preloading
  const [isLoadingComplete, setIsLoadingComplete] = useState(false); // Ensure we finish at 100%
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
        setIsLoadingComplete(true); // Mark loading complete when assets are preloaded
      } catch (error) {
        console.error('Error preloading assets:', error);
        setLoadingError(true); // Set error state if there's an issue preloading assets
      }
    };

    const incrementProgress = () => {
      let currentProgress = 1;
      const interval = setInterval(() => {
        // Increase progress until 100% or when assets are preloaded and 100% is reached
        if (currentProgress < 100) {
          setProgress((prev) => Math.min(prev + 1, 100));
          currentProgress += 1;
        }

        // If progress is at 100% and assets are preloaded, finish loading
        if (currentProgress === 100 && isLoadingComplete) {
          clearInterval(interval); // Stop incrementing
          router.push('/home'); // Navigate to home when done
        }
      }, 30); // Smooth progress increment every 30ms
    };

    // Start preloading assets and increment progress in parallel
    preloadAllAssets();
    incrementProgress();

    return () => clearInterval(incrementProgress); // Clean up interval on unmount
  }, [router, isLoadingComplete]);

  // If there's an error in preloading, show the GameError component
  if (loadingError) {
    return <GameError />;
  }

  // Otherwise, show the loading progress
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <p className="text-white mb-4">Loading {progress}%</p>
    </div>
  );
};

export default Loading;
