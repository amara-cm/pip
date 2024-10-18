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
      buffer: 'buffer',  // This is a string instead of using require
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    // Adjust Webpack caching to avoid cache serialization issues
    config.cache = {
      type: 'memory',  // Keep this as it is
    };

    return config;
  },
};

export default nextConfig;
