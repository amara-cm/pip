import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

const HomeScreen = () => {
    const [coins, setCoins] = useState(0);
    const [stone, setStone] = useState(0);
    const [timer, setTimer] = useState(0);
    const [mining, setMining] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const { coins, stone, mining, startTime } = JSON.parse(savedState);
            setCoins(coins);
            setStone(stone);

            // Calculate elapsed time and adjust timer
            if (mining) {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                if (elapsed < 28800) {
                    setTimer(28800 - elapsed);
                    setMining(true);
                    setStone(stone + (elapsed / 28800));
                } else {
                    setTimer(0);
                    setMining(false);
                }
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('gameState', JSON.stringify({ 
            coins, 
            stone, 
            mining, 
            startTime: mining ? Date.now() : null 
        }));
    }, [coins, stone, mining]);

    const startMining = () => {
        if (!mining) {
            setMining(true);
            setTimer(28800); // 8 hours
            setStone(0); // Reset stone
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setMining(false);
                        return 0;
                    }
                    return prev - 1;
                });
                setStone(prevStone => prevStone + (1 / 28800)); // Increment stone amount
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
            
            <img src="/mainicon.gif" alt="Main Icon" className={styles.mainicon} />

            {!mining ? (
                <button className={styles['mine-btn']} onClick={startMining}>
                    <div className={styles.text}>Mine</div>
                </button>
            ) : timer > 0 ? (
                <div className={styles['8h-tmr']}>
                    <div className={styles.frame}>
                        <div className={`${styles.text} ${styles.collecting}`}>Collecting {stone.toFixed(3)}</div>
                        <div className={`${styles.text} ${styles.tmr}`}>
                            {`${Math.floor(timer / 3600)}:${Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}
                        </div>
                    </div>
                </div>
            ) : (
                <button className={styles['sell-btn']} onClick={handleSell}>
                    <div className={styles.text}>Sell <img src="/icons/gamecoin.svg" alt="Coin Icon" /> +500</div>
                </button>
            )}

            <div className={styles['tab-bar']}>
                <button className={styles['tab-btn']} onClick={() => window.location.href = '/tasks'}>Rewards</button>
                <button className={styles['tab-btn']} onClick={() => window.location.href = '/home'}>Site</button>
                <button className={styles['tab-btn']} onClick={() => window.location.href = '/friends'}>Friends</button>
            </div>
        </div>
    );
};

export default HomeScreen;
