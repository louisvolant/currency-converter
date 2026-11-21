// app/Footer.tsx
'use client';

import { Fragment } from 'react';
import { footerLinks } from './links';
import { useCurrency } from './context/CurrencyContext';

export default function Footer() {
  const { isDarkMode, toggleDarkMode } = useCurrency();

  return (
    <footer className="mt-8 border-t border-gray-200/80 bg-white/80 py-5 px-4 pb-[calc(1.25rem+var(--spacing-safe-bottom))] backdrop-blur-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row dark:text-gray-400">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Currency Converter
          </span>
          <span className="hidden text-gray-300 sm:inline dark:text-gray-700" aria-hidden="true">
            ·
          </span>
          <span>© {new Date().getFullYear()} LouisVolant.com. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <nav className="flex items-center gap-3" aria-label="Personal">
            {footerLinks.map((link, index) => (
              <Fragment key={link.href}>
                {index > 0 && (
                  <span className="text-gray-300 dark:text-gray-700" aria-hidden="true">
                    ·
                  </span>
                )}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  {link.label}
                </a>
              </Fragment>
            ))}
          </nav>

          <button
            onClick={toggleDarkMode}
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-gray-800 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'} Mode
          </button>
        </div>
      </div>
    </footer>
  );
}
