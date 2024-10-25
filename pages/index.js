import { useState, useEffect } from 'react';
import * as React from "react";
import styles from '../styles/Home.module.css'; // Import the CSS module

function MiningButton({ onClick }) {
  return (
    <button 
      className={styles.mineBtn} // Use CSS module class
      aria-label="Start mining"
      onClick={onClick}
    >
      <div className={styles.text}>Mine</div>
    </button>
  );
}

function CollectingButton({ timer, stone }) {
  return (
    <div className={styles.mineTmr}>
      <div className={styles.frame}>
        <div className={`${styles.text} ${styles.Collect}`}>Collecting {stone.toFixed(3)}</div>
        <div className={`${styles.text} ${styles.Timer}`}>{`${Math.floor(timer / 3600)}:${Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</div>
      </div>
    </div>
  );
}

function MiningSlot() {
  return (
    <div 
      className="flex shrink-0 w-[8rem] bg-black h-[4.25rem]"
      role="status"
      aria-label="Mining slot"
    />
  );
}

function StatDisplay({ iconSrc, value }) {
  return (
    <div className="flex gap-[0.5rem] justify-center items-center self-center text-4xl font-bold tracking-tighter leading-none text-white whitespace-nowrap">
      <img 
        loading="lazy"
        src={iconSrc}
        alt=""
        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[2.1875rem] h-[2.1875rem]"
      />
      <p className="self-stretch my-auto">{value}</p>
    </div>
  );
}

function HomeScreen() {
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
    <div className={styles.homeScr}>
      <main className="flex overflow-hidden flex-col pt-[11rem] mx-auto w-full bg-black max-w-[30rem] h-full justify-center">
        <StatDisplay 
          iconSrc="/icons/gamecoin.svg"
          value="0"
        />
        <img 
          loading="lazy"
          src="/mainicon.gif"
          alt="Mining visualization"
          className={styles.mainIcon}
        />
        {!mining ? (
          <MiningButton onClick={startMining} />
        ) : timer > 0 ? (
          <CollectingButton timer={timer} stone={stone} />
        ) : (
          <button className={styles.sellBtn} onClick={handleSell}>
            <img src="/icons/sell-btn.svg" alt="Sell Button" className="inline-block" />
          </button>
        )}
        <section className="flex gap-[0.625rem] justify-center items-center mt-[3.5rem] bg-black">
          <div className="flex overflow-hidden gap-[0.625rem] self-stretch px-[0.125rem] my-auto border-t border-zinc-500 border-opacity-10 w-[25.75rem]">
            {[1, 2, 3].map((slot) => (
              <MiningSlot key={slot} />
            ))}
          </div>
        </section>
      </main>
      <div className={styles.coins}>
        <div className={styles.coinIcon}></div>
        <div className={styles.coinAmt}>{coins}</div>
      </div>
      <div className={styles.tabBar}>
        <button className={`${styles.tabBtn} ${styles.tabRewards}`} onClick={() => window.location.href = '/tasks'}>
          <div className={styles.icon}></div>
        </button>
        <button className={styles.tabBtn}> ${styles.tabSite}`}
          <div className={styles.icon}></div>
        </button>
        <button className={`${styles.tabBtn} ${styles.tabFriends}`} onClick={() => window.location.href = '/friends'}>
          <div className={styles.icon}></div>
        </button>
      </div>
    </div>
  );
}

export default HomeScreen;
