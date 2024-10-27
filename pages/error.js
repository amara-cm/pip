const Error = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-black text-white font-outfit font-semibold">
      <div className="text-2xl mb-4">Try Again</div>
      <button onClick={handleRefresh} className="px-4 py-2 bg-red-500 rounded text-xl">
        Refresh
      </button>
    </div>
  );
};

export default Error;
