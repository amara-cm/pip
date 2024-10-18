const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      https: false,
      http: false,
      net: false,
    };
    return config;
  },
};

export default nextConfig;
