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
