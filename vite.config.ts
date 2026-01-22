import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Always use '/' as base for Capacitor and Vercel
  base: '/',
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
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          // Supabase ve API
          'supabase-vendor': ['@supabase/supabase-js', '@tanstack/react-query'],
          // Harita (en ağır kütüphane)
          'map-vendor': ['leaflet', 'react-leaflet'],
          // Stripe
          'stripe-vendor': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          // Capacitor
          'capacitor-vendor': [
            '@capacitor/core',
            '@capacitor/app',
            '@capacitor/browser',
            '@capacitor/preferences'
          ],
          // Icons
          'icons-vendor': ['lucide-react']
        }
      }
    },
    // Chunk size uyarısını artır
    chunkSizeWarningLimit: 600,
    // Minification optimizasyonu
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Console.log'ları production'da kaldır
        drop_debugger: true
      }
    }
  }
}))
