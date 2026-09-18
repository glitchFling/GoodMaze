/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0d14',
          card: 'rgba(16, 22, 36, 0.88)',
          cyan: '#00f3ff',
          magenta: '#f43f5e',
          gold: '#fbbf24',
          emerald: '#10b981',
          purple: '#a855f7',
          blue: '#3b82f6',
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 243, 255, 0.4)',
        'neon-gold': '0 0 15px rgba(251, 191, 36, 0.4)',
        'neon-magenta': '0 0 15px rgba(244, 63, 94, 0.4)',
        'neon-emerald': '0 0 15px rgba(16, 185, 129, 0.4)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

