// frontend/next.config.js (CORRECTED)

/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  // Activation du skipWaiting automatique
  skipWaiting: true,
  // Désactiver en mode dev pour ne pas interférer avec les rechargements rapides
  disable: process.env.NODE_ENV === 'development',
  register: true,
  // Ajout des runTimeCaching (bonne pratique pour la PWA)
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.(js|css|woff2?|png|jpg|webp|svg)/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
      },
    },
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
      },
    },
  ],
});

// Définir la configuration Next.js dans un seul objet
const nextConfig = {
  reactStrictMode: true,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'flagcdn.com',
            //pathname: '/**', // Vous pouvez utiliser cela si vous voulez être plus strict sur le chemin
          },
        ],
      },
};

// Exporter le résultat unique de l'application du wrapper PWA à la configuration
module.exports = withPWA(nextConfig); // EXPORT UNIQUE ET CORRECT