import { useState, useEffect } from 'react';

const Loading = ({ setLoading }) => {
const [progress, setProgress] = useState(1);

useEffect(() => {
const assets = [
'/icons/arewards.svg',
'/icons/asite.svg',
'/icons/afriends.svg',
'/icons/brewards.svg',
'/icons/bsite.svg',
'/icons/bfriends.svg',
'/icons/completed.svg',
'/icons/copy-btn.svg',
'/icons/gamecoin.svg',
'/icons/mine-btn.svg',
'/icons/refresh.svg',
'/icons/sell-btn.svg',
'/icons/sendinv-btn.svg',
'/mainicon.gif',
'/icons/d1.svg',
'/icons/d2.svg',
'/icons/d3.svg',
'/icons/d4.svg',
'/icons/d5.svg',
'/icons/d6.svg',
'/icons/d7.svg',
];

const preloadAsset = (src) => {
  const img = new Image();
  img.src = src;
};

const preloadAllAssets = () => {
  assets.forEach(preloadAsset);
};

const incrementProgress = () => {
  let currentProgress = 1;
  const intervalTime = 30;
  const totalIncrements = 100;
  const interval = setInterval(() => {
    if (currentProgress <= 100) {
      setProgress((prev) => Math.min(prev + 1, 100));
      currentProgress++;
    } else {
      clearInterval(interval);
    }
  }, intervalTime);
};

preloadAllAssets();
incrementProgress();

setTimeout(() => {
  setLoading(false);
}, 3000);

}, []);

return (
<div className="flex flex-col items-center justify-center h-screen bg-black">
<p className="font-outfit font-semibold text-white mb-4">{progress}%</p>
</div>
);
};

export default Loading;
