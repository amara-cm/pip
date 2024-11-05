import { useState, useEffect } from 'react';
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
  const [timer, setTimer] = useState(0); // Initialize to 0

  useEffect(() => {
    const fetchData = async () => {
      const userId = ''; // Fetch user ID from your context or other means
      const response = await fetch(`/api/mine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action: 'get-mining-session' }),
      });

      if (response.ok) {
        const miningSession = await response.json();
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - new Date(miningSession.startTime)) / 1000);
        const remainingTime = Math.max(0, miningSession.duration - elapsedTime);

        if (remainingTime > 0) {
          setTimer(remainingTime);
          setMining(true);
          setStone(0); // You can adjust stone based on previous data if needed
        }
      } else {
        console.error("Error fetching mining session");
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
        setStone((prevStone) => prevStone + (1 / 28800)); // Increment stone amount
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [mining]);

  const startMining = async () => {
    if (!mining) {
      const userId = ''; // Fetch user ID from your context or other means
      const response = await fetch(`/api/mine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action: 'start-mining' }),
      });

      if (response.ok) {
        setMining(true);
        setTimer(28800); // Reset timer to 8 hours
        setStone(0); // Reset stone collected
      } else {
        console.error("Error starting mining session");
      }
    }
  };

  const handleSell = async () => {
    const userId = ''; // Fetch user ID from your context or other means
    const response = await fetch(`/api/mine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, action: 'sell-stone' }),
    });

    if (response.ok) {
      setCoins((prevCoins) => prevCoins + 500); // Add coins after selling
      setStone(0); // Reset stone
      setMining(false); // End mining
    } else {
      console.error("Error selling stone");
    }
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-screen bg-black text-white font-outfit font-semibold">
      <div className="w-full max-w-[30rem] mt-[28%]">
        <StatDisplay 
          iconSrc="/icons/gamecoin.svg"
          value={coins} 
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
          ) : null
        ) : (
          <MiningButton onClick={startMining} />
        )}
        {mining && timer === 0 && <SellButton onClick={handleSell} />}
      </div>
      <Footer />
    </div>
  );
}

export default HomeScreen;
