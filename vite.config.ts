import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-libs': ['pdfjs-dist'],
          'search-libs': ['lunr'],
          'supabase': ['@supabase/supabase-js'],
          'social-page': ['./src/social_page/src/App.tsx']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    hmr: {
      overlay: false
    }
  }
});
