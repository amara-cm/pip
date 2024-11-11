import { useEffect, useState } from 'react';
import '../styles/global.css';
import Loading from '../components/loading';

function MyApp({ Component, pageProps }) {
    const [isLoading, setIsLoading] = useState(true);
    const [earnedCoins, setEarnedCoins] = useState(0);
    const [mineCountdown, setMineCountdown] = useState(0);
    const [dailyClaimTimer, setDailyClaimTimer] = useState(0);
    const [gameInteractions, setGameInteractions] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]); // New state for completed tasks

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        // Load saved state from localStorage
        const savedMineCountdown = localStorage.getItem('mineCountdown');
        const savedDailyClaimTimer = localStorage.getItem('dailyClaimTimer');
        const savedInteractions = localStorage.getItem('gameInteractions');
        const savedCompletedTasks = localStorage.getItem('completedTasks'); // Retrieve completed tasks

        if (savedMineCountdown) {
            setMineCountdown(Number(savedMineCountdown));
        }
        if (savedDailyClaimTimer) {
            setDailyClaimTimer(Number(savedDailyClaimTimer));
        }
        if (savedInteractions) {
            setGameInteractions(JSON.parse(savedInteractions));
        }
        if (savedCompletedTasks) { // Initialize completed tasks from localStorage
            setCompletedTasks(JSON.parse(savedCompletedTasks));
        }

        return () => clearTimeout(timeoutId);
    }, []);

    // Function to update completed tasks
    const completeTask = (taskId) => {
        setCompletedTasks((prev) => {
            const newCompletedTasks = [...prev, taskId];
            localStorage.setItem('completedTasks', JSON.stringify(newCompletedTasks));
            return newCompletedTasks;
        });
    };

    return (
        <>
            {isLoading ? <Loading /> : <Component {...pageProps} 
                completedTasks={completedTasks} 
                completeTask={completeTask} 
                // pass down any other props you need
            />}
        </>
    );
}

export default MyApp;
