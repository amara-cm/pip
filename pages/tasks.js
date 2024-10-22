import { useState, useEffect } from 'react';

const tasksList = [
    { id: 1, name: 'Subscribe to Pink channel', reward: 200, link: 'https://t.me/pinkchannel' },
    { id: 2, name: 'Join Pink Community', reward: 100, link: 'https://t.me/pinkcommunity' },
    { id: 3, name: 'Follow us on X', reward: 200, link: 'https://x.com/pink' },
    { id: 4, name: 'Follow us on Instagram', reward: 200, link: 'https://instagram.com/pink' },
    { id: 5, name: 'Subscribe to our YouTube channel', reward: 100, link: 'https://youtube.com/pink' },
    { id: 6, name: 'Invite a friend', reward: 50, link: 'https://t.me/pinkbot?start=invite' },
    { id: 7, name: 'Invite 3 friends', reward: 150, link: 'https://t.me/pinkbot?start=invite' },
    { id: 8, name: 'Invite 10 friends', reward: 500, link: 'https://t.me/pinkbot?start=invite' },
];

const Tasks = () => {
    const [tasks, setTasks] = useState(tasksList);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [failedTasks, setFailedTasks] = useState([]);
    const [userId, setUserId] = useState('lons'); // Replace with actual Telegram ID

    const handleGo = (task) => {
        window.open(task.link, '_blank');
        setTimeout(() => {
            // Simulate task completion
            completeTask(task.id);
        }, 60000); // 1 minute delay
    };

    const completeTask = async (taskId) => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId, telegramId: userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to complete task');
            }

            const { success } = await response.json();
            if (success) {
                setCompletedTasks([...completedTasks, taskId]);
                setTasks(tasks.filter(task => task.id !== taskId));
            } else {
                setFailedTasks([...failedTasks, taskId]);
            }
        } catch (error) {
            console.error('Error completing task:', error);
            setFailedTasks([...failedTasks, taskId]);
        }
    };

    return (
        <div className="tasks-scr">
            {tasks.map(task => (
                <div key={task.id} className="task">
                    <span className="text">{task.name}</span>
                    <button className="go-btn" onClick={() => handleGo(task)}>Go</button>
                </div>
            ))}
            {completedTasks.length > 0 && <div>Completed Tasks: {completedTasks.join(', ')}</div>}
            {failedTasks.length > 0 && <div>Failed Tasks: {failedTasks.join(', ')}</div>}
        </div>
    );
};

export default Tasks;
