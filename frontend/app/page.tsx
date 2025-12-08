'use client';

import { useCurrency } from './context/CurrencyContext';
import CurrencyLine from './components/CurrencyLine';
import CurrencyAdder from './components/CurrencyAdder';
import { Plus } from 'lucide-react';
import { CurrencyLine as CurrencyLineType } from './utils/types';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const { currencyLines } = useCurrency();
  const [showAdder, setShowAdder] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showAdder && topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAdder]);

  return (
    <main className="min-h-screen p-4 md:p-8 text-gray-900 dark:text-white transition-colors duration-300">
      <div ref={topRef} />

      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-3 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
          Your Currencies
        </h2>

        {/* List of current currencies */}
        {currencyLines.map((currency: CurrencyLineType) => (
          <CurrencyLine key={currency.id} currency={currency} />
        ))}

        {/* Add Currency Button or Full Panel */}
        <div className="mt-6">
          {!showAdder ? (
            <button
              onClick={() => setShowAdder(true)}
              className="w-full flex items-center justify-center gap-2 py-4 text-lg font-medium text-white bg-blue-600 dark:bg-blue-700 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-800 transition shadow-lg"
            >
              <Plus className="w-6 h-6" />
              Add Currency
            </button>
          ) : (
            <CurrencyAdder onClose={() => setShowAdder(false)} />
          )}
        </div>
      </div>
    </main>
  );
}