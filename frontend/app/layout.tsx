// frontend/src/app/layout.tsx (Server Component)

import { Inter } from 'next/font/google';
import './globals.css';
import { CurrencyProvider } from './context/CurrencyContext';
import ClientThemeWrapper from './components/ClientThemeWrapper';
import React, { ReactNode } from 'react';
import type { Metadata } from 'next';
import Footer from './Footer';
import Image from 'next/image';

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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SuperApp" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link href="/splash/iphone15promax.png"
              sizes="1290x2796"
              rel="apple-touch-startup-image"
              media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" />
      </head>
      <body className={`antialiased bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300 ${inter.className}`}>
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-4 shadow-md">
          <div className="container mx-auto px-4 flex items-center">
            <Image
              src="/icon-currency.png"
              alt="Currency Converter Logo"
              width={32}
              height={32}
              priority
              className="h-8 w-8 mr-2"
            />
            <h1 className="text-2xl font-bold">Currency Converter</h1>
          </div>
        </header>

        <CurrencyProvider>
          <ClientThemeWrapper>
            {/* Main content */}
            <main>{children}</main>
            <Footer />
          </ClientThemeWrapper>
        </CurrencyProvider>
      </body>
    </html>
  );
}