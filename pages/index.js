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
          style={{ pointerEvents: 'none' }}
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
          {`${Math.floor(timer / 3600)}:${Math.floor((timer % 3600) / 60)
            .toString()
            .padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}
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
          style={{ pointerEvents: 'none' }}
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

  // Fetch saved state from the server (for example, when page reloads)
  useEffect(() => {
    const fetchData = async () => {
      const userId = ''; // Replace with the actual user ID logic

      const savedState = await fetch(`/api/mine?userId=${userId}`, {
        method: 'GET',
      });

      if (savedState.ok) {
        const result = await savedState.json();
        const { startTime, duration, stone, coins } = result;
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - new Date(startTime)) / 1000); // in seconds

        const remainingTime = Math.max(0, duration - elapsedTime); // calculate remaining time
        setTimer(remainingTime);
        setMining(elapsedTime < duration);
        setCoins(coins);
        setStone(stone);
      }
    };

    fetchData();
  }, []);

  // Handle the mining countdown
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
        setStone((prevStone) => prevStone + 1 / 28800); // Increment stone amount
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [mining]);

  const startMining = async () => {
    if (!mining) {
      const currentTime = new Date().toISOString();

      setMining(true);
      setTimer(28800); // Reset timer
      setStone(0); // Reset stone collected

      // Save mining start time to the server
      const response = await fetch('/api/mine', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id, // Replace with actual user ID
          startTime: currentTime,
          stone: 0,
          coins,
        }),
      });
    }
  };

  const handleSell = async () => {
    const newCoins = coins + 500;

    setCoins(newCoins); // Add coins after selling
    setStone(0); // Reset stone
    setMining(false); // End mining

    // Save the updated coin balance to the server
    const response = await fetch('/api/mine', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id, // Replace with actual user ID
        startTime: currentTime,
        stone: 0,
        coins: newCoins,
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
