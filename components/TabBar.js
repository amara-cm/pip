import Link from 'next/link';

const TabBar = () => (
    <div className="tab-bar">
        <Link href="/tasks">
            <div className="tab-btn tab-rewards">
                <div className="icon"></div>
                <div className="text">Tasks</div>
            </div>
        </Link>
        <Link href="/">
            <div className="tab-btn tab-site">
                <div className="icon"></div>
                <div className="text">Home</div>
            </div>
        </Link>
        <Link href="/friends">
            <div className="tab-btn tab-friends">
                <div className="icon"></div>
                <div className="text">Friends</div>
            </div>
        </Link>
    </div>
);

export default TabBar;
