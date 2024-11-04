import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GameError from './GameError'; // Import the error component

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

    const preloadAllAssets = async () => {
      try {
        await Promise.all(assets.map(preloadAsset)); // Preload all assets
      } catch (error) {
        console.error('Error preloading assets:', error);
        setLoadingError(true); // Set error state if there's an issue preloading assets
      }
    };

    const incrementProgress = () => {
      return new Promise((resolve) => {
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
            resolve(); // Resolve the promise after reaching 100%
          }
        }, intervalTime);
      });
    };

    const startLoading = async () => {
      const preloadPromise = preloadAllAssets(); // Start preloading assets
      const progressPromise = incrementProgress(); // Start progress bar

      // Wait for both promises to complete (3 seconds + preloading)
      await Promise.all([preloadPromise, progressPromise]);

      // After both are done, navigate to home
      router.push('/home');
    };

    startLoading(); // Start the loading process

  }, [router]);

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
