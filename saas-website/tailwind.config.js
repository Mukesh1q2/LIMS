/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        // Primary Brand (Trust & Tech)
        primary: {
          50: '#EFF6FF',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        // Neutral Scale (Cool Slate)
        neutral: {
          100: '#F1F5F9',
          200: '#E2E8F0',
          400: '#94A3B8',
          600: '#475569',
          900: '#0F172A',
        },
        // Semantic Colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        // Background System
        background: '#F1F5F9',
        surface: '#FFFFFF',
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.08)',
        hover: '0 12px 24px -6px rgba(15, 23, 42, 0.12)',
        floating: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '24': '6rem',
      },
      fontSize: {
        'display': ['64px', '72px'],
        'h1': ['48px', '56px'],
        'h2': ['24px', '32px'],
        'h3': ['18px', '28px'],
        'body-lg': ['18px', '28px'],
        'body': ['16px', '24px'],
        'small': ['14px', '20px'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}