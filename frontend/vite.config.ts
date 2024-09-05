import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4002,
    host: '172.17.0.1',
    proxy: {
      '/api': {
        target: 'http://172.17.0.1:4001',
      }
    }
  }
});
