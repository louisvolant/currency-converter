// frontend/src/app/layout.tsx (Server Component)

import { Inter } from 'next/font/google';
import './globals.css';
import { CurrencyProvider } from './context/CurrencyContext';
import ClientThemeWrapper from './components/ClientThemeWrapper';
import React, { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next';
import Footer from './Footer';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

// 1. Separate Viewport export
export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// 2. Metadata for PWA assets
export const metadata: Metadata = {
  title: 'Currency Converter',
  description: 'A multi-currency converter using Fawazahmed0 & FrankFurterDev rates.',
  icons: {
    icon: '/icon-currency.png',
    apple: '/icons/icon-currency.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SuperApp',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`antialiased bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300 ${inter.className}`}>
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white shadow-md pt-safe-top">
          <div className="container mx-auto px-4 py-4 flex items-center">
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