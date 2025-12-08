// frontend/src/app/page.tsx
'use client';

import { useCurrency } from './context/CurrencyContext';
import CurrencyLine from './components/CurrencyLine';
import { Plus } from 'lucide-react';
import { CurrencyLine as CurrencyLineType } from './utils/types';

export default function Home() {
  const { currencyLines, addCurrencyLine } = useCurrency();

  return (
    <main className="min-h-screen p-4 md:p-8 text-gray-900 dark:text-white transition-colors duration-300">

      {/* Main Conversion Container */}
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
          Your Currencies
        </h2>

        {/* Currency lines list */}
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