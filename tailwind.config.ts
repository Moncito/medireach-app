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
        background: "#FAFAF8",
        surface: "#F4F3F0",
        "surface-elevated": "#FFFFFF",
        border: "#E8E5E0",
        "border-subtle": "#F0EEEB",
        foreground: "#111111",
        muted: "#6B7280",
        "muted-light": "#9CA3AF",
        accent: {
          coral: "#FF6B35",
          "coral-light": "#FF9F7A",
          mint: "#10B981",
          "mint-light": "#6EE7B7",
          lavender: "#8B5CF6",
          "lavender-light": "#C4B5FD",
        },
        dark: {
          DEFAULT: "#0A0A0B",
          surface: "#141416",
          border: "#26262A",
          muted: "#A1A1AA",
        },
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "heading-lg": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "heading": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        soft: "0 2px 16px rgba(0,0,0,0.03)",
        card: "0 4px 24px rgba(0,0,0,0.05)",
        elevated: "0 8px 40px rgba(0,0,0,0.08)",
        glow: "0 0 60px rgba(255,107,53,0.15)",
        "glow-mint": "0 0 60px rgba(16,185,129,0.15)",
        "glow-lavender": "0 0 60px rgba(139,92,246,0.15)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 10s ease-in-out infinite",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh": "conic-gradient(from 0deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
