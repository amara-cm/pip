import { useState, useEffect } from 'react';
import * as React from "react";
import Footer from '../components/Footer';

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
  const [userId, setUserId] = useState(''); 

  useEffect(() => {
    const fetchData = async () => {
      const savedState = await fetch(`/api/mine`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (savedState.ok) {
        const result = await savedState.json();
        const { startTime, duration, coins, stone } = result; 
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - new Date(startTime)) / 1000); 

        const remainingTime = Math.max(0, duration - elapsedTime); 
        setTimer(remainingTime);
        setMining(elapsedTime < duration); 
        setCoins(coins); 
        setStone(stone); 
      } else {
        console.error("Error fetching game state");
      }
    };

    fetchData();
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
        setStone((prevStone) => prevStone + (1 / 28800)); 
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [mining]);

  const startMining = async () => {
    if (!mining) {
      setMining(true);
      setTimer(28800); 
      setStone(0); 

      await fetch('/api/mine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'mine',
        }),
      });
    }
  };

  const handleSell = async () => {
    setCoins((prevCoins) => prevCoins + 500); 
    setStone(0); 
    setMining(false); 

    await fetch('/api/mine', {
      method: 'PUT',  
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId, 
        coins: coins + 500,
        stone,
        startTime: Date.now(),
        duration: 28800,
      }),
    });
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-screen bg-black text-white font-outfit font-semibold">
      <div className="w-full max-w-[30rem] mt-[28%]">
        <StatDisplay 
          iconSrc="/icons/gamecoin.svg"
          value={coins} // Display actual coins
        />
        <img 
          loading="lazy" 
          src="/mainicon.gif" 
          alt="Mining visualization"
          style={{ pointerEvents: 'none' }}
          className="mainicon w-[100vw] h-auto aspect-square mx-auto mb-16" 
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
      <Footer currentPage="home" />
    </div>
  );
}

export default HomeScreen;
