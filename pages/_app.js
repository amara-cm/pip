import { useEffect, useState } from 'react';
import '../styles/global.css';
import Loading from './loading'; // Import your Loading component
import GameError from './GameError'; // Import your GameError component

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true); // Start with loading true
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // This function will handle the loading process and error handling
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
        await Promise.all(assets.map(preloadAsset)); // Preload assets
        // If successful, update loading state
        setLoading(false);
      } catch (error) {
        console.error('Error preloading assets:', error);
        setHasError(true); // Set error state if any asset fails to load
      }
    };

    preloadAssets(); // Start the preloading process
  }, []);

  // Render loading component while loading
  if (loading) {
    return <Loading />;
  }

  // Render error component if there's an error
  if (hasError) {
    return <GameError />;
  }

  // Render the main component if loading is complete and no errors occurred
  return <Component {...pageProps} />;
}

export default MyApp;
