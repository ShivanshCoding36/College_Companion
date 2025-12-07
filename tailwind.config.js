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
        // Neon Color Palette
        neonPurple: '#9d4edd',
        neonPink: '#ff5ecd',
        neonBlue: '#4cc9f0',
        neonGreen: '#7cfb5f',
        neonYellow: '#f5ff66',
        neonRed: '#ff2e63',
        
        // Dark Backgrounds
        bgDark: '#000000',
        bgDark2: '#0a0a0a',
        bgDark3: '#1a1a1a',
        
        // Glass surfaces
        glass: 'rgba(255, 255, 255, 0.05)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #9d4edd 0%, #4cc9f0 50%, #ff5ecd 100%)',
        'glow-gradient': 'linear-gradient(135deg, #4cc9f0 0%, #9d4edd 100%)',
        'neon-gradient': 'linear-gradient(90deg, #9d4edd, #ff5ecd, #4cc9f0)',
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(157, 78, 221, 0.6)',
        'neon-pink': '0 0 20px rgba(255, 94, 205, 0.6)',
        'neon-blue': '0 0 20px rgba(76, 201, 240, 0.6)',
        'neon-glow': '0 0 30px rgba(157, 78, 221, 0.4), 0 0 60px rgba(76, 201, 240, 0.2)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(157, 78, 221, 0.6), 0 0 40px rgba(76, 201, 240, 0.4)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(157, 78, 221, 0.8), 0 0 60px rgba(76, 201, 240, 0.6)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          'from': { textShadow: '0 0 10px rgba(157, 78, 221, 0.8), 0 0 20px rgba(76, 201, 240, 0.6)' },
          'to': { textShadow: '0 0 20px rgba(157, 78, 221, 1), 0 0 30px rgba(76, 201, 240, 0.8)' },
        },
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
      borderRadius: {
        'neon': '12px',
        'neon-lg': '16px',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backdropBlur: {
        'glass': '12px',
      },
    },
  },
  plugins: [],
}
