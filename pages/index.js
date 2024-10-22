import { useState, useEffect } from 'react';

const HomeScreen = () => {
    const [coins, setCoins] = useState(0);
    const [stone, setStone] = useState(0);
    const [timer, setTimer] = useState(28800); // 8 hours in seconds
    const [mining, setMining] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const response = await fetch('/api/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ telegramUsername: 'lons' }),
                });

                if (!response.ok) {
                    throw new Error('Failed to load user data');
                }

                const user = await response.json();
                setCoins(user.coins);
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
        setCoins(prevCoins => prevCoins + 500);
        setStone(0);
    };

    return (
    <div className={styles['home-scr']}>
        <div className={styles.coins}>
            <div className={styles['coinsamt-fr']}>
                <div className={styles['coin-icon']}></div>
                <div className={styles['coin-amt']}>{coins}</div>
            </div>
        </div>

        {/* Conditionally show the Mine or Collecting UI */}
        {!mining ? (
            <button className={styles['mine-btn']} onClick={startMining}>
                <div className={styles.text}>Mine</div>
            </button>
        ) : (
            <div className={styles['8h-tmr']}>
                <div className={styles.frame}>
                    <div className={`${styles.text} ${styles.collecting}`}>Collecting</div>
                    <div className={`${styles.text} ${styles['stone-amt']}`}>{stone.toFixed(3)}</div>
                    <div className={`${styles.text} ${styles.tmr}`}>{`${Math.floor(timer / 3600)}:${Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</div>
                </div>
            </div>
        )}

        {stone > 0 && (
            <button className={styles['sell-btn']} onClick={handleSell}>
                <div className={styles.text}>Sell</div>
            </button>
        )}

        {/* Tab Bar should always be visible */}
        <div className={styles['tab-bar']}>
            <button className={styles['tab-btn']}>Rewards</button>
            <button className={styles['tab-btn']}>Friends</button>
        </div>
    </div>
);

export default HomeScreen;
