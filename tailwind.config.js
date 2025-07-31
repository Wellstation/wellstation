/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  safelist: [
  'text-yellow-300',
  'bg-[#0D3B66]',
  'bg-[#7209B7]',
  'bg-[#D62828]',
  // 기존 스타일 유지
  'hover:scale-110',
  'hover:opacity-90',
  'rounded-full',
  'shadow-xl',
  'font-bold',
  'text-xl',
  'w-72',
  'h-16',
  'transition-transform',
  'duration-300',
  'my-6',
  'sm:my-8',
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
