import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuration for the standalone dashboard app
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist-dashboard',
    rollupOptions: {
      input: 'dashboard.html',
    },
  },
  server: {
    port: 3001,
    open: '/dashboard.html',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@demo': path.resolve(__dirname, './src/demo'),
    },
  },
  define: {
    'process.env': {},
  },
});