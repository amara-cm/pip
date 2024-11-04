import { useEffect, useState } from 'react';
import '../styles/global.css';
import Loading from '../components/loading'; // Import your Loading component
import GameError from '../components/GameError'; // Import your GameError component

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadingError, setHasLoadingError] = useState(false);

  useEffect(() => {
    // Preload assets
    const preloadAssets = async () => {
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

      try {
        await Promise.all(assets.map(preloadAsset));
        setIsLoading(false);
      } catch (error) {
        console.error('Error preloading assets:', error);
        setHasLoadingError(true);
      }
    };

    preloadAssets();
  }, []);

  // Render loading screen while assets are being preloaded
  if (isLoading) {
    return <Loading />;
  }

  // Render GameError if there's an error during loading
  if (hasLoadingError) {
    return <GameError />;
  }

  // Render the actual page component
  return <Component {...pageProps} />;
}

export default MyApp;
