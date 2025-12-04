/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark1: "#0A0F1F",
        bgDark2: "#0F172A",
        bgDark3: "#1A2238",
        neonPink: "#FF1E8A",
        neonPurple: "#8A2BE2",
        glow: "rgba(255, 30, 138, 0.4)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
