import { useEffect, useState } from 'react';
import '../styles/global.css';
import Loading from '../components/loading';

function MyApp({ Component, pageProps }) {
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
const timeoutId = setTimeout(() => {
setIsLoading(false);
}, 3000);

return () => clearTimeout(timeoutId);

}, []);

return (
<>
{isLoading ? <Loading /> : <Component {...pageProps} />}
</>
);
}

export default MyApp;
