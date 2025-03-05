import { defineConfig } from 'vite';
import path from "path"
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': {}
  },
  server: {
    port: 4502,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:4502",
    proxy: {
      '/v1_1': {
        target: 'https://api.cloudinary.com',
        changeOrigin: true,
      },
    },
  },
});
