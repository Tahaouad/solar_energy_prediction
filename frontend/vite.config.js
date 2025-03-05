import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(
    {
      jsxImportSource: '@emotion/react', // Ajoutez cette ligne pour activer Emotion
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    },
  )],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});