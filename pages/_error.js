import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Error = ({ statusCode }) => {
  const router = useRouter();

  useEffect(() => {
    // Log or notify of the error if needed
    if (statusCode) {
      console.error(`Error occurred: ${statusCode}`);
    }
  }, [statusCode]);

  const handleRefresh = () => {
    router.push('/'); // Redirect to home or fallback page
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-black text-white font-outfit font-semibold">
      <div className="text-20 mb-4">An error occurred. Please try again.</div>
      <button onClick={handleRefresh} className="flex justify-center items-center">
        <img 
          src="/icons/refresh.svg" 
          alt="Refresh" 
          style={{ pointerEvents: 'none' }} 
        />
      </button>
    </div>
  );
};

// This function will only be called when there's a real error
Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;