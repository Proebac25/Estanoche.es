// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Esto escanea todos los archivos JS, JSX, TS, TSX dentro de la carpeta 'src'
    "./src/**/*.{js,jsx,ts,tsx}",
    // Si tienes otros archivos fuera de src, agrégalos aquí. Por ejemplo:
    // "./index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}