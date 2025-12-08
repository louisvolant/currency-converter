// frontend/src/app/page.tsx
'use client';

import { useCurrency } from './context/CurrencyContext';
import CurrencyLine from './components/CurrencyLine';
import { Moon, Sun, Plus } from 'lucide-react';
import { CurrencyLine as CurrencyLineType } from './utils/types';

export default function Home() {
  const { currencyLines, addCurrencyLine, isDarkMode, toggleDarkMode } = useCurrency();

  return (
    <main className="min-h-screen p-4 md:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">

      {/* Header and Dark Mode Toggle */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
          💰 Currency Converter
        </h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-700" />}
        </button>
      </header>

      {/* Main Conversion Container */}
      <div className="max-w-xl mx-auto">

        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
          Your Currencies
        </h2>

        {/* Currency lines list */}
        {/* Fix: Explicitly type the 'currency' item */}
        {currencyLines.map((currency: CurrencyLineType) => (
          <CurrencyLine key={currency.id} currency={currency} />
        ))}

        {/* Button to add a new currency */}
        <button
          onClick={addCurrencyLine}
          className="w-full flex items-center justify-center space-x-2 py-3 mt-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Currency</span>
        </button>
      </div>
    </main>
  );
}