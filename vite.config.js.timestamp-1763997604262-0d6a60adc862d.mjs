// vite.config.js
import { defineConfig } from "file:///D:/dropbox/rec/node_modules/vite/dist/node/index.js";
import react from "file:///D:/dropbox/rec/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///D:/Dropbox/Rec/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
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
    port: 3e3,
    open: true,
    host: true
  },
  // NUEVO: Optimizar la precarga
  optimizeDeps: {
    include: [],
    // Evita precarga autom�tica
    exclude: ["src/pages/registro/AltaUsuario.jsx"]
    // Excluye archivos problem�ticos
  },
  // Build optimizado para Vercel
  build: {
    assetsInlineLimit: 0,
    emptyOutDir: true,
    sourcemap: false,
    target: "es2022",
    // NUEVO: Excluir del bundle
    rollupOptions: {
      external: []
      // Puedes a�adir archivos que no quieras en el bundle
    }
  },
  resolve: {
    preserveSymlinks: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxkcm9wYm94XFxcXHJlY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcZHJvcGJveFxcXFxyZWNcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2Ryb3Bib3gvcmVjL3ZpdGUuY29uZmlnLmpzXCI7Ly8gdml0ZS5jb25maWcuanNcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnfSddXG4gICAgICB9LFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogXCJlc3Rhbm9jaGUuZXNcIixcbiAgICAgICAgc2hvcnRfbmFtZTogXCJlc3Rhbm9jaGVcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiRGVzY3VicmUgZWwgb2NpbyBkZSB0dSBjaXVkYWRcIixcbiAgICAgICAgc3RhcnRfdXJsOiBcIi9cIixcbiAgICAgICAgZGlzcGxheTogXCJzdGFuZGFsb25lXCIsXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6IFwiIzEyMTIxMlwiLFxuICAgICAgICB0aGVtZV9jb2xvcjogXCIjRjcyNTg1XCIsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIi9pY29uLTE5Mi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgICBwdXJwb3NlOiBcIm1hc2thYmxlIGFueVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiL2ljb24tNTEyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICAgIHB1cnBvc2U6IFwibWFza2FibGUgYW55XCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KVxuICBdLFxuXG4gIC8vIFNlcnZpZG9yIGxvY2FsXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgb3BlbjogdHJ1ZSxcbiAgICBob3N0OiB0cnVlLFxuICB9LFxuXG4gIC8vIE5VRVZPOiBPcHRpbWl6YXIgbGEgcHJlY2FyZ2FcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW10sIC8vIEV2aXRhIHByZWNhcmdhIGF1dG9tXHVGRkZEdGljYVxuICAgIGV4Y2x1ZGU6IFsnc3JjL3BhZ2VzL3JlZ2lzdHJvL0FsdGFVc3VhcmlvLmpzeCddIC8vIEV4Y2x1eWUgYXJjaGl2b3MgcHJvYmxlbVx1RkZGRHRpY29zXG4gIH0sXG5cbiAgLy8gQnVpbGQgb3B0aW1pemFkbyBwYXJhIFZlcmNlbFxuICBidWlsZDoge1xuICAgIGFzc2V0c0lubGluZUxpbWl0OiAwLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgdGFyZ2V0OiAnZXMyMDIyJyxcbiAgICAvLyBOVUVWTzogRXhjbHVpciBkZWwgYnVuZGxlXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFtdIC8vIFB1ZWRlcyBhXHVGRkZEYWRpciBhcmNoaXZvcyBxdWUgbm8gcXVpZXJhcyBlbiBlbCBidW5kbGVcbiAgICB9XG4gIH0sXG5cbiAgcmVzb2x2ZToge1xuICAgIHByZXNlcnZlU3ltbGlua3M6IHRydWUsXG4gIH0sXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBR3hCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLFNBQVM7QUFBQSxRQUNQLGNBQWMsQ0FBQyxnQ0FBZ0M7QUFBQSxNQUNqRDtBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsV0FBVztBQUFBLFFBQ1gsU0FBUztBQUFBLFFBQ1Qsa0JBQWtCO0FBQUEsUUFDbEIsYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNYO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLFVBQ1g7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUFBLEVBR0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQTtBQUFBLEVBR0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDO0FBQUE7QUFBQSxJQUNWLFNBQVMsQ0FBQyxvQ0FBb0M7QUFBQTtBQUFBLEVBQ2hEO0FBQUE7QUFBQSxFQUdBLE9BQU87QUFBQSxJQUNMLG1CQUFtQjtBQUFBLElBQ25CLGFBQWE7QUFBQSxJQUNiLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQTtBQUFBLElBRVIsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDO0FBQUE7QUFBQSxJQUNiO0FBQUEsRUFDRjtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1Asa0JBQWtCO0FBQUEsRUFDcEI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
