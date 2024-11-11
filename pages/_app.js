import { useEffect, useState } from 'react';
import '../styles/global.css';
import Loading from '../components/loading';

function MyApp({ Component, pageProps }) {
    const [isLoading, setIsLoading] = useState(true);
    const [earnedCoins, setEarnedCoins] = useState(0);
    const [mineCountdown, setMineCountdown] = useState(0);
    const [dailyClaimTimer, setDailyClaimTimer] = useState(0);
    const [gameInteractions, setGameInteractions] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    const userId = 'YOUR_USER_ID'; // Replace with actual user ID

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/userData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, action: 'retrieve' }),
            });

            if (response.ok) {
                const data = await response.json();
                setEarnedCoins(data.earnedCoins || 0);
                setMineCountdown(data.mineCountdown || 0);
                setDailyClaimTimer(data.dailyClaimTimer || 0);
                setGameInteractions(data.gameInteractions || []);
                setCompletedTasks(data.completedTasks || []);
            } else {
                console.error("Error fetching user data");
            }
            setIsLoading(false);
        };

        fetchData();
    }, [userId]);

    const saveData = async (updatedData) => {
        await fetch(`/api/userData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, action: 'save', ...updatedData }),
        });
    };

    const updateCompletedTasks = (taskId) => {
        setCompletedTasks((prev) => {
            const newCompletedTasks = [...prev, taskId];
            saveData({ completedTasks: newCompletedTasks });
            return newCompletedTasks;
        });
    };

    return (
        <>
            {isLoading ? <Loading /> : <Component {...pageProps} 
                completedTasks={completedTasks} 
                completeTask={updateCompletedTasks} />}
        </>
    );
}

export default MyApp;
