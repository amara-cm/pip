import styles from '../styles/Error.module.css';

const Error = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={styles['error-scr']}>
      <div className={styles.text}>Try Again</div>
      <button className={styles['refresh-btn']} onClick={handleRefresh}>Refresh</button>
    </div>
  );
};

export default Error;
