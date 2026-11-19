import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  // Disable in dev mode to not interfere with fast Turbopack reloads
  disable: process.env.NODE_ENV === 'development',
  register: true,
  // Exclude static Cloudflare headers and generated worker files from precache
  globPublicPatterns: ['**/*', '!_headers', '!sw.js*'],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
    ],
  },
};

export default withSerwist(nextConfig);
