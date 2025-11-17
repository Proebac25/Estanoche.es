import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'estanoche.es',
        short_name: 'estanoche',
        description: 'Tu agenda de ocio',
        theme_color: '#F72585',
        background_color: '#121212',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      // Forzar entrada correcta
      srcDir: '.',
      strategies: 'generateSW'
    })
  ],
  build: {
    rollupOptions: {
      input: './index.html'  // <-- FORZA index.html
    }
  }
})