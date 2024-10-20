import react, { useState, useEffect } from 'react';
import './styles/global.css';

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
