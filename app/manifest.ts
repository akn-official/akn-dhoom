import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aspire Kinetic Network',
    short_name: 'AKN',
    description: "A global digital growth studio. Web design, SEO, and growth for modern businesses.",
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0F1C',
    theme_color: '#0A0F1C',
    orientation: 'portrait',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
    categories: ['business', 'productivity'],
  };
}
