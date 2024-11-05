import { useState, useEffect } from 'react';

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="absolute w-[363px] h-[51px] left-0 top-[47px] bg-black rounded-[10px] z-50 flex items-center justify-start px-4">
      <span className="font-outfit font-semibold text-[20px] leading-[20px] tracking-[0.1px] text-white">
        {message}
      </span>
      <button 
        onClick={onClose} 
        className="ml-auto text-white underline"
      >
        Dismiss
      </button>
    </div>
  );
};

export default ErrorPopup;
