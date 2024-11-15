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

    // State to store userId
    const [userId, setUserId] = useState(null);

    // Helper function to get the user ID from your application logic (e.g., from webhook.js or bot.js)
    const getUserId = async () => {
        try {
            const response = await axios.get('/api/telegram', {
                params: { id: 'actual_user_id' } // Replace 'actual_user_id' with the logic to get the actual user ID
            });
            return response.data.userId; // Assuming the response contains the userId
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

        // Fetch user ID and then retrieve user data
        const fetchUserIdAndData = async () => {
            const id = await getUserId();
            setUserId(id);
            if (id) {
                await retrieveUserData();
            }
        };

        fetchUserIdAndData();

        // Load saved state from localStorage
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
        // Save user data when state changes
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
