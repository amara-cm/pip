import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Loading = () => {
  const [progress, setProgress] = useState(1); // Start at 1%
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
    const preloadAndUpdateProgress = async () => {
      try {
        await preloadAllAssets(); // Preload assets

        // Total duration for the loading screen
        const totalDuration = 2000; // 2 seconds
        const intervalDuration = 20; // 20ms interval
        const totalSteps = totalDuration / intervalDuration; // Number of steps to reach 100%
        
        const increment = 100 / totalSteps; // Increment value for each step
        let currentProgress = 1; // Initialize current progress

        const interval = setInterval(() => {
          if (currentProgress < 100) {
            currentProgress += increment; // Increment progress
            setProgress(Math.min(Math.floor(currentProgress), 100)); // Set progress, ensuring it doesn't exceed 100
          } else {
            clearInterval(interval); // Clear the interval when we reach 100%
          }
        }, intervalDuration); // Increment every 20ms

        // Redirect after total duration
        const redirectTimeout = setTimeout(() => {
          clearInterval(interval); // Cleanup interval
          router.push('/home'); // Redirect to Home page
        }, totalDuration);

        return () => {
          clearInterval(interval); // Cleanup on unmount
          clearTimeout(redirectTimeout); // Cleanup timeout on unmount
        };
      } catch (error) {
        console.error('Error preloading assets:', error);
        router.push('/home'); // Fallback: Redirect even if there's a preload error
      }
    };

    preloadAndUpdateProgress(); // Start the preloading and progress update
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <p className="text-white mb-4">Loading {progress}%</p>
    </div>
  );
};

export default Loading;
