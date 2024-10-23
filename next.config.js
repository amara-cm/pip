import BuilderDevTools from "@builder.io/dev-tools/next";

const nextConfig = BuilderDevTools()({
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
        crypto: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
});

export default nextConfig;
