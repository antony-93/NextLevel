import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Next Level',
        short_name: 'Next Level',
        description: 'Next Level, seu gerenciador de academias',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
      }
    })
  ],
  resolve: {
    alias: {
      'FirebaseConfig': path.resolve(__dirname, 'FirebaseConfig.ts'),
      '@': path.resolve(__dirname, 'src')
    },
  },
})