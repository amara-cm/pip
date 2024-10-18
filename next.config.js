import webpack from 'webpack';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Workaround for __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      https: false,
      http: false,
      net: false,
      buffer: 'buffer',  // Directly use 'buffer'
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    // Adjust Webpack caching to avoid cache serialization issues
    config.cache = {
      type: 'memory',  // Updated to use 'memory' as per the error message
    };

    return config;
  },
};

export default nextConfig;
