import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        oracle: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
        },
        // Accessible Dark Spatial UI Colors (deep navy/slate)
        surface: {
          base: '#0f172a',
          elevated1: '#1e2a3a',
          elevated2: '#1e293b',
          elevated3: '#263348',
          elevated4: '#2e3d55',
        },
        // Aurora Colors
        aurora: {
          blue: '#0ea5e9',
          purple: '#a855f7',
          cyan: '#06b6d4',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        glow: '0 0 20px rgba(14, 165, 233, 0.5)',
        'glow-md': '0 0 40px rgba(14, 165, 233, 0.3)',
        'glow-lg': '0 0 60px rgba(14, 165, 233, 0.2)',
        soft: '0 2px 8px rgba(0, 0, 0, 0.4)',
        'soft-md': '0 4px 16px rgba(0, 0, 0, 0.5)',
        'soft-lg': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'soft-xl': '0 12px 48px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'slide-in': 'slide-in 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'aurora': 'aurora-rotate 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'aurora-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'aurora-blue': 'radial-gradient(circle at 30% 50%, rgba(14, 165, 233, 0.15) 0%, transparent 50%)',
        'aurora-purple': 'radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
        'aurora-cyan': 'radial-gradient(circle at 50% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config
