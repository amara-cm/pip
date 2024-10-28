import { useState, useEffect } from 'react';

// DailyLogin Component
const DailyLogin = ({ currentDay, loginTimer, handleClaim }) => {
  return (
    <div className="text-center mb-4">
      <div className="text-2xl mb-4">Daily Login</div>
      <div className="flex justify-around mb-4">
        {[...Array(7)].map((_, index) => (
          <div key={index} className="text-xl">{index + 1}</div>
        ))}
      </div>
      {loginTimer <= 0 ? (
        <button onClick={handleClaim} className="px-4 py-2 bg-green-500 rounded text-xl">
          Claim
        </button>
      ) : (
        <div>{new Date(loginTimer * 1000).toISOString().substr(11, 8)}</div>
      )}
    </div>
  );
};

// TaskList Component
const TaskList = ({ tasks, handleGo }) => {
  return (
    <div className="text-center">
      <div className="text-2xl mb-4">Tasks</div>
      <div className="flex flex-col gap-4">
        {tasks.map(task => (
          <div key={task.id} className="flex justify-between items-center bg-gray-700 p-4 rounded">
            <span>{task.name}</span>
            <button onClick={() => handleGo(task)} className="px-4 py-2 bg-blue-500 rounded text-xl">
              Go
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const tasksList = [
  { id: 1, name: 'Subscribe to Pinx channel', reward: 200, link: 'https://t.me/therarepink' },
  { id: 2, name: 'Boost Pinx channel', reward: 300, link: 'https://t.me/boost/thepinx' },
  { id: 3, name: 'Follow us on X', reward: 200, link: 'https://x.com/realpinkstone' },
  { id: 4, name: 'Follow us on Instagram', reward: 200, link: 'https://instagram.com/pink' },
  { id: 5, name: 'Subscribe to our YouTube channel', reward: 500, link: 'https://youtube.com/pink' },
  { id: 6, name: 'Invite a friend', reward: 50, link: 'https://t.me/pinkbot?start=invite1' },
  { id: 7, name: 'Invite 3 friends', reward: 150, link: 'https://t.me/pinkbot?start=invite3' },
  { id: 8, name: 'Invite 10 friends', reward: 500, link: 'https://t.me/pinkbot?start=invite10' },
];

const Tasks = () => {
  const [tasks, setTasks] = useState(tasksList);
  const [loginTimer, setLoginTimer] = useState(24 * 60 * 60); // 24 hours in seconds
  const [dailyReward, setDailyReward] = useState(10);
  const [currentDay, setCurrentDay] = useState(1);
  const [coins, setCoins] = useState(0);

  const handleGo = (task) => {
    window.open(task.link, '_blank');
    setTimeout(() => {
      completeTask(task.id);
    }, 60000); // 1 minute delay
  };

  const completeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setCoins(coins + task.reward);
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const handleClaim = () => {
    setCoins(coins + dailyReward);
    setDailyReward(dailyReward + 10); // Increase daily reward
    setCurrentDay(currentDay + 1);
    setLoginTimer(24 * 60 * 60); // Reset timer
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLoginTimer(prev => prev - 1);
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-black text-white font-outfit font-semibold">
      <div className="w-full max-w-[30rem]">
        <DailyLogin
          currentDay={currentDay}
          loginTimer={loginTimer}
          handleClaim={handleClaim}
        />
        <TaskList tasks={tasks} handleGo={handleGo} />
      </div>
      <footer className="flex justify-around p-4 bg-black fixed bottom-0 w-full max-w-[30rem] gap-[0.4375rem]">
        <button className="cursor-not-allowed">
          <div style={{ pointerEvents: 'none' }}>
            <img src="/icons/arewards.svg" alt="Rewards" />
          </div>
        </button>
        <button onClick={() => window.location.href = '/'}>
          <div style={{ pointerEvents: 'none' }}>
            <img src="/icons/bsite.svg" alt="Home" />
          </div>
        </button>
        <button onClick={() => window.location.href = '/friends'}>
          <div style={{ pointerEvents: 'none' }}>
            <img src="/icons/bfriends.svg" alt="Friends" />
          </div>
        </button>
      </footer>
    </div>
  );
};

export default Tasks;
