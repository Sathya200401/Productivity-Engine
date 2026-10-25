import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: './.vite_cache',
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    strictPort: true
  },
  preview: {
    port: 3000,
    host: true,
    strictPort: true
  },
  build: {
    outDir: 'build',
    emptyOutDir: false
  }
});
