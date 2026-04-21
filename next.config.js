/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const isDev = process.env.NODE_ENV !== "production";

// 'unsafe-eval' is only needed in development (webpack HMR).
// 'unsafe-inline' is kept in both envs because Next.js injects inline hydration
// scripts; full removal requires nonce-based middleware — adopt before a security audit.
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com"
  : "script-src 'self' 'unsafe-inline' https://apis.google.com";

// Include the Firebase auth domain so popup/redirect auth flows are not blocked.
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`
  : "";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://lh3.googleusercontent.com https://firebasestorage.googleapis.com https://*.tile.openstreetmap.org",
      [
        "connect-src 'self'",
        "https://*.googleapis.com",
        "https://*.firebaseio.com",
        "https://identitytoolkit.googleapis.com",
        "https://securetoken.googleapis.com",
        "https://overpass-api.de",
        "https://overpass.kumi.systems",
        "https://maps.mail.ru",
        "wss://*.firebaseio.com",
        authDomain,
      ]
        .filter(Boolean)
        .join(" "),
      [
        "frame-src 'self'",
        "https://accounts.google.com",
        authDomain,
      ]
        .filter(Boolean)
        .join(" "),
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const baseConfig = {
  reactStrictMode: true,
  transpilePackages: ["gsap"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

const nextConfig =
  process.env.NODE_ENV === "production" ? withPWA(baseConfig) : baseConfig;

module.exports = nextConfig;
