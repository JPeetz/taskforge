import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0a0e1a",
          50: "#e8e9ee",
          100: "#c5c7d3",
          200: "#9ea2b5",
          300: "#777d97",
          400: "#5a6181",
          500: "#3e466b",
          600: "#31395c",
          700: "#232a49",
          800: "#171d36",
          900: "#0a0e1a",
          950: "#050812",
        },
        accent: {
          purple: "#8B5CF6",
          "purple-light": "#A78BFA",
          "purple-dark": "#7C3AED",
        },
        neon: {
          cyan: "#06B6D4",
          "cyan-light": "#22D3EE",
          "cyan-dark": "#0891B2",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse at top, rgba(139,92,246,0.15) 0%, transparent 60%)",
        "section-gradient":
          "linear-gradient(180deg, rgba(10,14,26,1) 0%, rgba(23,29,54,1) 100%)",
        "glow-purple":
          "radial-gradient(circle at center, rgba(139,92,246,0.3) 0%, transparent 70%)",
        "glow-cyan":
          "radial-gradient(circle at center, rgba(6,182,212,0.2) 0%, transparent 70%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(139,92,246,0.15)",
        "glow-lg":
          "0 0 60px rgba(139,92,246,0.2), 0 0 30px rgba(6,182,212,0.1)",
        "glow-cyan": "0 0 30px rgba(6,182,212,0.15)",
        card: "0 0 0 1px rgba(139,92,246,0.08), 0 4px 24px rgba(0,0,0,0.3)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
