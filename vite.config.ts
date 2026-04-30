import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:8001',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      },
      plugins: [
        react(),
        VitePWA({ 
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
          manifest: {
            name: 'ScanGreen',
            short_name: 'ScanGreen',
            description: 'Plastic-Free Verification & Health Risk Assessment',
            theme_color: '#10b981',
            icons: [
              {
                src: '/vite.svg',
                sizes: '192x192',
                type: 'image/svg+xml'
              },
              {
                src: '/vite.svg',
                sizes: '512x512',
                type: 'image/svg+xml'
              }
            ]
          }
        })
      ],
      define: {
        // API key removed for security. All Gemini API calls are routed through the secure backend.
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        chunkSizeWarningLimit: 1600, // Supress large asset warnings for heavy libraries
      }
    };
});
