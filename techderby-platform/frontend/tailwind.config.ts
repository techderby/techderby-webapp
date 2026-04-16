import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0c4a6e',
        secondary: '#f97316',
        surface: '#f8fafc',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-out': { from: { opacity: '1' }, to: { opacity: '0' } },
        'zoom-in': { from: { opacity: '0', transform: 'scale(0.95) translateY(8px)' }, to: { opacity: '1', transform: 'scale(1) translateY(0)' } },
        'zoom-out': { from: { opacity: '1', transform: 'scale(1) translateY(0)' }, to: { opacity: '0', transform: 'scale(0.95) translateY(8px)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out both',
        'fade-out': 'fade-out 0.22s ease-in both',
        'zoom-in': 'zoom-in 0.22s ease-out both',
        'zoom-out': 'zoom-out 0.22s ease-in both',
      },
    },
  },
  plugins: [],
} satisfies Config;
