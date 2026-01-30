import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(),tailwindcss(),VitePWA({
      registerType: 'autoUpdate', // Se actualiza sola al abrir
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // Archivos estáticos
      manifest: {
        name: 'Asistente TBC Santa Fe', // Nombre completo
        short_name: 'Asistente TBC', // Nombre debajo del icono en el cel
        description: 'Aplicación de triaje y gestión de Tuberculosis',
        theme_color: '#1e3a8a', // Color de la barra de estado del celular (Azul oscuro)
        background_color: '#111827', // Color de fondo al abrir (Gris oscuro/Negro)
        display: 'standalone', // Esto hace que se vea sin barra de navegador (como app nativa)
        orientation: 'portrait', // Bloquear en vertical si quieres
        icons: [
          {
            src: 'pwa-192x192.png', // Estos nombres te los da RealFaviconGenerator
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
             purpose: 'any maskable' // Importante para Android modernos
          }
        ]
      }
    })],
})
