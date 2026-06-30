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
        // Core Primary (Deep Medical Emerald & Gold Accents)
        primary: '#065F46', // Emerald 800
        primaryDark: '#022C22', // Emerald 950
        primarySoft: '#D1FAE5', // Emerald 100
        accent: '#D97706', // Amber 600
        accentSoft: '#FEF3C7', // Amber 100

        // Semantic Colors
        success: '#059669',
        warning: '#F59E0B',
        error: '#DC2626',
        info: '#2563EB',

        // Surfaces & Backgrounds
        bg: '#F8FAFC',
        surface: 'rgba(255, 255, 255, 0.7)',
        card: 'rgba(255, 255, 255, 0.85)',
        
        // Borders
        border: 'rgba(226, 232, 240, 0.8)',
        borderFocus: '#34D399',

        // Text & Typography
        text: '#0F172A',
        muted: '#475569',
        mutedLight: '#94A3B8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, #F8FAFC 0%, #E0F2FE 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
        'primary-gradient': 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        premium: '0 10px 40px -10px rgba(15, 23, 42, 0.12)',
        soft: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        glow: '0 0 20px rgba(6, 95, 70, 0.4)',
      },
      borderRadius: {
        saas: '16px',
        premium: '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
