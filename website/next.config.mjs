/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "http", hostname: "localhost", port: "4000" },
    ],
  },
  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
