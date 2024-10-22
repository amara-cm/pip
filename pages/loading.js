import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
    }, 100); // Adjust the time as needed
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="loading-scr">
      <div className="text">Loading... {progress}%</div>
    </div>
  );
};

export default Loading;
