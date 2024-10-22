import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Loading.module.css';

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
    <div className={styles['loading-scr']}>
      <div className={styles.text}>Loading... {progress}%</div>
    </div>
  );
};

export default Loading;
