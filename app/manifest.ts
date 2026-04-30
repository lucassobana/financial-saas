import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FinFlow - Controle Financeiro',
    short_name: 'FinFlow',
    description: 'Gestão financeira inteligente e minimalista.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9f9ff',
    theme_color: '#006a3e',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
  }
}