import webpack from 'webpack';

const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      https: false,
      http: false,
      net: false,
      buffer: require.resolve('buffer/'),
    };
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );
    return config;
  },
};

export default nextConfig;
