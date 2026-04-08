/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'IBM Plex Mono'", "monospace"],
        sans: ["'IBM Plex Sans'", "sans-serif"],
      },
      colors: {
        ink: "#0a0a0f",
        surface: "#111118",
        card: "#18181f",
        border: "#2a2a35",
        muted: "#3a3a48",
        dim: "#7a7a90",
        ghost: "#a0a0b8",
        bright: "#e8e8f0",
        accent: "#7c6af7",
        "accent-dim": "#4a3fb5",
        "accent-glow": "#9b8cff",
        green: "#3dd68c",
        amber: "#f5a623",
        red: "#f56565",
        cyan: "#38bdf8",
      },
      boxShadow: {
        glow: "0 0 20px rgba(124,106,247,0.15)",
        "glow-lg": "0 0 40px rgba(124,106,247,0.2)",
      },
    },
  },
  plugins: [],
};
