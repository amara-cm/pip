import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        https: false,
        http: false,
        net: false,
        buffer: false, // Change this to false
        stream: false, // Add this
        url: false, // Add this
      };
    }

    config.cache = {
      type: 'memory',
    };

    return config;
  },
};

export default nextConfig;
