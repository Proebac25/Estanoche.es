import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: './index.html'
    },
    assetsInlineLimit: 0,  // No inlinizar nada
    emptyOutDir: true,
    copyPublicDir: true
  },
  server: {
    port: 3000,
    open: true
  }
})