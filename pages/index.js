import { useEffect, useState } from 'react';

export default function Home() {
  const [miningTime, setMiningTime] = useState(28800); // 8 hours in seconds
  const [collectedStone, setCollectedStone] = useState(0.0);
  const [points, setPoints] = useState(0); // Player points earned
  const [dailyLoginCountdown, setDailyLoginCountdown] = useState(86400); // 24 hours in seconds
  const [dailyReward, setDailyReward] = useState(10); // Starting daily reward
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [uid, setUID] = useState(generateUID());

  useEffect(() => {
    // Mining countdown logic
    const timer = setInterval(() => {
      if (miningTime > 0) {
        setMiningTime((prevTime) => prevTime - 1);
        setCollectedStone((prevStone) => (prevStone < 1 ? (prevStone + 0.00011574).toFixed(3) : 1).toString()); // Generates up to 1 stone
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [miningTime]);

  useEffect(() => {
    // Daily login countdown
    const dailyTimer = setInterval(() => {
      if (dailyLoginCountdown > 0) {
        setDailyLoginCountdown((prevTime) => prevTime - 1);
      }
    }, 1000);

    return () => clearInterval(dailyTimer);
  }, [dailyLoginCountdown]);

  const handleSell = () => {
    setPoints(points + parseFloat(collectedStone)); // Update points with collected stone
    setCollectedStone(0.0); // Reset collected stone
    setMiningTime(28800); // Reset the mining time for another mining session
  };

  const handleClaimDailyReward = () => {
    if (dailyLoginCountdown <= 0) {
      setPoints(points + dailyReward); // Update points with daily reward
      setDailyLoginCountdown(86400); // Reset daily login countdown
      setDailyReward((prev) => (prev < 100 ? prev + 10 : 100)); // Increment daily reward
    }
  };

  const handleTaskCompletion = () => {
    setTaskCompleted(true);
    setPoints(points + 50); // Example reward for task completion
  };

  function generateUID() {
    const chars = '0123456789ABC';
    let uid = '';
    for (let i = 0; i < 7; i++) {
      uid += chars[Math.floor(Math.random() * chars.length)];
    }
    return uid;
  }

  return (
    <div className="home">
      <header>
        <p>Player UID: {uid}</p>
        <p>Points: {points} <span><img src="/public/icons/gamecoin.svg" alt="coin" /></span></p>
      </header>

      <main>
        <section className="mining-section">
          <button onClick={handleSell} disabled={miningTime > 0}>Sell</button>
          <p>Collecting: {collectedStone} stone</p>
          <p>Time remaining: {new Date(miningTime * 1000).toISOString().substr(11, 8)}</p>
        </section>

        <section className="daily-login-section">
          <button disabled={dailyLoginCountdown > 0} onClick={handleClaimDailyReward}>Claim</button>
          <p>Daily Login Reward: {dailyReward} coins</p>
          <p>Next reward in: {new Date(dailyLoginCountdown * 1000).toISOString().substr(11, 8)}</p>
        </section>

        <section className="tasks-section">
          <button onClick={handleTaskCompletion}>Go</button>
          {taskCompleted && <button>Claim</button>}
        </section>

        <section className="referrals-section">
          <button>Invite</button>
          <button>Copy Link</button>
          {/* Friends list should go here */}
        </section>
      </main>
    </div>
  );
}
