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
          darkest: '#05080E',
          card: '#0C1322',
          cardBorder: '#1E293B',
          surface: '#111A2E',
          gold: '#D4AF37',
          goldHover: '#E5C07B',
          amberGlow: '#F59E0B',
          cyanGlow: '#38BDF8',
          danger: '#EF4444',
          success: '#10B981'
        }
      },
      boxShadow: {
        'gold-glow': '0 0 20px -3px rgba(212, 175, 55, 0.25)',
        'amber-glow': '0 0 20px -3px rgba(245, 158, 11, 0.3)',
        'cyan-glow': '0 0 20px -3px rgba(56, 189, 248, 0.25)',
        'danger-glow': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
      }
    },
  },
  plugins: [],
}
