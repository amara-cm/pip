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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action: 'status' }),
      });
  
      if (savedState.ok) {
        const result = await savedState.json();
        const { countdownEnd, stonesMined, canSell } = result; 
        const remainingTime = Math.max(0, (new Date(countdownEnd) - new Date()) / 1000);
        setTimer(remainingTime); 
        setMining(remainingTime > 0 && !canSell);
        setStone(stonesMined); 
      } else {
        console.error("Error fetching game state");
      }
    };
  
    if (userId) {
      fetchData();
    }
  }, [userId]); // Fetch when userId changes
  
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
  
        setStone((prevStone) => prevStone + (1 / 28800)); // Gradually add mined stones
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [mining]);

  // Starting the mining session (button click)
  const startMining = async () => {
    try {
      const response = await fetch('/api/mine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'start' }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result.message); // Show countdownEnd in the UI
        const { countdownEnd } = result;
        const remainingTime = Math.max(0, (new Date(countdownEnd) - new Date()) / 1000);
        setTimer(remainingTime);
        setMining(true);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Failed to start mining:', error);
    }
  };
  
  // Selling mined resources (button click)
  const sellMining = async () => {
    try {
      const response = await fetch('/api/mine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'sell' }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result.message); // Update UI to reflect new coin balance
        setCoins(prev => prev + 500);
        setStone(0);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Failed to sell mined resources:', error);
    }
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
