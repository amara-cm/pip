import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Loading = () => {
  const [progress, setProgress] = useState(1); // Start at 1%
  const [isLoading, setIsLoading] = useState(true); // Track loading state
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
    ];

    const preloadAsset = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    };

    const preloadAllAssets = () => {
      return Promise.all(assets.map(preloadAsset));
    };

    // Start preloading assets
    preloadAllAssets()
      .then(() => {
        // After all assets are preloaded, start incrementing progress
        let currentProgress = 1; // Start at 1%
        const interval = setInterval(() => {
          if (currentProgress < 100) {
            setProgress((prev) => prev + 1); // Increment progress by 1%
            currentProgress += 1; // Move to the next progress point
          } else {
            clearInterval(interval); // Clear the interval once we reach 100%
            setIsLoading(false); // Set loading to false to trigger redirect
          }
        }, 20); // Smooth progress increment every 20ms

        // This timeout ensures we don't redirect too soon
        setTimeout(() => {
          if (currentProgress >= 100) {
            clearInterval(interval); // Ensure to clear the interval
            setIsLoading(false); // Mark loading as complete
          }
        }, 2000); // Total time to keep loading screen open
      })
      .catch((error) => {
        console.error('Error preloading assets:', error);
        // Fallback: Redirect even if there's a preload error
        router.push('/home'); 
      });
  }, [router]);

  useEffect(() => {
    // Redirect to Home page when loading is complete
    if (!isLoading) {
      router.push('/home');
    }
  }, [isLoading, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <p className="text-white mb-4">Loading {progress}%</p>
    </div>
  );
};

export default Loading;
