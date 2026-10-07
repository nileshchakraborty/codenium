import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'node:url'

const frontendDir = path.dirname(fileURLToPath(import.meta.url))
const repositoryDir = path.resolve(frontendDir, '..')

// https://vite.dev/config/
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  envDir: '..', // Load .env from root directory
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@system-design': path.resolve(frontendDir, '../system-design/frontend/src'),
      '@': path.resolve(frontendDir, './src'),
      '@shared': path.resolve(frontendDir, '../shared'),
      'monaco-editor/esm/vs/editor/editor.api': path.resolve(
        repositoryDir,
        'node_modules/monaco-editor/esm/vs/editor/editor.api.js',
      ),
      'monaco-editor/esm/vs/editor/common/commands/shiftCommand': path.resolve(
        repositoryDir,
        'node_modules/monaco-editor/esm/vs/editor/common/commands/shiftCommand.js',
      ),
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
