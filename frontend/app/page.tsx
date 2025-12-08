'use client';

import { useCurrency } from './context/CurrencyContext';
import CurrencyLine from './components/CurrencyLine';
import { Plus, X } from 'lucide-react'; // Added X for cancel
import { CurrencyLine as CurrencyLineType } from './utils/types';
import { currencyDetails, getCountryCode } from './utils/currencyData'; // Import for list details
import { useState } from 'react';

export default function Home() {
  const { currencyLines, addCurrencyLine } = useCurrency();
  const [showAddList, setShowAddList] = useState(false); // New state for toggling list

  // Compute unused currencies for the add list
  const usedCodes = currencyLines.map(line => line.code);
  const unusedCurrencies = useCurrency().availableCurrencies.filter(code => !usedCodes.includes(code)); // Assuming availableCurrencies from context

  const handleAddCurrency = (code: string) => {
    addCurrencyLine(code); // Now passes code
    setShowAddList(false);
  };

  const handleCancelAdd = () => {
    setShowAddList(false);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Main Conversion Container */}
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
          Your Currencies
        </h2>

        {/* Currency lines list */}
        {currencyLines.map((currency: CurrencyLineType) => (
          <CurrencyLine key={currency.id} currency={currency} />
        ))}

        {/* Add Currency Section - Transforms to List */}
        <div className="mt-4"> {/* Wrapper for consistent spacing */}
          {!showAddList ? (
            // Original Add Button - Added dark variants
            <button
              onClick={() => setShowAddList(true)}
              className="w-full flex items-center justify-center space-x-2 py-3 text-lg font-medium text-white bg-blue-600 dark:bg-blue-700 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-150 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Currency</span>
            </button>
          ) : (
            // New: Vertical List of Currency Buttons (no scroll wrapper - uses page scroll)
            <div className="w-full space-y-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              {unusedCurrencies.map(code => {
                const detail = currencyDetails[code] || { name: 'Unknown Currency' };
                const countryCode = getCountryCode(code);
                return (
                  <button
                    key={code}
                    onClick={() => handleAddCurrency(code)}
                    className="w-full flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900 transition duration-150 text-left text-gray-900 dark:text-white"
                  >
                    {/* Flag */}
                    <span
                      className={`fi fi-${countryCode} flex-shrink-0 rounded`}
                      aria-label={`Flag of ${code}`}
                      style={{ fontSize: '1.25rem' }}
                    />
                    {/* Code & Name */}
                    <div className="min-w-0 flex-grow">
                      <span className="font-semibold text-base block truncate">{code}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{detail.name}</span>
                    </div>
                  </button>
                );
              })}
              {/* Cancel Button */}
              <button
                onClick={handleCancelAdd}
                className="w-full flex items-center justify-center space-x-2 py-2 mt-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}