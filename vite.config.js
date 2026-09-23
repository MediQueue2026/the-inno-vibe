import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Three.js is lazy-loaded in its own chunk after the page renders.
  build: { chunkSizeWarningLimit: 600 }
});
