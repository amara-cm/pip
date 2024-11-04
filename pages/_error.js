import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Error = ({ statusCode }) => {
  const router = useRouter();

  useEffect(() => {
    // You can log the error or notify someone here if needed
    console.error(`Error occurred: ${statusCode}`);
  }, [statusCode]);

  const handleRefresh = () => {
    // Instead of just reloading, we could do a safer navigation
    router.push('/'); // Redirect to the home page or any safe fallback
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

// This function will be called on the server-side
Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
