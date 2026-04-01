export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8f5f0',
          100: '#d1fae5',
          500: '#1D9E75',
          600: '#0F6E56',
          700: '#085041',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}