/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '!./src/**/node_modules/**',
    '!./node_modules/**'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
