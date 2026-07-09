import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        subtle: "rgb(var(--subtle) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
          soft: "rgb(var(--primary-soft) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--success) / <alpha-value>)",
          soft: "rgb(var(--success-soft) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--danger) / <alpha-value>)",
          soft: "rgb(var(--danger-soft) / <alpha-value>)",
        },
        orange: {
          DEFAULT: "rgb(var(--orange) / <alpha-value>)",
          soft: "rgb(var(--orange-soft) / <alpha-value>)",
        },
        purple: {
          DEFAULT: "rgb(var(--purple) / <alpha-value>)",
          soft: "rgb(var(--purple-soft) / <alpha-value>)",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.03), 0 8px 24px rgba(15,23,42,0.04)",
        "card-hover": "0 2px 6px rgba(15,23,42,0.05), 0 18px 44px rgba(15,23,42,0.08)",
        nav: "0 4px 24px rgba(15,23,42,0.08)",
        ring: "0 10px 26px rgba(0,67,216,0.22)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
