import { useState, useEffect } from 'react';
import * as React from "react";
import Loading from './loading'; // Import the Loading component

function MiningButton({ onClick }) {
  return (
    <div className="flex justify-center">
      <div 
        className="object-contain w-[85vw] h-[6vh] mine-btn cursor-pointer" 
        aria-label="Start mining"
        onClick={onClick}
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
      >
        <img 
          src="/icons/mine-btn.svg" 
          alt="Mine Button"
          style={{ pointerEvents: 'none' }}  // Disable pointer events for the image
        />
      </div>
    </div>
  );
}

function CollectingButton({ timer, stone }) {
  return (
    <div className="flex justify-center">
      <div className="w-[85vw] h-[6vh] bg-[#383838] border border-[#E7E7E7] rounded-lg flex items-center justify-between px-4 box-border">
        <div className="font-outfit font-semibold text-[1rem] text-[#B3B3B3]">
          Collecting {stone.toFixed(3)}
        </div>
        <div className="font-outfit font-semibold text-[1rem] text-[#B3B3B3]">
          {`${Math.floor(timer / 3600)}:${Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}
        </div>
      </div>
    </div>
  );
}

function SellButton({ onClick }) {
  return (
    <div className="flex justify-center">
      <div 
        className="object-contain w-[85vw] h-[6vh] sell-btn cursor-pointer" 
        aria-label="Sell stone"
        onClick={onClick}
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
      >
        <img 
          src="/icons/sell-btn.svg" 
          alt="Sell Button"
          style={{ pointerEvents: 'none' }}  // Disable pointer events for the image
        />
      </div>
    </div>
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
        style={{ pointerEvents: 'none' }}
      />
      <p className="self-stretch my-auto">{value}</p>
    </div>
  );
}

function HomeScreen() {
  const [coins, setCoins] = useState(0);
  const [stone, setStone] = useState(0);
  const [mining, setMining] = useState(false);
  const [timer, setTimer] = useState(28800); // 8 hours in seconds
  const [isCollectingActive, setIsCollectingActive] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setLoading(true); // Set loading to true initially
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
    setLoading(false); // Set loading to false after state is restored
  }, []);

  useEffect(() => {
    if (mining) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsCollectingActive(false); // Timer ends, stop collecting
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
      setIsCollectingActive(true); // Activate Collecting button
    }
  };

  const handleSell = () => {
    setCoins((prevCoins) => prevCoins + 500); // Add coins after selling
    setStone(0); // Reset stone
    setIsCollectingActive(false); // Deactivate Collecting button
    setMining(false); // Go back to mining
  };

  if (loading) {
    return <Loading />; // Show loading screen while loading is true
  }

  return (
    <div className="flex flex-col items-center w-full h-screen bg-black text-white font-outfit font-semibold">
      <div className="w-full max-w-[30rem] mt-[28%]">
        <StatDisplay 
          iconSrc="/icons/gamecoin.svg"
          onContextMenu={(e) => e.preventDefault()} 
          onTouchStart={(e) => e.preventDefault()}
          style={{ pointerEvents: 'none' }}
          value="0"
        />
        <img 
          loading="lazy" 
          src="/mainicon.gif" 
          alt="Mining visualization"
          onContextMenu={(e) => e.preventDefault()} 
          onTouchStart={(e) => e.preventDefault()} 
          style={{ pointerEvents: 'none' }}
          className="mainicon w-[100vw] h-auto aspect-square mx-auto" 
        />
        {mining ? (
          timer > 0 ? (
            <CollectingButton timer={timer} stone={stone} />
          ) : (
            <SellButton onClick={handleSell} />
          )
        ) : (
          <MiningButton onClick={startMining} />
        )}
      </div>
      <footer className="flex justify-around p-4 bg-black fixed bottom-0 w-full max-w-[30rem] gap-[0.4375rem]">
        <button onClick={() => window.location.href = '/tasks'} className="flex justify-center items-center">
          <div style={{ pointerEvents: 'none' }}>
            <img src="/icons/brewards.svg" alt="Rewards" className="mx-auto my-0" />
          </div>
        </button>
        <button className="cursor-not-allowed flex justify-center items-center">
          <div style={{ pointerEvents: 'none' }}>
            <img src="/icons/asite.svg" alt="Home" className="mx-auto my-0" />
          </div>
        </button>
        <button onClick={() => window.location.href = '/friends'} className="flex justify-center items-center">
          <div style={{ pointerEvents: 'none' }}>
            <img src="/icons/bfriends.svg" alt="Friends" className="mx-auto my-0" />
          </div>
        </button>
      </footer>
    </div>
  );
}

export default HomeScreen;
