import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GameError from './GameError'; // Import error component

const Loading = () => {
  const [progress, setProgress] = useState(1); // Start at 1%
  const [loadingError, setLoadingError] = useState(false); // Track if there's an error during preloading
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

    // Preload assets in the background without blocking the progress animation
    const preloadAllAssets = async () => {
      try {
        await Promise.all(assets.map(preloadAsset));
      } catch (error) {
        console.error('Error preloading assets:', error);
        setLoadingError(true); // Set error state if there's an issue preloading
      }
    };

    // Increment progress smoothly from 1% to 100% over 3 seconds
    const incrementProgress = () => {
      let currentProgress = 1;
      const intervalTime = 30; // 30ms per increment
      const totalIncrements = 3000 / intervalTime; // Total increments over 3 seconds

      const interval = setInterval(() => {
        if (currentProgress < 100) {
          setProgress((prev) => Math.min(prev + (100 / totalIncrements), 100)); // Smoothly increment
          currentProgress += 100 / totalIncrements;
        } else {
          clearInterval(interval); // Stop incrementing after reaching 100%
        }
      }, intervalTime);

      setTimeout(() => {
        // After 3 seconds, navigate to home regardless of preloading
        router.push('/home');
      }, 3000);
    };

    // Start preloading in the background and the 3-second animation
    incrementProgress();
    preloadAllAssets(); // Load assets but don't block the animation

  }, [router]);

  // Show error page if preloading fails
  if (loadingError) {
    return <GameError />;
  }

  // Show loading screen with progress
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <p className="text-white mb-4">Loading {progress.toFixed(0)}%</p>
    </div>
  );
};

export default Loading;
