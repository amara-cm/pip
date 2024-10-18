import webpack from 'webpack';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);

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
      buffer: require.resolve('buffer'),
    };

    // Optional: Adjust Webpack caching to avoid cache serialization issues
   const nextConfig = {
  webpack: (config) => {
    // Your existing configuration
    config.resolve.fallback = {
      fs: false,
      https: false,
      http: false,
      net: false,
      buffer: require.resolve('buffer'),
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    // Update the cache configuration to use 'memory'
    config.cache = {
      type: 'memory',  // Change this line
    };

    return config;
  },
};

export default nextConfig;
