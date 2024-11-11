import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

// DailyLogin Component
const DailyLogin = ({ currentDay, loginTimer, handleClaim, coins }) => {
  return (
    <div className="relative flex flex-col justify-start items-center w-screen h-[21.56vh] overflow-y-scroll px-[2%] pt-[1%] gap-[2%]">
      <div className="self-start font-outfit font-semibold text-[1rem] text-white mt-2 ml-2 tracking-[0.5px] leading-[100%]">
        Daily Login
      </div>
      <div className="flex flex-row justify-start items-center w-[90.29vw] h-[27.78vh] gap-[0.5rem]">
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className="relative flex flex-col justify-center items-center p-[1%] gap-[0.5rem] w-[13.46%] h-[100%] bg-black border border-white rounded-[0.5rem]"
            style={{
              backgroundImage: `url('/d${index + 1}.svg')`, // Dynamically setting the background image
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'contain',
            }}
          >
            <span className="font-semibold text-[0.625rem] text-white leading-[0.625rem] tracking-[0.03125rem]">
              Day {index + 1}
            </span>
            <div className="w-[22%] h-[20%]">
              <img src="/icons/gamecoin.svg" alt="coins" style={{ pointerEvents: 'none' }} className="w-[22%] h-[20%]" />
            </div>
          </div>
        ))}
      </div>
      {loginTimer <= 0 ? (
        <button
          onClick={handleClaim}
          className="absolute w-[85%] h-[20.2%] bg-gray-100 rounded-[0.5rem] bottom-[31.8%] flex justify-center items-center"
        >
          <span className="font-semibold text-[1rem] text-black">Claim</span>
        </button>
      ) : (
        <div className="absolute w-[85%] h-[20.2%] bg-gray-600 border border-gray-300 rounded-[0.5rem] bottom-[31.8%] flex justify-center items-center">
          <span className="font-semibold text-[1rem] text-gray-400">
            {new Date(loginTimer * 1000).toISOString().substr(11, 8)}
          </span>
        </div>
      )}
    </div>
  );
};

// TaskList Component
const TaskList = ({ tasks, handleGo, handleClaim }) => {
  return (
    <div className="text-center">
      <div className="text-2xl mb-4">Tasks</div>
      <div className="flex flex-col gap-4">
        {tasks.map(task => (
          <div key={task.id} className="flex justify-between items-center bg-gray-700 p-4 rounded">
            <span>{task.name}</span>
            {task.type === 'referral' ? (
              task.progress >= task.requirement ? (
                <button onClick={() => handleClaim(task)} className="px-4 py-2 bg-green-500 rounded text-xl">
                  Claim
                </button>
              ) : (
                <span>{`${task.progress}/${task.requirement}`}</span>
              )
            ) : (
              <button onClick={() => handleGo(task)} className="px-4 py-2 bg-blue-500 rounded text-xl">
                Go
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const tasksList = [
  { id: 1, name: 'Subscribe to Pinx channel', reward: 200, link: 'https://t.me/pinxann', type: 'normal' },
  { id: 2, name: 'Boost Pinx channel', reward: 300, link: 'https://t.me/boost/pinxann', type: 'normal' },
  { id: 3, name: 'Follow us on X', reward: 200, link: 'https://x.com/thepinxhouse', type: 'normal' },
  { id: 4, name: 'Follow us on Instagram', reward: 200, link: 'https://www.instagram.com/realpinxhouse', type: 'normal' },
  { id: 5, name: 'Subscribe to our YouTube channel', reward: 500, link: 'https://youtube.com/pink', type: 'normal' },
  { id: 6, name: 'Invite a friend', reward: 50, requirement: 1, progress: 0, type: 'referral' },
  { id: 7, name: 'Invite 3 friends', reward: 150, requirement: 3, progress: 0, type: 'referral' },
  { id: 8, name: 'Invite 10 friends', reward: 500, requirement: 10, progress: 0, type: 'referral' },
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

  const handleClaim = async (task) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, action: 'completeTask', taskId: task.id }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result.message); // Show reward in UI
        setCoins(coins + task.reward);
        setTasks(tasks.filter(t => t.id !== task.id));
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Failed to claim task reward:', error);
    }
  };

  const incrementReferralProgress = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId && task.type === 'referral' ? { ...task, progress: task.progress + 1 } : task
    ));
  };

  // Claiming daily login reward
  const claimDailyReward = async () => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, action: 'claim' }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result.message); // Show reward in UI
        setCoins(coins + dailyReward);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Failed to claim daily reward:', error);
    }
  };

  // Completing a task
  const completeTask = async (taskId) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, action: 'completeTask', taskId }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result.message); // Mark task as done in UI
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
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
          handleClaim={claimDailyReward}
        />
        <TaskList tasks={tasks} handleGo={handleGo} handleClaim={handleClaim} />
      </div>
      <Footer currentPage="tasks" />
    </div>
  );
};

export default Tasks;
