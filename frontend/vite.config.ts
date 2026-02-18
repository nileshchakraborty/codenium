import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  envDir: '..', // Load .env from root directory
  plugins: [react()],
  resolve: {
    alias: {
      '@system-design': path.resolve(__dirname, '../system-design/frontend/src'),
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
  server: {
    port: 3000,
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    server: {
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60
      }
    }
  }
})
