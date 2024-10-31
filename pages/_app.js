import { useEffect, useState } from 'react';
import '../styles/global.css';
import Loading from '../components/loading'; // Import your Loading component
import GameError from '../components/GameError'; // Import your GameError component

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const [hasLoadingError, setHasLoadingError] = useState(false); // State to track loading errors

  useEffect(() => {
    // This function will handle the asset preloading process
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
        setIsLoading(false); // Set loading to false after assets are preloaded
      } catch (error) {
        console.error('Error preloading assets:', error);
        setHasLoadingError(true); // Set loading error state
      }
    };

    preloadAssets(); // Start the preloading process
  }, []);

  // Render the loading screen while assets are preloading
  if (isLoading) {
    return <Loading />;
  }

  // Render the GameError component if there's a loading error
  if (hasLoadingError) {
    return <GameError />;
  }

  // Render the main app component if everything is loaded successfully
  return <Component {...pageProps} />;
}

export default MyApp;
