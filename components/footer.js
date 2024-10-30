// components/Footer.js
import { useRouter } from 'next/router';

const Footer = ({ currentPage }) => {
  const router = useRouter();

  const isHome = currentPage === 'home';
  const isTasks = currentPage === 'tasks';
  const isFriends = currentPage === 'friends';

  return (
    <footer className="flex justify-around p-4 bg-black fixed bottom-0 w-full max-w-[30rem] gap-[0.4375rem]">
      <button 
        onClick={() => !isTasks && router.push('/tasks')}
        className={`flex justify-center items-center ${isTasks ? 'cursor-not-allowed' : ''}`}>
        <div style={{ pointerEvents: 'none' }}>
          <img src={isTasks ? '/icons/arewards.svg' : '/icons/brewards.svg'} alt="Rewards" className="mx-auto my-0" />
        </div>
      </button>

      <button 
        onClick={() => !isHome && router.push('/')}
        className={`flex justify-center items-center ${isHome ? 'cursor-not-allowed' : ''}`}>
        <div style={{ pointerEvents: 'none' }}>
          <img src={isHome ? '/icons/asite.svg' : '/icons/bsite.svg'} alt="Home" className="mx-auto my-0" />
        </div>
      </button>

      <button 
        onClick={() => !isFriends && router.push('/friends')}
        className={`flex justify-center items-center ${isFriends ? 'cursor-not-allowed' : ''}`}>
        <div style={{ pointerEvents: 'none' }}>
          <img src={isFriends ? '/icons/afriends.svg' : '/icons/bfriends.svg'} alt="Friends" className="mx-auto my-0" />
        </div>
      </button>
    </footer>
  );
};

export default Footer;
