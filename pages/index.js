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
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-black overflow-hidden">
            <div className="flex items-center justify-center gap-2 mt-5">
                <div className="w-4 h-4 bg-[url('/icons/gamecoin.svg')] bg-contain bg-no-repeat"></div>
                <div className="font-sans font-bold text-4xl text-white">{coins}</div>
            </div>

            <img src="/mainicon.gif" alt="Main Icon" className="w-screen max-h-[80vh] mt-5" />

            {!mining ? (
                <button className="flex items-center justify-center w-[85vw] h-[5.5vh] rounded mt-5 bg-yellow-500" onClick={startMining}>
                    <div className="font-sans font-semibold text-center text-base text-black">Mine</div>
                </button>
            ) : timer > 0 ? (
                <div className="flex justify-between items-center w-[85vw] h-[5.5vh] bg-gray-700 border border-gray-200 rounded p-2 mt-5">
                    <div className="flex gap-2 font-sans font-semibold text-base text-gray-400">
                        <div>Collecting {stone.toFixed(3)}</div>
                        <div>{`${Math.floor(timer / 3600)}:${Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</div>
                    </div>
                </div>
            ) : (
                <button className="flex items-center justify-center w-[85vw] h-[5.5vh] rounded mt-5 bg-yellow-500" onClick={handleSell}>
                    <div className="font-sans font-semibold text-center text-base text-white">
                        Sell <img src="/icons/gamecoin.svg" alt="Coin Icon" className="inline-block w-4 h-4" /> +500
                    </div>
                </button>
            )}

            <div className="fixed bottom-0 flex justify-around w-screen p-2 bg-black">
                <button className="flex-1 text-center font-sans font-semibold text-base text-white" onClick={() => window.location.href = '/tasks'}>
                    Rewards
                </button>
                <button className="flex-1 text-center font-sans font-semibold text-base text-white" onClick={() => window.location.href = '/home'}>
                    Site
                </button>
                <button className="flex-1 text-center font-sans font-semibold text-base text-white" onClick={() => window.location.href = '/friends'}>
                    Friends
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;
