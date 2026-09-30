import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF7F2",
        gold: "#C8A45D",
        charcoal: "#222222"
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      },
      borderRadius: {
        "4xl": "2rem"
      },
      boxShadow: {
        luxury: "0 20px 60px rgba(34, 34, 34, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
