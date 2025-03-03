import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'process.env': {}
  },
  server: {
    proxy: {
      '/v1_1': {
        target: 'https://api.cloudinary.com',
        changeOrigin: true,
      },
    },
  },
});
