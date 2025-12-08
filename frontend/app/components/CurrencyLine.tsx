// frontend/src/app/components/CurrencyLine.tsx
'use client';

import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyLine as CurrencyLineType } from '../utils/types';
import { Trash2, X } from 'lucide-react';
import { getCountryCode } from '../utils/currencyData';

// Define component props interface
interface CurrencyLineProps {
  currency: CurrencyLineType;
}

const CurrencyLine: React.FC<CurrencyLineProps> = ({ currency }) => {
  const { updateValue, currencyLines, removeCurrencyLine } = useCurrency();

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(currency.id, e.target.value);
  };

  const handleRemove = () => {
    removeCurrencyLine(currency.id);
  };

  // The base currency (EUR) is still fixed and not removable.
  const isRemovable = !currency.isBase && currencyLines.length > 1;

  const countryCode = getCountryCode(currency.code); // Get the code here

  return (
    <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-md mb-3 flex-wrap">

    <div className="relative flex-grow">
      <input
        type="number"
        inputMode="decimal"
        pattern="[0-9]*"
        step="any"
        value={currency.value.toString()}
        onChange={handleValueChange}
        placeholder="0"
        className="w-full p-2 pr-9 text-base sm:text-xl font-bold rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-right"
        aria-label={`Value for ${currency.code}`}
      />

      {/* Clear button – only shown when there is a value */}
      {currency.value !== 0 && (
        <button
          type="button"
          onClick={() => updateValue(currency.id, "")}
          className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          aria-label="Clear value"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>

      {/* Static Currency Display (Unified for Base & Others - No Selector) */}
      <div
        className="p-1.5 sm:p-2 text-base sm:text-xl font-semibold bg-blue-200 dark:bg-blue-600 text-blue-800 dark:text-blue-100 rounded-md
                   flex items-center justify-center space-x-2
                     flex-shrink-0 overflow-hidden text-ellipsis max-w-[80px] sm:max-w-[100px]"
      >
        {/* Flag */}
        <span
          className={`fi fi-${countryCode} mr-1 rounded`}
          aria-label={`Flag of ${currency.code}`}
          style={{ fontSize: '1.25rem' }}
        />
        <span className="truncate">{currency.code}</span>
      </div>

      {/* Delete Button - Conditional */}
      {isRemovable && (
        <button
          onClick={handleRemove}
          className="p-1.5 sm:p-3 text-red-600 dark:text-red-400 hover:text-white hover:bg-red-500 dark:hover:bg-red-700 rounded-full transition duration-150 flex-shrink-0"
          aria-label={`Remove ${currency.code} line`}
        >
          <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>
      )}

    </div>
  );
};

export default CurrencyLine;