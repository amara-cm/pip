import { useRouter } from 'next/router';

const Error = () => {
  const router = useRouter();

  const handleRefresh = () => {
    router.reload(); // Reload the current page
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-black text-white font-outfit font-semibold">
      <div className="text-20 mb-4">Try Again</div>
      <button 
        onClick={handleRefresh} 
        className="flex justify-center items-center"
      >
        <img 
          src="/icons/refresh.svg" 
          alt="Refresh" 
          style={{ pointerEvents: 'none' }} // Disable pointer events for the icon
        />
      </button>
    </div>
  );
};

export default Error;