import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        serviceWorker: 'src/service-worker.ts'
      }
    }
  },
  plugins: [react()],
  server: {
    port: 4002,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://172.17.0.1:4001',
      }
    }
  }
});
