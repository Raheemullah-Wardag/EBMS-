/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3f1',
          100: '#e6ded7',
          200: '#cfbea8',
          300: '#b49976',
          400: '#9d7b4d',
          500: '#8c673e',
          600: '#755132',
          700: '#5e3e29',
          800: '#4e3424',
          900: '#402a1f',
          950: '#23160f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
