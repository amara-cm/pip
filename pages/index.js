import { useState, useEffect } from 'react';
import * as React from "react";

function MiningButton({ onClick }) {
  return (
    <button 
      className={styles['mine-btn']}
      aria-label="Start mining"
      onClick={onClick}
    >
      <div className={styles.text}>Mine</div>
    </button>
  );
}

function CollectingButton({ timer, stone }) {
  return (
    <div className={styles['8h-tmr']}>
      <div className={styles.frame}>
        <div className={`${styles.text} ${styles.collecting}`}>Collecting {stone.toFixed(3)}</div>
        <div className={styles.text}>{`${Math.floor(timer / 3600)}:${Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</div>
      </div>
    </div>
  );
}

function MiningSlot() {
  return (
    <div 
      className={`${styles.flex} ${styles['shrink-0']} ${styles['w-[8rem]']} ${styles['bg-black']} ${styles['h-[4.25rem]']}`}
      role="status"
      aria-label="Mining slot"
    />
  );
}

function StatDisplay({ iconSrc, value }) {
  return (
    <div className={`${styles.flex} ${styles.gap} ${styles['justify-center']} ${styles['items-center']} ${styles['self-center']} ${styles['text-4xl']} ${styles['font-bold']} ${styles['tracking-tighter']} ${styles['leading-none']} ${styles.text-white} ${styles.whitespace-nowrap}`}>
      <img 
        loading="lazy" 
        src={iconSrc} 
        alt=""
        className={`${styles['object-contain']} ${styles['shrink-0']} ${styles['self-stretch']} ${styles['my-auto']} ${styles['aspect-square']} ${styles['w-[2.1875rem]']} ${styles['h-[2.1875rem]']}`} 
      />
      <p className={styles['self-stretch']}>{value}</p>
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
    <div className={styles['home-scr']}>
      <main className={`${styles.flex} ${styles.overflow-hidden} ${styles['flex-col']} ${styles['pt-[11rem]']} ${styles['mx-auto']} ${styles['w-full']} ${styles['bg-black']} ${styles['max-w-[30rem]']} ${styles['h-full']} ${styles['justify-center']}`}>
        <StatDisplay 
          iconSrc="/icons/gamecoin.svg"
          value="0"
        />
        <img 
          loading="lazy" 
          src="/mainicon.gif" 
          alt="Mining visualization"
          className={styles.mainicon} 
        />
        {!mining ? (
          <MiningButton onClick={startMining} />
        ) : timer > 0 ? (
          <CollectingButton timer={timer} stone={stone} />
        ) : (
          <button className={styles['sell-btn']} onClick={handleSell}>
            <img src="/icons/sell-btn.svg" alt="Sell Button" className="inline-block" />
          </button>
        )}
        <section className={`${styles.flex} ${styles['gap-[0.625rem]']} ${styles['justify-center']} ${styles['items-center']} ${styles['mt-[3.5rem]']} ${styles['bg-black']}`}>
          <div className={`${styles.flex} ${styles.overflow-hidden} ${styles['gap-[0.625rem]']} ${styles['self-stretch']} ${styles['px-[0.125rem]']} ${styles['my-auto']} ${styles['border-t']} ${styles['border-zinc-500']} ${styles['border-opacity-10']} ${styles['w-[25.75rem]']}`}>
            {[1, 2, 3].map((slot) => (
              <MiningSlot key={slot} />
            ))}
          </div>
        </section>
      </main>
      <div className={styles.coins} style={{ marginTop: '25%' }}>
        <div className={styles['coin-icon']}></div>
        <div className={styles['coin-amt']}>{coins}</div>
      </div>
      <div className={`${styles['tab-bar']} ${styles.fixed} ${styles.bottom-0} ${styles['w-full']} ${styles['max-w-[30rem]']} ${styles['mx-auto']}`}>
        <button className={`${styles['tab-btn']} ${styles['tab-rewards']}`} onClick={() => window.location.href = '/tasks'}>
          <div className={styles.icon}></div>
        </button>
        <button className={`${styles['tab-btn']} ${styles['tab-site']}`}>
          <div className={styles.icon}></div>
        </button>
        <button className={`${styles['tab-btn']} ${styles['tab-friends']}`} onClick={() => window.location.href = '/friends'}>
          <div className={styles.icon}></div>
        </button>
      </div>
    </div>
  );
}

export default HomeScreen;
