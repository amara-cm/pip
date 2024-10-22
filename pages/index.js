import { useState, useEffect } from 'react';

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
        <div className="home-scr">
            <div className="coins">
                <div className="coinsamt-fr">
                    <div className="coin-icon"></div>
                    <div className="coin-amt">{coins}</div>
                </div>
            </div>
            <button className="mine-btn" onClick={startMining}>
                <div className="text">Mine</div>
            </button>
            {mining && (
                <div className="8h-tmr">
                    <div className="frame">
                        <div className="text collecting">Collecting</div>
                        <div className="text stone-amt">{stone}</div>
                        <div className="text tmr">{`${Math.floor(timer / 3600)}:${Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</div>
                    </div>
                </div>
            )}
            {stone > 0 && (
                <button className="sell-btn" onClick={handleSell}>
                    <div className="text">Sell</div>
                </button>
            )}
        </div>
    );
};

export default HomeScreen;
