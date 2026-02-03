/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '!./src/**/node_modules/**',
    '!./node_modules/**'
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#F7FBF9',
        'primary-text': '#0F1724',
        'accent-bio': '#27AE60',
        'accent-chem': '#6C5CE7',
        'accent-phys': '#2B6CB0',
        'accent-math': '#FF6B6B',
        'accent-social': '#F59E0B',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
        'float-delay': 'float-delay 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.7' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: '1' }
        },
        'float-delay': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.5' },
          '50%': { transform: 'translateY(-15px) rotate(-180deg)', opacity: '1' }
        }
      },
      screens: {
        'xs': '375px',
        'tablet': '768px',
        'desktop': '1200px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
  safelist: [
    'from-accent-bio',
    'to-accent-bio',
    'from-accent-chem', 
    'to-accent-chem',
    'from-accent-phys',
    'to-accent-phys',
    'from-accent-math',
    'to-accent-math',
    'from-accent-social',
    'to-accent-social',
  ]
};