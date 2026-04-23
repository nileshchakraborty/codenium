import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  envDir: '../../',
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared'),
       react: path.resolve(__dirname, '../../node_modules/react'),
       'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
       '@react-oauth/google': path.resolve(__dirname, '../../node_modules/@react-oauth/google'),
    },
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
})
