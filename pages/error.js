const Error = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="error-scr">
      <div className="text">An error occurred. Try again.</div>
      <button className="refresh-btn" onClick={handleRefresh}>Refresh</button>
    </div>
  );
};

export default Error;
