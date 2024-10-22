import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

const HomeScreen = () => {
    const [coins, setCoins] = useState(0);
    const [stone, setStone] = useState(0);
    const [timer, setTimer] = useState(28800); // 8 hours in seconds
    const [mining, setMining] = useState(false);

    useEffect(() => {
        // Load user data when component mounts
        const loadUserData = async () => {
            try {
                const response = await fetch('/api/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ telegramUsername: 'lons' }), // Replace with actual username
                });

                if (!response.ok) {
                    throw new Error('Failed to load user data');
                }

                const user = await response.json();
                setCoins(user.coins); // Assuming 'coins' is a field in your User model
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        loadUserData();
    }, []);

    const startMining = () => {
        if (!mining) {
            setMining(true);
            setTimer(28800); // Reset timer
            setStone(0); // Reset stone collected
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setMining(false);
                        setCoins(prevCoins => prevCoins + 500); // Add coins after mining
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    const handleSell = () => {
        // Logic to sell stones and update coins
        setCoins(prevCoins => prevCoins + 500);
        setStone(0); // Reset stone after selling
    };

    return (
        <div className={styles['home-scr']}>
            <div className={styles.coins}>
                <div className={styles['coinsamt-fr']}>
                    <div className={styles['coin-icon']}></div>
                    <div className={styles['coin-amt']}>{coins}</div>
                </div>
            </div>
            <button className={styles['mine-btn']} onClick={startMining}>
                <div className={styles.text}>Mine</div>
            </button>
            {mining && (
                <div className={styles['8h-tmr']}>
                    <div className={styles.frame}>
                        <div className={`${styles.text} ${styles.collecting}`}>Collecting</div>
                        <div className={`${styles.text} ${styles['stone-amt']}`}>{stone}</div>
                        <div className={`${styles.text} ${styles.tmr}`}>{`${Math.floor(timer / 3600)}:${Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</div>
                    </div>
                </div>
            )}
            {stone > 0 && (
                <button className={styles['sell-btn']} onClick={handleSell}>
                    <div className={styles.text}>Sell</div>
                </button>
            )}
        </div>
    );
};

export default HomeScreen;

import { useState, useEffect } from 'react';

const Home = () => {
  const [coins, setCoins] = useState(0);
  const [stoneAmount, setStoneAmount] = useState(0);
  const [countdown, setCountdown] = useState(8 * 60 * 60); // 8 hours in seconds
  const [mining, setMining] = useState(false);

  useEffect(() => {
    let interval;
    if (mining && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
        setStoneAmount(prev => prev + (1 / (8 * 60 * 60))); // Generate up to 1 stone in 8 hours
      }, 1000); // Update every second
    } else if (countdown <= 0) {
      clearInterval(interval);
      setMining(false);
    }
    return () => clearInterval(interval);
  }, [mining, countdown]);

  const handleMine = () => {
    setMining(true);
  };

  const handleSell = () => {
    setCoins(coins + 500); // Add 500 coins for selling 1 stone
    setStoneAmount(0); // Reset stone amount
    setCountdown(8 * 60 * 60); // Reset countdown
  };

  return (
    <div className="home-scr">
      <div className="coinsamt-fr">
        <div className="coin-icon"></div>
        <div className="text">{coins}</div>
      </div>
      <div className="gif">[GIF]</div>
      {mining ? (
        <div>
          <div className="text">Collecting {stoneAmount.toFixed(3)} stone</div>
          <div className="text">{new Date(countdown * 1000).toISOString().substr(11, 8)}</div>
        </div>
      ) : (
        <button className="mine-btn" onClick={handleMine}>Mine</button>
      )}
      {countdown <= 0 && stoneAmount > 0 && (
        <button className="sell-btn" onClick={handleSell}>Sell +500 coins</button>
      )}
      <div className="tab-bar">
        <button className="tab-btn tab-rewards" onClick={() => window.location.href = '/tasks'}>Rewards</button>
        <button className="tab-btn tab-site active" onClick={() => window.location.href = '/home'}>Home</button>
        <button className="tab-btn tab-friends" onClick={() => window.location.href = '/friends'}>Friends</button>
      </div>
    </div>
  );
};

export default Home;
