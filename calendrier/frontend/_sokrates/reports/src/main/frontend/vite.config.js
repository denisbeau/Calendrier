import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Configure preview server to handle SPA routing
  preview: {
    port: 4173,
    strictPort: true,
  },
  // Ensure proper handling of client-side routing in development
  server: {
    port: 5173,
    strictPort: true,
  },
})
