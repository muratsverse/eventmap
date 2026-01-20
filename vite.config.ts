import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Capacitor builds must use '/' as base. GitHub Pages might use '/eventmap/'
  base: (process.env.VERCEL || mode === 'capacitor') ? '/' : mode === 'production' ? '/eventmap/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Spotly - Sosyal Etkinlik Platformu',
        short_name: 'Spotly',
        description: 'Turkiye\'deki sosyal etkinlikleri kesfedin',
        theme_color: '#8B5CF6',
        background_color: '#1F2937',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    // Code splitting ve optimizasyon
    rollupOptions: {
      output: {
        manualChunks(id) {
          // node_modules içindeki paketleri vendor chunk'larına ayır
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) {
              return 'react-vendor';
            }
            if (id.includes('@supabase') || id.includes('@tanstack')) {
              return 'supabase-vendor';
            }
            if (id.includes('leaflet')) {
              return 'map-vendor';
            }
            if (id.includes('@stripe')) {
              return 'stripe-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            // Capacitor'u ana bundle'a dahil et (circular dependency sorununu önlemek için)
          }
        }
      }
    },
    // Chunk size uyarısını artır
    chunkSizeWarningLimit: 600,
    // Minification optimizasyonu
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Debug için console.log'ları koru
        drop_debugger: true
      }
    }
  }
}))
