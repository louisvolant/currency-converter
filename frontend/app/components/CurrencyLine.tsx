// frontend/src/app/components/CurrencyLine.tsx
'use client';

import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyLine as CurrencyLineType } from '../utils/types';
import { Trash2, X } from 'lucide-react';
import { getCountryCode } from '../utils/currencyData';

interface CurrencyLineProps {
  currency: CurrencyLineType;
}

const CurrencyLine: React.FC<CurrencyLineProps> = ({ currency }) => {
  // Get rates and actions from context
  const { updateValue, currencyLines, removeCurrencyLine, exchangeRates } = useCurrency();

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(currency.id, e.target.value);
  };

  const handleRemove = () => removeCurrencyLine(currency.id);

  const isRemovable = !currency.isBase && currencyLines.length > 1;
  const countryCode = getCountryCode(currency.code);

  // Get the rate for 1 Euro
  const rateForOneEuro = exchangeRates[currency.code];

  return (
    <div className="flex flex-col p-3 rounded-xl bg-gray-100 dark:bg-gray-700 shadow-md mb-3">
      {/* TOP ROW: Input + Badge + Trash (All vertically aligned) */}
      <div className="flex items-center gap-3">
        {/* Input container */}
        <div className="relative flex-1 min-w-0">
          <input
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            step="any"
            value={currency.value === 0 ? "" : currency.value.toString()}
            onChange={handleValueChange}
            placeholder="0"
            className="w-full px-4 py-3 pr-12 text-lg sm:text-xl font-bold rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-right"
            aria-label={`Value for ${currency.code}`}
          />

          {/* Clear button */}
          {currency.value !== 0 && (
            <button
              type="button"
              onClick={() => updateValue(currency.id, "")}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 z-10 transition"
              aria-label="Clear"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Currency Badge & Actions container */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 text-lg font-bold bg-blue-200 dark:bg-blue-600 text-blue-900 dark:text-blue-100 rounded-lg whitespace-nowrap">
            <span className={`fi fi-${countryCode}`} style={{ fontSize: '1.4rem' }} />
            <span>{currency.code}</span>
          </div>

          {isRemovable && (
            <button
              onClick={handleRemove}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
              aria-label={`Remove ${currency.code}`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* BOTTOM ROW: Reference rate (aligned left, under the input) */}
      {!currency.isBase && rateForOneEuro && (
        <div className="mt-2 px-1 text-xs font-medium text-gray-500 dark:text-gray-400 text-left">
          1€ = <span className="font-semibold">{rateForOneEuro.toFixed(4)}</span> {currency.code}
        </div>
      )}
    </div>
  );
};

export default CurrencyLine;