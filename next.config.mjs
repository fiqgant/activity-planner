const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        stream: false,
        crypto: false,
        path: false,
        os: false,
        zlib: false,
      }
    }
    return config
  },
}

export default nextConfig
