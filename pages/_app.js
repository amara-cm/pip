import 'tailwindcss/tailwind.css'; // Importing Tailwind CSS
import Loading from '../components/loading';
import GameError from '../components/GameError';

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadingError, setHasLoadingError] = useState(false);

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // Preload your assets
        setIsLoading(false); // Set loading to false if successful
      } catch (error) {
        console.error('Error preloading assets:', error);
        setHasLoadingError(true);
      }
    };

    preloadAssets();
  }, []);

  if (isLoading) return <Loading />;
  if (hasLoadingError) return <GameError />;

  return <Component {...pageProps} />;
}

export default MyApp;