import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

const HomeScreen = () => {
    const [coins, setCoins] = useState(0);  // Total earned coins
    const [stone, setStone] = useState(0);  // Collected stone
    const [timer, setTimer] = useState(28800);  // 8-hour countdown in seconds
    const [mining, setMining] = useState(false);

    // Load the game state on mount
    useEffect(() => {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const { coins, stone, timer, mining, lastUpdate } = JSON.parse(savedState);
            setCoins(coins);
            setStone(stone);
            const elapsed = Math.floor((Date.now() - lastUpdate) / 1000);
            if (mining && elapsed < timer) {
                setTimer(timer - elapsed);
                setStone(stone + (elapsed / 28800));  // Increment stone based on elapsed time
            } else if (elapsed >= 28800) {
                setTimer(0);
                setMining(false);
            }
        }
    }, []);

    // Save the game state on change
    useEffect(() => {
        localStorage.setItem('gameState', JSON.stringify({ coins, stone, timer, mining, lastUpdate: Date.now() }));
    }, [coins, stone, timer, mining]);

    // Start mining logic
    const startMining = () => {
        if (!mining) {
            setMining(true);
            setTimer(28800);  // Reset timer to 8 hours
            setStone(0);  // Reset stone
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setMining(false);
                        return 0;
                    }
                    return prev - 1;
                });
                setStone(prevStone => prevStone + (1 / 28800));  // Increment stone over time
            }, 1000);
        }
    };

    // Sell the collected stone and earn coins
    const handleSell = () => {
        setCoins(prevCoins => prevCoins + 500);  // Add 500 coins
        setStone(0);  // Reset stone to 0 after selling
    };

    return (
        <div className={styles['home-scr']}>
            {/* Coin display */}
            <div className={styles.coins}>
                <div className={styles['coinsamt-fr']}>
                    <div className={styles['coin-icon']}></div>
                    <div className={styles['coin-amt']}>{coins}</div>
                </div>
            </div>
            
            {/* Main Icon */}
            <img src="/mainicon.gif" alt="Main Icon" className={styles.mainicon} />

            {/* Mining or Collecting Logic */}
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

            {/* Tab Bar */}
            <div className={styles['tab-bar']}>
                <button className={styles['tab-btn']} onClick={() => window.location.href = '/tasks'}>Rewards</button>
                <button className={styles['tab-btn']} disabled>Site</button>
                <button className={styles['tab-btn']} onClick={() => window.location.href = '/friends'}>Friends</button>
            </div>
        </div>
    );
};

export default HomeScreen;
