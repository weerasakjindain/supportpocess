/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Noto Sans Thai', 'ui-sans-serif', 'system-ui'] },
      colors: { brand: { 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' } },
    },
  },
  plugins: [],
}