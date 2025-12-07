// frontend/src/app/layout.tsx (Server Component)

import { Inter } from 'next/font/google';
import './globals.css';
import { CurrencyProvider } from './context/CurrencyContext';
import ClientThemeWrapper from './components/ClientThemeWrapper';
import React, { ReactNode } from 'react'; // Only need ReactNode now

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Currency Converter',
  description: 'A multi-currency converter built with Next.js and Tailwind CSS.',
};

// Default Next.js Layout is a Server Component
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* PWA manifest link */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />


        {/* iOS - très important en 2025 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SuperApp" />

        {/* Icône écran d'accueil iOS */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        {/* Splash screens iOS (optionnel mais très pro) */}
        <link href="/splash/iphone15promax.png"
              sizes="1290x2796"
              rel="apple-touch-startup-image"
              media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" />
        {/* Ajoute les autres tailles si tu veux */}

      </head>
      <body>
        {/* CurrencyProvider is used here because it is a context setup, which is fine on server */}
        <CurrencyProvider>
          {/* ClientThemeWrapper is the boundary where client-side logic starts */}
          <ClientThemeWrapper>
            {children}
          </ClientThemeWrapper>
        </CurrencyProvider>
      </body>
    </html>
  );
}
