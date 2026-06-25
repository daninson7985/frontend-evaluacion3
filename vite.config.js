import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    fs: {
      allow: ['.']
    },
    cors: true,
    strictPort: false,
    middlewareMode: false,
    watch: {
      usePolling: true
    }
  },
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: true
  },
  base: '/'
})
