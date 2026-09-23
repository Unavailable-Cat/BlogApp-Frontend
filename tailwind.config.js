/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          50: '#f8f7f5',
          100: '#f0eeea',
          200: '#e4e0d8',
          300: '#c9c2b4',
          400: '#a89e8a',
          500: '#8a7f6b',
          600: '#6e6453',
          700: '#564e40',
          800: '#3d372d',
          900: '#26221c',
          950: '#161310',
        },
        accent: {
          50: '#fef7ee',
          100: '#fdedd4',
          200: '#fbd6a8',
          300: '#f8b871',
          400: '#f59138',
          500: '#f2740f',
          600: '#e35c06',
          700: '#bd4508',
          800: '#96380e',
          900: '#79300f',
          950: '#421705',
        },
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
};
