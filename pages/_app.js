import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/global.css';
import Loading from '../components/loading';

function MyApp({ Component, pageProps }) {
    const [isLoading, setIsLoading] = useState(true);
    const [earnedCoins, setEarnedCoins] = useState(0);
    const [mineCountdown, setMineCountdown] = useState(0);
    const [dailyClaimTimer, setDailyClaimTimer] = useState(0);
    const [gameInteractions, setGameInteractions] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    // State to store userId and token
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    const getUserId = async () => {
        try {
            const response = await axios.get('/api/telegram', {
                params: { id: 'user_id' } // Replace 'user_id' with the logic to get the actual user ID
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

    const handleUserAction = async () => {
        try {
            const { refreshToken } = await import('../lib/paseto');
            const newToken = await refreshToken(userId, token);
            setToken(newToken);
        } catch (error) {
            console.error('Error refreshing token:', error);
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
                try {
                    const { generateToken } = await import('../lib/paseto');
                    const newToken = await generateToken(id);
                    setToken(newToken);
                } catch (error) {
                    console.error('Error generating token:', error);
                }
            }
        };

        fetchUserIdAndData();

        const savedMineCountdown = localStorage.getItem('mineCountdown');
        const savedDailyClaimTimer = localStorage.getItem('dailyClaimTimer');
        const savedInteractions = localStorage.getItem('gameInteractions');
        const savedCompletedTasks = localStorage.getItem('completedTasks');

        if (savedMineCountdown) setMineCountdown(Number(savedMineCountdown));
        if (savedDailyClaimTimer) setDailyClaimTimer(Number(savedDailyClaimTimer));
        if (savedInteractions) setGameInteractions(JSON.parse(savedInteractions));
        if (savedCompletedTasks) setCompletedTasks(JSON.parse(savedCompletedTasks));

        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            saveUserData();
        }
    }, [earnedCoins, mineCountdown, dailyClaimTimer, gameInteractions, completedTasks]);

    useEffect(() => {
        const intervalId = setInterval(handleUserAction, 1800000); // Refresh token every 30 minutes

        const activityListener = () => {
            clearInterval(intervalId);
            setInterval(handleUserAction, 1800000);
        };

        window.addEventListener('click', activityListener);
        window.addEventListener('keypress', activityListener);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('click', activityListener);
            window.removeEventListener('keypress', activityListener);
        };
    }, [token]);

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
