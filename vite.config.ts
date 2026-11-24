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
        globIgnores: [
          '**/curriculum-*.js',
          '**/vocab-exp-*.js',
          '**/grammar-*.js',
          '**/exams-*.js',
          '**/tutor-scenarios*.js',
          '**/placement-bank*.js',
        ],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /\/assets\/.*\.js$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fb-dynamic-chunks-v7',
              expiration: {
                maxEntries: 120,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
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
          if (
            id.includes('/curriculum/russianCourse') ||
            id.includes('/curriculum/russianExtra')
          ) {
            return 'curriculum-ru';
          }
          if (
            id.includes('/curriculum/japaneseCourse') ||
            id.includes('/curriculum/japaneseExtra')
          ) {
            return 'curriculum-ja';
          }
          if (
            id.includes('/curriculum/chineseCourse') ||
            id.includes('/curriculum/chineseExtra')
          ) {
            return 'curriculum-zh';
          }
          if (id.includes('/curriculum/enExpansionV4')) return 'curriculum-en-v4';
          if (id.includes('/curriculum/spanishExpansionV4')) return 'curriculum-es-v4';
          if (id.includes('/curriculum/frenchExpansionV4')) return 'curriculum-fr-v4';
          if (id.includes('/curriculum/italianExpansionV4')) return 'curriculum-it-v4';
          if (id.includes('/curriculum/germanExpansionV4')) return 'curriculum-de-v4';
          if (id.includes('/curriculum/russianExpansionV4')) return 'curriculum-ru-v4';
          if (id.includes('/curriculum/japaneseExpansionV4')) return 'curriculum-ja-v4';
          if (id.includes('/curriculum/chineseExpansionV4')) return 'curriculum-zh-v4';
          if (id.includes('/curriculum/arabicCourse')) return 'curriculum-ar';
          if (id.includes('/curriculum/arabicExpansion')) return 'curriculum-ar-exp';
          if (id.includes('/curriculum/dutchCourse')) return 'curriculum-nl';
          if (id.includes('/curriculum/dutchExpansion')) return 'curriculum-nl-exp';
          if (id.includes('/curriculum/afrikaansCourse')) return 'curriculum-af';
          if (id.includes('/curriculum/afrikaansExpansion')) return 'curriculum-af-exp';
          if (id.includes('/curriculum/swedishCourse')) return 'curriculum-sv';
          if (id.includes('/curriculum/vocabExpansion/vocabExpEn')) return 'vocab-exp-en';
          if (id.includes('/curriculum/vocabExpansion/vocabExpEs')) return 'vocab-exp-es';
          if (id.includes('/curriculum/vocabExpansion/vocabExpFr')) return 'vocab-exp-fr';
          if (id.includes('/curriculum/vocabExpansion/vocabExpIt')) return 'vocab-exp-it';
          if (id.includes('/curriculum/vocabExpansion/vocabExpDe')) return 'vocab-exp-de';
          if (id.includes('/curriculum/vocabExpansion/vocabExpRu')) return 'vocab-exp-ru';
          if (id.includes('/curriculum/vocabExpansion/vocabExpJa')) return 'vocab-exp-ja';
          if (id.includes('/curriculum/vocabExpansion/vocabExpZh')) return 'vocab-exp-zh';
          if (id.includes('/curriculum/vocabExpansion/vocabExpAr')) return 'vocab-exp-ar';
          if (id.includes('/curriculum/vocabExpansion/vocabExpNl')) return 'vocab-exp-nl';
          if (id.includes('/curriculum/vocabExpansion/vocabExpAf')) return 'vocab-exp-af';
          if (id.includes('/curriculum/vocabExpansion/vocabExpSv')) return 'vocab-exp-sv';
          if (id.includes('/curriculum/swedishExpansion')) return 'curriculum-sv-exp';
          if (id.includes('/grammar/enGrammarExtra') || id.includes('/grammar/enGrammarV4')) return 'grammar-en';
          if (id.includes('/grammar/esGrammarExtra') || id.includes('/grammar/esGrammarV4')) return 'grammar-es';
          if (id.includes('/grammar/frGrammarExtra') || id.includes('/grammar/frGrammarV4')) return 'grammar-fr';
          if (id.includes('/grammar/itGrammarExtra') || id.includes('/grammar/itGrammarV4')) return 'grammar-it';
          if (id.includes('/grammar/deGrammarExtra') || id.includes('/grammar/deGrammarV4')) return 'grammar-de';
          if (id.includes('/grammar/ruGrammarGuide') || id.includes('/grammar/ruGrammarV4')) return 'grammar-ru';
          if (id.includes('/grammar/jaGrammarGuide') || id.includes('/grammar/jaGrammarV4')) return 'grammar-ja';
          if (id.includes('/grammar/zhGrammarGuide') || id.includes('/grammar/zhGrammarV4')) return 'grammar-zh';
          if (id.includes('/grammar/arGrammarGuide')) return 'grammar-ar';
          if (id.includes('/grammar/nlGrammarGuide')) return 'grammar-nl';
          if (id.includes('/grammar/afGrammarGuide')) return 'grammar-af';
          if (id.includes('/grammar/svGrammarGuide')) return 'grammar-sv';
          if (id.includes('/data/exams/examsEnglish')) return 'exams-en';
          if (id.includes('/data/exams/examsCelpip')) return 'exams-celpip';
          if (id.includes('/data/exams/examEnrichment')) return 'exams-enrichment';
          if (id.includes('/data/exams/examsRomance')) return 'exams-romance';
          if (id.includes('/data/exams/examsGermanic')) return 'exams-germanic';
          if (id.includes('/data/exams/examsScripts')) return 'exams-scripts';
          if (id.includes('/data/interactiveVideos')) return 'interactive-videos';
          if (id.includes('/curriculum/idiomsSlangExpansion')) return 'curriculum-idioms-slang';
          if (id.includes('/data/scriptTrainerData')) return 'script-trainer';
          if (id.includes('/data/podcastEpisodes')) return 'podcasts';
          if (id.includes('/data/tutorScenarios')) return 'tutor-scenarios';
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
