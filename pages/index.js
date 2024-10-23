import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

const HomeScreen = () => {
    const [coins, setCoins] = useState(0);
    const [stone, setStone] = useState(0);
    const [timer, setTimer] = useState(28800); // 8 hours in seconds
    const [mining, setMining] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const { coins, stone, timer, mining } = JSON.parse(savedState);
            setCoins(coins);
            setStone(stone);
            setTimer(timer);
            setMining(mining);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('gameState', JSON.stringify({ coins, stone, timer, mining }));
    }, [coins, stone, timer, mining]);

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
                        <div className={`${styles.text} ${styles.tmr}`}>{`${Math.floor(timer / 3600)}:${Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</div>
                    </div>
                </div>
            ) : (
                <button className={styles['sell-btn']} onClick={handleSell}>
                    <div className={styles.text}>Sell <img src="/icons/gamecoin.svg" alt="Coin Icon" /> +500</div>
                </button>
            )}

            <div className={styles['tab-bar']}>
                <button className={styles['tab-btn']} onClick={() => window.location.href = '/tasks'}>Rewards</button>
                <button className={styles['tab-btn']} onClick={() => window.location.href = '/home'}>Friends</button>
                <button className={styles['tab-btn']} onClick={(e) => e.preventDefault()}>Site</button>
            </div>
        </div>
    );
};

export default HomeScreen;
