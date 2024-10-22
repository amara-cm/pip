import { useEffect, useState } from 'react';

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          window.location.href = '/home';  // Redirect to Home page when loading is complete
        }
        return prev + 1;
      });
    }, 100); // Adjust the time as needed
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-scr">
      <div className="text">Loading... {progress}%</div>
    </div>
  );
};

export default Loading;
