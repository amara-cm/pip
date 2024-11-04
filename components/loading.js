import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GameError from './GameError'; // Import the error page

const Loading = () => {
  const [progress, setProgress] = useState(1); // Start at 1%
  const [loadingError, setLoadingError] = useState(false); // Error state
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
      } catch (error) {
        console.error('Error preloading assets:', error);
        setLoadingError(true); // Set error state if there's an issue preloading assets
      }
    };

    const incrementProgress = () => {
      let currentProgress = 1;
      const interval = setInterval(() => {
        if (currentProgress < 100) {
          setProgress((prev) => Math.min(prev + 1, 100)); // Increment by 1%
          currentProgress += 1;
        } else {
          clearInterval(interval);
          router.push('/home'); // Redirect after reaching 100%
        }
      }, 30); // 30ms interval to make total 3 seconds
    };

    // Preload assets, then start incrementing progress
    preloadAllAssets().then(() => {
      incrementProgress(); // Start the progress increment once assets are loaded
    });

    return () => clearInterval(incrementProgress); // Clean up
  }, [router]);

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
