import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', '*.png', '*.ico'],

      manifest: {
        name: 'SmartTreino',
        short_name: 'SmartTreino',
        description: 'Aplicativo de treinos de academia com IA',
        theme_color: '#1677ff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'pt-BR',
        categories: ['health', 'fitness'],
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      workbox: {
        // Cache apenas assets estáticos (JS, CSS, HTML)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],

        // Sem runtime caching de API - assume conexão sempre disponível
        runtimeCaching: [],

        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true, // Enable PWA in dev mode for testing
        type: 'module',
      },
    })
  ],
})
