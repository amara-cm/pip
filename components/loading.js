import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Loading = () => {
  const [progress, setProgress] = useState(1); // Start at 1%
  const router = useRouter();

  useEffect(() => {
    // Assets to preload (SVGs, images, gifs, etc.)
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

    // Preloading function for SVGs, images, gifs
    const preloadAsset = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    };

    // Preload all assets (SVGs, images, gifs)
    const preloadAllAssets = () => {
      return Promise.all(assets.map(preloadAsset));
    };

    // Start preloading assets
    preloadAllAssets()
      .then(() => {
        // After all assets are preloaded, increment progress bar
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              router.push('/home'); // Redirect to Home page when loading completes
              return 100; // Ensure it stays at 100%
            }
            return prev + 1; // Increment progress by 1%
          });
        }, 20); // Smooth progress increment
      })
      .catch((error) => {
        console.error('Error preloading assets:', error);
        // Fallback: Redirect even if there's a preload error
        router.push('/home'); 
      });
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <p className="text-white mb-4">Loading {progress}%</p>
    </div>
  );
};

export default Loading;
