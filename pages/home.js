import react, { useState, useEffect } from 'react';

const Home = () => {
  const [coins, setCoins] = useState(0);
  const [stoneAmount, setStoneAmount] = useState(0);
  const [countdown, setCountdown] = useState(8 * 60 * 60); // 8 hours
  const [mining, setMining] = useState(false);
  const [dailyReward, setDailyReward] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (mining) {
        setStoneAmount(stoneAmount + 1);
      }
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdown, mining, stoneAmount]);

  const handleMine = () => {
    setMining(true);
  };

  const handleSell = () => {
    setCoins(coins + stoneAmount * 500);
    setStoneAmount(0);
  };

  const handleClaimDailyReward = () => {
    setCoins(coins + dailyReward);
  };

  return (
    <div className="home-scr">
      <div className="coins">
        <span className="coin-icon"></span>
        <span className="coin-amt">{coins}</span>
      </div>
      <button className="mine-btn" onClick={handleMine}>
        Mine
      </button>
      {mining && (
        <div className="8h-tmr">
          <span className="frame">
            <span className="collecting">Collecting...</span>
            <span className="stone-amt">{stoneAmount}</span>
          </span>
        </div>
      )}
      {stoneAmount > 0 && (
        <button className="sell-btn" onClick={handleSell}>
          Sell
        </button>
      )}
      <div className="daily-reward">
        <span className="text">Daily Reward:</span>
        <span className="coin-icon"></span>
        <span className="coin-amt">{dailyReward}</span>
        <button className="claim-btn" onClick={handleClaimDailyReward}>
          Claim
        </button>
      </div>
      <div className="tab-bar">
        {/* Tab buttons */}
      </div>
    </div>
  );
};

export default Home;
import { useState } from 'react';

const Home = () => {
  const [coins, setCoins] = useState(0);
  const [mining, setMining] = useState(false);
  const [timer, setTimer] = useState(8 * 60 * 60); // 8 hours in seconds
  const [stone, setStone] = useState(0);

  const handleMine = () => {
    setMining(true);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          setMining(false);
          setStone(1); // 1 stone mined in 8 hours
        }
        return prev - 1;
      });
    }, 1000); // Update every second
  };

  const handleSell = () => {
    setCoins(coins + 500); // Add 500 coins for selling 1 stone
    setStone(0); // Reset stone amount
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
          <div className="text">Collecting {stone} stone</div>
          <div className="text">{new Date(timer * 1000).toISOString().substr(11, 8)}</div>
        </div>
      ) : (
        <button className="mine-btn" onClick={handleMine}>Mine</button>
      )}
      {stone > 0 && <button className="sell-btn" onClick={handleSell}>Sell +500 coins</button>}
      <div className="tab-bar">
        <button className="tab-btn tab-rewards" onClick={() => window.location.href = '/tasks'}>Rewards</button>
        <button className="tab-btn tab-site active" onClick={() => window.location.href = '/home'}>Home</button>
        <button className="tab-btn tab-friends" onClick={() => window.location.href = '/friends'}>Friends</button>
      </div>
    </div>
  );
};

export default Home;
