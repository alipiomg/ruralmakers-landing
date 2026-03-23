import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/goteo': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/higgsfield': {
        target: 'https://platform.higgsfield.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/higgsfield/, ''),
        headers: {
          'Origin': 'https://platform.higgsfield.ai',
        },
      }
    }
  }
})
