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

    const preloadAllAssets = async () => {
      try {
        await Promise.all(assets.map(preloadAsset));
        // Start progress increment after assets are preloaded
        incrementProgress();
      } catch (error) {
        console.error('Error preloading assets:', error);
        router.push('/home'); // Fallback to home on error
      }
    };

    const incrementProgress = () => {
      let currentProgress = 1;
      const interval = setInterval(() => {
        if (currentProgress < 100) {
          setProgress((prev) => Math.min(prev + 1, 100));
          currentProgress += 1;
        } else {
          clearInterval(interval);
          router.push('/home'); // Redirect after reaching 100%
        }
      }, 20); // Smooth progress increment every 20ms
    };

    preloadAllAssets(); // Start preloading assets
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <p className="text-white mb-4">Loading {progress}%</p>
    </div>
  );
};

export default Loading;
