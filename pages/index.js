import { useState, useEffect } from 'react';

const HomeScreen = () => {
    const [coins, setCoins] = useState(0);
    const [stone, setStone] = useState(0);
    const [timer, setTimer] = useState(28800); // 8 hours in seconds
    const [mining, setMining] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const { coins, stone, timer, mining, lastUpdate } = JSON.parse(savedState);
            setCoins(coins);
            setStone(stone);
            const elapsed = Math.floor((Date.now() - lastUpdate) / 1000);
            if (mining) {
                if (elapsed < timer) {
                    setTimer(timer - elapsed);
                    setStone(stone + ((1 / 28800) * elapsed));
                } else {
                    setTimer(0);
                    setStone(1);
                    setMining(false);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (mining) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setMining(false);
                        return 0;
                    }
                    return prev - 1;
                });
                setStone((prevStone) => prevStone + (1 / 28800)); // Increment stone amount
            }, 1000);

            return () => clearInterval(interval); // Clear interval on unmount
        }
    }, [mining]);

    useEffect(() => {
        localStorage.setItem(
            'gameState',
            JSON.stringify({
                coins,
                stone,
                timer,
                mining,
                lastUpdate: Date.now(),
            })
        );
    }, [coins, stone, timer, mining]);

    const startMining = () => {
        if (!mining) {
            setMining(true);
            setTimer(28800); // Reset timer
            setStone(0); // Reset stone collected
        }
    };

    const handleSell = () => {
        setCoins((prevCoins) => prevCoins + 500);
        setStone(0);
    };

    return (
        <div className="home-scr">
            <div className="coins">
                <div className="coinsamt-fr">
                    <div className="coin-icon"></div>
                    <div className="text">{coins}</div>
                </div>
            </div>

            <img src="/mainicon.gif" alt="Main Icon" className="mainicon" />

            {!mining ? (
                <button className="mine-btn" onClick={startMining}>
                    <div className="text">Mine</div>
                </button>
            ) : timer > 0 ? (
                <div className="8h-tmr">
                    <div className="frame">
                        <div className="text collecting">Collecting {stone.toFixed(3)}</div>
                        <div className="text tmr">{`${Math.floor(timer / 3600)}:${Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</div>
                    </div>
                </div>
            ) : (
                <button className="sell-btn" onClick={handleSell}>
                    <div className="text">
                        Sell <img src="/icons/gamecoin.svg" alt="Coin Icon" className="inline-block w-4 h-4" /> +500
                    </div>
                </button>
            )}

            <div className="tab-bar">
                <button className="tab-btn tab-rewards" onClick={() => window.location.href = '/tasks'}>
                    <div className="icon"></div>
                    <div className="text">Rewards</div>
                </button>
                <button className="tab-btn tab-site" onClick={() => window.location.href = '/home'}>
                    <div className="icon"></div>
                    <div className="text">Site</div>
                </button>
                <button className="tab-btn tab-friends" onClick={() => window.location.href = '/friends'}>
                    <div className="icon"></div>
                    <div className="text">Friends</div>
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;
