import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://cors-anywhere.herokuapp.com/https://www.data.gov.cy/api/action/datastore/search.json',
        changeOrigin: true,
        secure: false,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [react()],
});
