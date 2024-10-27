import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProgressIndicator from '../components/loading';

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          router.push('/home');  // Redirect to Home page when loading is complete
        }
        return prev + 1;
      });
    }, 10); // 10ms delay for each percent
    return () => clearInterval(interval);
  }, [router]);

  return <ProgressIndicator />;
};

export default Loading;
