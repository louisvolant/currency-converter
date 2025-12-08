// frontend/src/app/layout.tsx (Server Component)

import { Inter } from 'next/font/google';
import './globals.css';
import { CurrencyProvider } from './context/CurrencyContext';
import ClientThemeWrapper from './components/ClientThemeWrapper';
import React, { ReactNode } from 'react';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Currency Converter',
  description: 'A multi-currency converter built with Next.js and Tailwind CSS.',
  icons: {
    icon: '/currency-converter-128.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* PWA manifest link */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />


        {/* iOS - very important in 2025 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SuperApp" />

        {/* iOS home screen icon */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        {/* iOS splash screens (optional but very pro) */}
        <link href="/splash/iphone15promax.png"
              sizes="1290x2796"
              rel="apple-touch-startup-image"
              media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" />
        {/* Add the other sizes if you want */}

      </head>
      <body>
        <CurrencyProvider>
          <ClientThemeWrapper>
            {children}
          </ClientThemeWrapper>
        </CurrencyProvider>
      </body>
    </html>
  );
}