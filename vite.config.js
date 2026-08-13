import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const timestamp = Date.now();

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].v${timestamp}.js`,
        chunkFileNames: `assets/[name].v${timestamp}.js`,
        assetFileNames: `assets/[name].v${timestamp}[extname]`,
        manualChunks: {
          pdfjs: ['pdfjs-dist'],
          vendor: ['react', 'react-dom', 'lucide-react']
        }
      }
    }
  }
});
