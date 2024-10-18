import { useEffect, useState } from 'react';
import { generateUID } from '../utils/uid';

export default function Home({ initialUID }) {
  const [miningTime, setMiningTime] = useState(28800); // 8 hours in seconds
  const [collectedStone, setCollectedStone] = useState(0.0);
  const [points, setPoints] = useState(0); // Player points earned
  const [dailyLoginCountdown, setDailyLoginCountdown] = useState(86400); // 24 hours in seconds
  const [dailyReward, setDailyReward] = useState(10); // Starting daily reward
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [uid, setUID] = useState(initialUID);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    // Set referral link on UID generation
    setReferralLink(`https://t.me/yourGameBot/start/${uid}`);
  }, [uid]);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        alert('Referral link copied!');
      })
      .catch(() => {
        alert('Failed to copy referral link.');
      });
  };

  return (
    <div className="home">
      <header>
        <p>Player UID: {uid}</p>
        <p>Points: {points} <span><img src="/public/icons/gamecoin.svg" alt="coin" /></span></p>
      </header>
      <main>
        <section className="mining-section">
          <p>Mining Time Left: {miningTime} seconds</p>
          <p>Collected Stone: {collectedStone}</p>
          <button onClick={handleSell}>Sell Stone</button>
        </section>
        <section className="daily-reward-section">
          <p>Daily Login Countdown: {dailyLoginCountdown} seconds</p>
          <button onClick={handleClaimDailyReward}>Claim Daily Reward</button>
        </section>
        <section className="task-section">
          <p>Task Completed: {taskCompleted ? 'Yes' : 'No'}</p>
          <button onClick={handleTaskCompletion}>Complete Task</button>
        </section>
        <section className="referral-section">
          <p>Referral Link: {referralLink}</p>
          <button onClick={handleCopyLink}>Copy Link</button>
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const initialUID = generateUID(); // Generate UID on the server
  return {
    props: {
      initialUID,
    },
  };
}
