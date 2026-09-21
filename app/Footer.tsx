// src/app/Footer.tsx
"use client";

import { Fragment } from 'react';
import Link from 'next/link';
import { footerLinks } from './links';
// Import the Context Hook
import { useCurrency } from './context/CurrencyContext';

export default function Footer() {
  // Use Global State
  const { isDarkMode, toggleDarkMode } = useCurrency();

  return (
    <footer className="bg-white dark:bg-gray-900 py-4 pb-[calc(1rem+var(--spacing-safe-bottom))] mt-8 transition-colors duration-300">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-gray-600 dark:text-gray-300">
        <span>© {new Date().getFullYear()} LouisVolant.com. All rights reserved.</span>

        {footerLinks.map((link) => (
          <Fragment key={link.href}>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <Link href={link.href} className="hover:text-gray-800 dark:hover:text-gray-100">
              {link.label}
            </Link>
          </Fragment>
        ))}

        <button
          onClick={toggleDarkMode}
          className="ml-1 px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-200"
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'} Mode
        </button>
      </div>
    </footer>
  );
}
