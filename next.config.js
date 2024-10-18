import webpack from 'webpack';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Workaround for __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url); // Allows usage of require in ESM

const nextConfig = {
  webpack: (config) => {
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

    // Optional: Adjust Webpack caching to avoid cache serialization issues
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename], // Using the correct path for config
      },
      cacheUnaffected: true, // Cache unaffected modules to improve performance
      compression: false,    // Disable compression for easier serialization
    };

    return config;
  },
};

export default nextConfig;
