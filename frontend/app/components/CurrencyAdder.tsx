// src/app/components/CurrencyAdder.tsx
'use client';

import { useCurrency } from '../context/CurrencyContext';
import { X, Search } from 'lucide-react';
// 1. FIX IMPORTS: Only keep getCountryCode from currencyData.
import { getCountryCode } from '../utils/currencyData';
import { useState, useEffect, useRef } from 'react';

interface CurrencyAdderProps {
  onClose: () => void;
}

export default function CurrencyAdder({ onClose }: CurrencyAdderProps) {
  const { availableCurrencies, currencyLines, addCurrencyLine, currencyNames } = useCurrency();
  const [search, setSearch] = useState('');

  // Filter unused currencies + search
  const usedCodes = currencyLines.map(l => l.code);
  const unusedCurrencies = availableCurrencies.filter(code => !usedCodes.includes(code));

  const filteredCurrencies = unusedCurrencies.filter(code => {
    // 3. FIX SEARCH LOGIC: Use currencyNames for searching
    const name = currencyNames[code] || ''; // Use the name from the context
    const lowerSearch = search.toLowerCase();
    return code.toLowerCase().includes(lowerSearch) || name.toLowerCase().includes(lowerSearch);
  });

  const handleAdd = (code: string) => {
    addCurrencyLine(code);
    onClose();
  };

  // Auto-focus search input when component mounts
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search currency (USD, Euro, Yen...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Results List */}
      <div className="max-h-96 overflow-y-auto space-y-2 -mx-4 px-4">
        {filteredCurrencies.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No currencies found
          </p>
        ) : (
          filteredCurrencies.map(code => {
            const countryCode = getCountryCode(code);
            const name = currencyNames[code] || 'Unknown Currency';

            return (
              <button
                key={code}
                onClick={() => handleAdd(code)}
                className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition text-left"
              >
                <span
                  className={`fi fi-${countryCode} rounded flex-shrink-0`}
                  style={{ fontSize: '1.5rem' }}
                />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{code}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{name}</div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Cancel Button */}
      <button
        onClick={onClose}
        className="w-full flex items-center justify-center gap-2 py-3 mt-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition"
      >
        <X className="w-4 h-4" />
        Cancel
      </button>
    </div>
  );
}