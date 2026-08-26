import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        crimson: {
          50: "#fff1f2",
          100: "#ffe4e6",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          900: "#881337",
        },
        cyan: {
          50: "#ecfeff",
          100: "#cffafe",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        slate: {
          850: "#131b2e",
          950: "#080c16",
        }
      },
      animation: {
        "marquee": "marquee 34s linear infinite",
        "marquee-slow": "marquee 45s linear infinite",
        "pulse-warning": "pulseWarning 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseWarning: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      boxShadow: {
        "command": "0 10px 30px -10px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
        "command-hover": "0 20px 40px -15px rgba(225, 29, 72, 0.12), 0 0 0 1px rgba(225, 29, 72, 0.15)",
        "cyan-glow": "0 0 25px -5px rgba(6, 182, 212, 0.25)",
        "crimson-glow": "0 0 25px -5px rgba(225, 29, 72, 0.3)",
      }
    },
  },
  plugins: [],
};
export default config;
