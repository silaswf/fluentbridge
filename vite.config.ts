import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: 'index.html',
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase/')) return 'supabase-vendor';
            if (id.includes('lucide-react')) return 'icons-vendor';
            if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor';
          }
          if (
            id.includes('/curriculum/levelA1') ||
            id.includes('/curriculum/levelA2') ||
            id.includes('/curriculum/grammarA1A2')
          ) {
            return 'curriculum-a1a2';
          }
          if (
            id.includes('/curriculum/levelB1') ||
            id.includes('/curriculum/levelB2') ||
            id.includes('/curriculum/grammarB1B2')
          ) {
            return 'curriculum-b1b2';
          }
          if (
            id.includes('/curriculum/levelC1') ||
            id.includes('/curriculum/grammarC1')
          ) {
            return 'curriculum-c1';
          }
          if (
            id.includes('/curriculum/enSpecialTracks') ||
            id.includes('/curriculum/enExpansion')
          ) {
            return 'curriculum-en-special';
          }
          if (
            id.includes('/curriculum/spanishCourse') ||
            id.includes('/curriculum/spanishExtra') ||
            id.includes('/curriculum/spanishExpansion')
          ) {
            return 'curriculum-es';
          }
          if (
            id.includes('/curriculum/frenchCourse') ||
            id.includes('/curriculum/frenchExtra') ||
            id.includes('/curriculum/frenchExpansion')
          ) {
            return 'curriculum-fr';
          }
          if (
            id.includes('/curriculum/italianCourse') ||
            id.includes('/curriculum/italianExtra') ||
            id.includes('/curriculum/italianExpansion')
          ) {
            return 'curriculum-it';
          }
          if (
            id.includes('/curriculum/germanCourse') ||
            id.includes('/curriculum/germanExtra') ||
            id.includes('/curriculum/germanExpansion')
          ) {
            return 'curriculum-de';
          }
          if (id.includes('/grammar/enGrammarExtra')) return 'grammar-en';
          if (id.includes('/grammar/esGrammarExtra')) return 'grammar-es';
          if (id.includes('/grammar/frGrammarExtra')) return 'grammar-fr';
          if (id.includes('/grammar/itGrammarExtra')) return 'grammar-it';
          if (id.includes('/grammar/deGrammarExtra')) return 'grammar-de';
          if (id.includes('/data/placement/')) {
            return 'placement-bank';
          }
          if (id.includes('/data/grammarGuide')) {
            return 'grammar-guide';
          }
          return undefined;
        },
      },
    },
  },
}));
