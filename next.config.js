const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // We're in the browser build, exclude node built-in modules
      config.resolve.fallback = {
        fs: false,
        https: false,
        http: false,
        net: false,
        buffer: false,
        stream: false,
        url: false,
        crypto: false, // Add any others if needed
        tls: false,
        child_process: false,
      };
    }

    return config;
  },
};

export default nextConfig;
