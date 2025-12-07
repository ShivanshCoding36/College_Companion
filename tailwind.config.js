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
        // Light Mode
        light: {
          bg: "#F7F8FA",
          surface: "#FFFFFF",
          primary: "#3B82F6",
          primaryHover: "#2563EB",
          accent: "#10B981",
          textPrimary: "#111827",
          textSecondary: "#4B5563",
          border: "#E5E7EB",
        },
        // Dark Mode
        dark: {
          bg: "#0D1117",
          surface: "#161B22",
          primary: "#3B82F6",
          primaryHover: "#60A5FA",
          accent: "#10B981",
          textPrimary: "#F9FAFB",
          textSecondary: "#9CA3AF",
          border: "#2D333B",
        },
        // Legacy colors (keep for backward compatibility)
        bgDark1: "#0D1117",
        bgDark2: "#161B22",
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
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
