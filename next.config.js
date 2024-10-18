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

    // Provide Buffer globally
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

    // You might want to add any specific loaders or plugins needed for your project here

    return config;
  },
};

export default nextConfig;
