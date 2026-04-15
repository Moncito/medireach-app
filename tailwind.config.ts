import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF9F6",
        surface: "#F2F0ED",
        border: "#E8E5E0",
        foreground: "#1A1A1A",
        muted: "#4A4A4A",
        accent: {
          coral: "#FF8A5C",
          mint: "#5CEAA0",
          lavender: "#B8A9FA",
        },
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 16px rgba(0,0,0,0.04)",
        card: "0 4px 24px rgba(0,0,0,0.06)",
        elevated: "0 8px 32px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
