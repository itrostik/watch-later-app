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
        protocol: "http",
        hostname: "watch-later.tw1.ru",
        port: "4444",
        pathname: "/*/**",
      },
    ],
  },
};
