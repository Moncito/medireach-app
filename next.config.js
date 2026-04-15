/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const baseConfig = {
  reactStrictMode: true,
  transpilePackages: ["gsap"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
};

const nextConfig =
  process.env.NODE_ENV === "production" ? withPWA(baseConfig) : baseConfig;

module.exports = nextConfig;
