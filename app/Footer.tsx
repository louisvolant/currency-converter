// src/app/Footer.tsx
"use client";

import { Fragment } from 'react';
import { footerLinks } from './links';
// Import the Context Hook
import { useCurrency } from './context/CurrencyContext';

export default function Footer() {
  // Use Global State
  const { isDarkMode, toggleDarkMode } = useCurrency();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 px-4 pb-[calc(1.5rem+var(--spacing-safe-bottom))] mt-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
        <div>
          Currency Converter — © {new Date().getFullYear()} LouisVolant.com. All rights reserved.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {footerLinks.map((link, index) => (
            <Fragment key={link.href}>
              {index > 0 && (
                <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
              )}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {link.label}
              </a>
            </Fragment>
          ))}

          <button
            onClick={toggleDarkMode}
            type="button"
            className="ml-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200 cursor-pointer"
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'} Mode
          </button>
        </div>
      </div>
    </footer>
  );
}
