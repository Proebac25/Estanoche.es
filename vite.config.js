// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: "estanoche.es",
        short_name: "estanoche",
        description: "Descubre el ocio de tu ciudad",
        start_url: "/",
        display: "standalone",
        background_color: "#121212",
        theme_color: "#F72585",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any"
          }
        ]
      }
    })
  ],

  // Servidor local
  server: {
    port: 3000,
    open: true,
    host: true,
  },

  // NUEVO: Optimizar la precarga
  optimizeDeps: {
    include: [], // Evita precarga automática
    exclude: ['src/pages/registro/AltaUsuario.jsx'] // Excluye archivos problemáticos
  },

  // Build optimizado para Vercel
  build: {
    assetsInlineLimit: 0,
    emptyOutDir: true,
    sourcemap: false,
    target: 'es2022',
    // NUEVO: Excluir del bundle
    rollupOptions: {
      external: [] // Puedes añadir archivos que no quieras en el bundle
    }
  },

  resolve: {
    preserveSymlinks: true,
  },
})