import { useEffect, useState } from 'react';
import '../styles/global.css';
import Loading from '../components/loading'; // Import your Loading component
import GameError from '../components/GameError'; // Import your GameError component

function MyApp({ Component, pageProps }) {
  const [hasError, setHasError] = useState(false); // State to track error
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const [reloadCount, setReloadCount] = useState(0); // Track reload attempts

  useEffect(() => {
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
        setHasError(true); // Set error state if any asset fails to load
      }
    };

    preloadAssets(); // Start the preloading process
  }, []);

  useEffect(() => {
    // Limit the number of reload attempts
    if (hasError && reloadCount < 2) {
      setReloadCount(reloadCount + 1);
      window.location.reload(); // Reload the page when there's an error
    } else if (hasError && reloadCount >= 2) {
      console.error('Error persists after multiple reload attempts.');
      // Optionally, you can provide a fallback here or notify the user that the issue persists.
    }
  }, [hasError, reloadCount]);

  // Render loading component while loading assets
  if (isLoading) {
    return <Loading />; // Show loading component
  }

  // Render error component if there's an error and reload attempts are exceeded
  if (hasError && reloadCount >= 2) {
    return <GameError />; // Show error component only if reload attempts fail
  }

  // Render the main component if loading is complete and no errors occurred
  return <Component {...pageProps} />;
}

export default MyApp;
