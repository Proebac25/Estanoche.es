// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Servidor local
  server: {
    port: 3000,
    open: true,
    host: true, // Permite acceso desde red local si lo necesitas
  },

  // Build optimizado para Vercel (y cualquier hosting estático)
  build: {
    // ¡ELIMINADO rollupOptions.input! → Vercel lo detecta automáticamente
    assetsInlineLimit: 0,     // No inliniza assets (mejor control)
    emptyOutDir: true,        // Limpia /dist antes de cada build
    sourcemap: false,         // En producción no hace falta (cambia a true si debug)
    target: 'es2022',         // Máxima compatibilidad moderna
  },

  // Opcional: forzar case-sensitive en Windows/Linux (buena práctica)
  resolve: {
    preserveSymlinks: true,
  },
})