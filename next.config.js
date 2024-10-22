const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        https: false,
        http: false,
        net: false,
        buffer: false,
        stream: false,
        url: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
