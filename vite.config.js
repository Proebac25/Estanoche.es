// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🔑 ESTA ES LA CLAVE PARA CORREGIR LA CARGA EN VERCEL
  base: './', 
  build: {
    rollupOptions: {
      input: './index.html'
    },
    assetsInlineLimit: 0,
    emptyOutDir: true,
    copyPublicDir: true
  },
  server: {
    port: 3000,
    open: true
  }
})