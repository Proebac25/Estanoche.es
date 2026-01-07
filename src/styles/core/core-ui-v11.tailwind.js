// core-ui-v11.tailwind.js
// Importación en tailwind.config.js:
// const coreUI = require('./src/styles/core/core-ui-v11.tailwind.js');

module.exports = {
  colors: {
    'mo-sage': '#7A9A7E',
    'mo-olive': '#4B744D',
    'mo-coral': '#FF6B6B',
    'mo-spot': '#F72585',
    'mo-amber': '#FFB703',
    'mo-bg': '#F4F1EE',
    'mo-surface': '#FFFFFF',
    'mo-muted': '#9AA19A',
    'mo-text': '#1E2933'
  },

  borderRadius: {
    'lg': '14px',
    'xl': '20px'
  },

  spacing: {
    'space-4': '16px',
    'space-2': '8px'
  },

  boxShadow: {
    'soft': '0 6px 18px rgba(30,40,40,0.08)'
  },

  fontFamily: {
    display: ['Roboto', 'serif'],
    ui: ['Inter', 'sans-serif'],
    cta: ['Montserrat', 'sans-serif']
  }
};
