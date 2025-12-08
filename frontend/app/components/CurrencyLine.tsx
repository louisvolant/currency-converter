// frontend/src/app/components/CurrencyLine.tsx
'use client';

import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyLine as CurrencyLineType } from '../utils/types';
import { Trash2 } from 'lucide-react';
import { currencyDetails, getCountryCode } from '../utils/currencyData';
import CurrencySelector from './CurrencySelector';


// Define component props interface
interface CurrencyLineProps {
    currency: CurrencyLineType;
}

const CurrencyLine: React.FC<CurrencyLineProps> = ({ currency }) => {
// Destructure updateCurrencyCode from the context
  const { updateValue, availableCurrencies, updateCurrencyCode, currencyLines,removeCurrencyLine } = useCurrency();

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(currency.id, e.target.value);
  };

// Implement the change handler for the currency code
  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCurrencyCode(currency.id, e.target.value);
  };

 const handleRemove = () => {
     removeCurrencyLine(currency.id);
   };

  // Get codes currently used in other lines to prevent duplicates in the select dropdown
  const usedCodes = currencyLines
    .filter(line => line.id !== currency.id)
    .map(line => line.code);

  const availableCodesForSelect = availableCurrencies.filter(code => !usedCodes.includes(code));

    // The base currency (EUR) is still fixed and not removable.
    const isRemovable = !currency.isBase && currencyLines.length > 1;

    const countryCode = getCountryCode(currency.code); // Get the code here

    return (
        <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-md mb-3">

            {/* Input with text-right alignment */}
            <input
                type="number"
                value={currency.value.toString()}
                onChange={handleValueChange}
                className="flex-grow p-2 text-xl font-bold rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-right"
                aria-label={`Value for ${currency.code}`}
            />

            {/* Currency Code Display/Selector */}
            {currency.isBase ? (
            <div
                className="p-2 text-xl font-semibold bg-blue-200 dark:bg-blue-600 text-blue-800 dark:text-blue-100 rounded-md
                           flex items-center justify-center space-x-2
                           flex-shrink-0 overflow-hidden text-ellipsis"
            >

                {/* 🚨 UTILISATION DE FLAG-ICONS */}
                <span
                    className={`fi fi-${countryCode} mr-1 rounded`}
                    aria-label={`Flag of ${currency.code}`}
                    style={{ fontSize: '1.25rem' }} // Ajustement optionnel de la taille
                ></span>
                <span className="truncate">{currency.code}</span>
            </div>
            ) : (
                // Other currencies use the clickable selector
                <CurrencySelector
                    currentCode={currency.code}
                    lineId={currency.id}
                />
            )}

      {/* Delete Button - Conditional */}
      {isRemovable && (
        <button
          onClick={handleRemove}
          className="p-3 text-red-600 dark:text-red-400 hover:text-white hover:bg-red-500 dark:hover:bg-red-700 rounded-full transition duration-150 flex-shrink-0"
          aria-label={`Remove ${currency.code} line`}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}

    </div>
  );
};

export default CurrencyLine;