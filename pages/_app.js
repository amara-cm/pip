import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/global.css';
import Loading from '../components/loading';

let inactivityTimeout;

function resetInactivityTimeout() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    handleSessionExpiration();
  }, 30 * 60 * 1000); // 30 minutes
}

function handleSessionExpiration() {
  const token = localStorage.getItem('authToken');
  if (token) {
    refreshToken();
  } else {
    console.log('Session expired. Please login again.');
  }
}

function refreshToken() {
  axios.post('/api/refresh-token', { token: localStorage.getItem('authToken') })
    .then(response => {
      localStorage.setItem('authToken', response.data.newToken);
    })
    .catch(error => {
      console.error('Error refreshing token:', error);
    });
}

if (typeof document !== 'undefined') {
  document.addEventListener('mousemove', resetInactivityTimeout);
  document.addEventListener('keypress', resetInactivityTimeout);
  resetInactivityTimeout();
}

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [mineCountdown, setMineCountdown] = useState(0);
  const [dailyClaimTimer, setDailyClaimTimer] = useState(0);
  const [gameInteractions, setGameInteractions] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [userId, setUserId] = useState(null);

  const getUserId = async () => {
    try {
      const response = await axios.get('/api/telegram', {
        params: { id: 'user_id' }
      });
      return response.data.userId;
    } catch (error) {
      console.error('Error fetching user ID:', error);
      return null;
    }
  };

  const saveUserData = async () => {
    if (!userId) return;
    try {
      await axios.post('/api/telegram', {
        id: userId,
        action: 'save',
        earnedCoins,
        mineCountdown,
        dailyClaimTimer,
        gameInteractions,
        completedTasks
      });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const retrieveUserData = async () => {
    if (!userId) return;
    try {
      const response = await axios.post('/api/telegram', {
        id: userId,
        action: 'retrieve'
      });
      const data = response.data;
      setEarnedCoins(data.earnedCoins);
      setMineCountdown(data.mineCountdown);
      setDailyClaimTimer(data.dailyClaimTimer);
      setGameInteractions(data.gameInteractions);
      setCompletedTasks(data.completedTasks);
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    const fetchUserIdAndData = async () => {
      const id = await getUserId();
      setUserId(id);
      if (id) {
        await retrieveUserData();
      }
    };

    fetchUserIdAndData();

    const savedMineCountdown = localStorage.getItem('mineCountdown');
    const savedDailyClaimTimer = localStorage.getItem('dailyClaimTimer');
    const savedInteractions = localStorage.getItem('gameInteractions');
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    const authToken = localStorage.getItem('authToken');

    if (savedMineCountdown) setMineCountdown(Number(savedMineCountdown));
    if (savedDailyClaimTimer) setDailyClaimTimer(Number(savedDailyClaimTimer));
    if (savedInteractions) setGameInteractions(JSON.parse(savedInteractions));
    if (savedCompletedTasks) setCompletedTasks(JSON.parse(savedCompletedTasks));
    if (authToken) {
      refreshToken();
    }

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveUserData();
    }
  }, [earnedCoins, mineCountdown, dailyClaimTimer, gameInteractions, completedTasks]);

  return (
    <>
      {isLoading ? <Loading /> : <Component {...pageProps} 
        completedTasks={completedTasks}
        completeTask={(taskId) => {
          setCompletedTasks((prev) => {
            const newCompletedTasks = [...prev, taskId];
            localStorage.setItem('completedTasks', JSON.stringify(newCompletedTasks));
            return newCompletedTasks;
          });
        }} />}
    </>
  );
}

export default MyApp;
