/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        primaryDark: "#1D4ED8",
        primarySoft: "#EAF2FF",

        teal: "#14B8A6",
        tealDark: "#0F766E",
        tealSoft: "#E6FFFB",

        bg: "#F8FAFC",
        card: "#FFFFFF",
        border: "#E2E8F0",

        text: "#0F172A",
        muted: "#64748B",

        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'saas': '12px',
      }
    },
  },
  plugins: [],
}
