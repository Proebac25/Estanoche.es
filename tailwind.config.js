const coreUI = require('./src/styles/core/core-ui-v11.tailwind.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'mo': {
          sage: coreUI.colors['mo-sage'],
          olive: coreUI.colors['mo-olive'],
          coral: coreUI.colors['mo-coral'],
          spot: coreUI.colors['mo-spot'],
          amber: coreUI.colors['mo-amber'],
          bg: coreUI.colors['mo-bg'],
          surface: coreUI.colors['mo-surface'],
          muted: coreUI.colors['mo-muted'],
          text: coreUI.colors['mo-text'],
        },
        'en': {
          'blue-light': '#3C3C8A',
          pink: '#F72585',
        }
      },
      borderRadius: {
        'mo': '14px',
        'mo-lg': '20px',
      },
      spacing: {
        'mo-4': '16px',
        'mo-2': '8px',
      },
      boxShadow: {
        'mo-soft': '0 6px 18px rgba(30, 40, 40, 0.08)',
      },
      fontFamily: {
        'display': ['Roboto', 'serif'],
        'ui': ['Inter', 'sans-serif'],
        'cta': ['Montserrat', 'sans-serif'],
      },
      height: {
        'btn': '44px',
      },
      minWidth: {
        'btn': '220px',
      },
      backgroundImage: {
        'gradient-mo-primary': 'linear-gradient(90deg, #4B744D, #7A9A7E)',
        'gradient-mo-vip': 'linear-gradient(90deg, #F72585, #FFB703)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}