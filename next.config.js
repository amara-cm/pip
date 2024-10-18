import webpack from 'webpack';
import { createRequire } from 'module';
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
        config: [__filename],
      },
      cacheUnaffected: true, // Cache unaffected modules to improve performance
      compression: false,    // Disable compression for easier serialization
    };

    return config;
  },
};

export default nextConfig;
