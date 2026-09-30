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
    },
  },
  plugins: [],
} satisfies Config;
