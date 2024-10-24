import { useState, useEffect } from 'react';
import * as React from "react";

// Including MiningStats components directly
function MiningButton() {
  return (
    <button 
      className="overflow-hidden self-center px-16 py-4 mt-14 w-full text-base font-semibold leading-none whitespace-nowrap rounded-lg bg-neutral-100 max-w-[350px] text-stone-900"
      aria-label="Start mining"
    >
      Mine
    </button>
  );
}

function MiningSlot() {
  return (
    <div 
      className="flex shrink-0 w-32 bg-black h-[68px]"
      role="status"
      aria-label="Mining slot"
    />
  );
}

function StatDisplay({ iconSrc, value }) {
  return (
    <div className="flex gap-2 justify-center items-center self-center text-4xl font-bold tracking-tighter leading-none text-white whitespace-nowrap">
      <img 
        loading="lazy" 
        src={iconSrc} 
        alt=""
        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[35px]" 
      />
      <p className="self-stretch my-auto">{value}</p>
    </div>
  );
}

function MiningStats() {
  const slots = [1, 2, 3];

  return (
    <main className="flex overflow-hidden flex-col pt-44 mx-auto w-full bg-black max-w-[480px]">
      <StatDisplay 
        iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/cd88f82f60bbc428513e9f65dbc71f28e0869162e2a2a520a9c604ac7189c1c9?placeholderIfAbsent=true&apiKey=c7de70f57b014dd1a87bdc2dc51861a8"
        value="0"
      />
      <img 
        loading="lazy" 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b4a910302e6f5cc2413e3860a6379ee1b26acf71b35272415262cad9b977e64?placeholderIfAbsent=true&apiKey=c7de70f57b014dd1a87bdc2dc51861a8" 
        alt="Mining visualization"
        className="object-contain mt-6 w-full aspect-[0.92]" 
      />
      <MiningButton />
      <section className="flex gap-2.5 justify-center items-center mt-14 bg-black">
        <div className="flex overflow-hidden gap-2 self-stretch px-2 my-auto border-t border-zinc-500 border-opacity-10 w-[412px]">
          {slots.map((slot) => (
            <MiningSlot key={slot} />
          ))}
        </div>
      </section>
    </main>
  );
}

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
    <div className="home-scr">
      <MiningStats />
      <div className="coins">
        <div className="coin-icon"></div>
        <div className="coin-amt">{coins}</div>
      </div>

      <img src="/mainicon.gif" alt="Main Icon" className="mainicon" />

      {!mining ? (
        <button className="mine-btn" onClick={startMining}>
          <div className="text">Mine</div>
        </button>
      ) : timer > 0 ? (
        <div className="8h-tmr">
          <div className="frame">
            <div className="text collecting">Collecting {stone.toFixed(3)}</div>
            <div className="text tmr">{`${Math.floor(timer / 3600)}:${Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</div>
          </div>
        </div>
      ) : (
        <button className="sell-btn" onClick={handleSell}>
          <div className="text">
            Sell <img src="/icons/gamecoin.svg" alt="Coin Icon" className="inline-block w-4 h-4" /> +500
          </div>
        </button>
      )}

      <div className="tab-bar">
        <button className="tab-btn tab-rewards" onClick={() => window.location.href = '/tasks'}>
          <div className="icon"></div>
          <div className="text">Rewards</div>
        </button>
        <button className="tab-btn tab-site" onClick={() => window.location.href = '/home'}>
          <div className="icon"></div>
          <div className="text">Site</div>
        </button>
        <button className="tab-btn tab-friends" onClick={() => window.location.href = '/friends'}>
          <div className="icon"></div>
          <div className="text">Friends</div>
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
