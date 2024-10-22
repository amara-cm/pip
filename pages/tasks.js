import { useState, useEffect } from 'react';
import styles from '../styles/Tasks.module.css';

const tasksList = [
  // Task list as before
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
    <div className={styles['tasks-scr']}>
      <div className={styles['login-fr']}>
        <div className={styles['login-text']}>Daily Login</div>
        <div className={styles.days}>
          {[...Array(7)].map((_, index) => (
            <div key={index} className={styles.day}>{index + 1}</div>
          ))}
        </div>
        {loginTimer <= 0 ? (
          <button className={styles['claim-btn']} onClick={handleClaim}>Claim</button>
        ) : (
          <div>{new Date(loginTimer * 1000).toISOString().substr(11, 8)}</div>
        )}
      </div>
      <div className={styles['tasks-list']}>
        {tasks.map(task => (
          <div key={task.id} className={styles.task}>
            <span className={styles.text}>{task.name}</span>
            <button className={styles['go-btn']} onClick={() => handleGo(task)}>Go</button>
          </div>
        ))}
      </div>
      <div className={styles['tab-bar']}>
        <button className={`${styles['tab-btn']} ${styles['tab-rewards']} active`} onClick={() => window.location.href = '/tasks'}>Rewards</button>
        <button className={styles['tab-btn']} onClick={() => window.location.href = '/home'}>Site</button>
        <button className={styles['tab-btn']} onClick={() => window.location.href = '/friends'}>Friends</button>
      </div>
    </div>
  );
};

export default Tasks;
