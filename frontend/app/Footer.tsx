// src/app/Footer.tsx
"use client";

import Link from 'next/link';
import { externalLinks } from './links';
// Import the Context Hook
import { useCurrency } from './context/CurrencyContext';

export default function Footer() {
  // Use Global State
  const { isDarkMode, toggleDarkMode } = useCurrency();

  return (
    <footer className="bg-gray-200 dark:bg-gray-800 py-4 mt-8 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
        <div className="mb-4">
          {externalLinks.map((link, index) => (
            <span key={link.href}>
              <Link href={link.href} className="mx-2 hover:text-gray-800 dark:hover:text-gray-100">
                {link.label}
              </Link>
              {index < externalLinks.length - 1 && <span>|</span>}
            </span>
          ))}
        </div>

        <button
          onClick={toggleDarkMode}
          className="py-2 px-4 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
        >
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>

        <div className="mt-4">
          © {new Date().getFullYear()} LouisVolant.com. All rights reserved.
        </div>
      </div>
    </footer>
  );
}