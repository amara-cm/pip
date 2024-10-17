<<<<<<< HEAD
import { useCallback, useEffect, useState } from 'react'
import Button from '../components/Button'
import ClickCount from '../components/ClickCount'
import styles from '../styles/home.module.css'

function throwError() {
  console.log(
    // The function body() is not defined
    document.body()
  )
}

function Home() {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => {
    setCount((v) => v + 1)
  }, [setCount])

  useEffect(() => {
    const r = setInterval(() => {
      increment()
    }, 1000)

    return () => {
      clearInterval(r)
    }
  }, [increment])

  return (
    <main className={styles.main}>
      <h1>Fast Refresh Demo</h1>
      <p>
        Fast Refresh is a Next.js feature that gives you instantaneous feedback
        on edits made to your React components, without ever losing component
        state.
      </p>
      <hr className={styles.hr} />
      <div>
        <p>
          Auto incrementing value. The counter won't reset after edits or if
          there are errors.
        </p>
        <p>Current value: {count}</p>
      </div>
      <hr className={styles.hr} />
      <div>
        <p>Component with state.</p>
        <ClickCount />
      </div>
      <hr className={styles.hr} />
      <div>
        <p>
          The button below will throw 2 errors. You'll see the error overlay to
          let you know about the errors but it won't break the page or reset
          your state.
        </p>
        <Button
          onClick={(e) => {
            setTimeout(() => document.parentNode(), 0)
            throwError()
          }}
        >
          Throw an Error
        </Button>
      </div>
      <hr className={styles.hr} />
    </main>
  )
}

export default Home
=======
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
        <p>Points: {points} <span><img src="/coin-icon.png" alt="coin" /></span></p>
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
>>>>>>> f0ebc03e658ddc2c06dfc298591f21089614fc6b
