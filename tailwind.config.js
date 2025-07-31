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
    'shadow-lg',
    'font-bold',
    'font-semibold',
    'bg-[#1C3058]',
    'bg-[#844dd4]',
    'bg-[#fa52c1]',
  ],
  theme: {
    extend: {
      spacing: {
        '999': '999px', // 캐시 무력화용 의미 없는 값
      },
    },
  },
  plugins: [],
}
