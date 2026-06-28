/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Primary (Deep Medical Teal/Emerald)
        primary: '#0F766E',
        primaryDark: '#115E59',
        primarySoft: '#CCFBF1',

        // Semantic Colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Surfaces & Backgrounds
        bg: '#F8FAFC',
        surface: '#FFFFFF',
        card: '#FFFFFF',

        // Borders
        border: '#E2E8F0',
        borderFocus: '#99F6E4',

        // Text & Typography
        text: '#0F172A',
        muted: '#64748B',
        mutedLight: '#94A3B8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        premium: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        soft: '0 2px 10px rgba(15, 23, 42, 0.02)',
      },
      borderRadius: {
        saas: '12px',
        premium: '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
