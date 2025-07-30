/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'hover:scale-105',
    'hover:opacity-90',
    'transition',
    'duration-300',
    'text-white',
    'rounded-2xl',
    'shadow-xl',
    'font-semibold',
    'bg-[#1C3058]',
    'bg-[#8444dd]',
    'bg-[#a52c1e]',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
