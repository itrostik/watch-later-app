/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4444",
        pathname: "/*/**",
      },
      {
        protocol: "https",
        hostname: "watch-later-backend.onrender.com",
        pathname: "/*/**",
      },
    ],
  },
};
