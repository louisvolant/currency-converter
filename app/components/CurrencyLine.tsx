// frontend/src/app/components/CurrencyLine.tsx
'use client';

import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyLine as CurrencyLineType } from '../utils/types';
import { Trash2, X, GripVertical } from 'lucide-react';
import { getCountryCode } from '../utils/currencyData';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CurrencyLineProps {
  currency: CurrencyLineType;
  disabled?: boolean;
}

const CurrencyLine: React.FC<CurrencyLineProps> = ({ currency, disabled }) => {
  const { updateValue, currencyLines, removeCurrencyLine, exchangeRates } = useCurrency();

  // DnD Kit Setup
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: currency.id,
    disabled: disabled // EUR cannot be dragged
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(currency.id, e.target.value);
  };

  const handleRemove = () => removeCurrencyLine(currency.id);
  const isRemovable = !currency.isBase && currencyLines.length > 1;
  const countryCode = getCountryCode(currency.code);
  const rateForOneEuro = exchangeRates[currency.code];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col p-3 rounded-xl shadow-md mb-3 transition-colors ${
        isDragging ? 'bg-blue-50 dark:bg-gray-600' : 'bg-gray-100 dark:bg-gray-700'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* DRAG HANDLE - Only show if not the base currency (EUR) */}
        {!currency.isBase && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 touch-none"
          >
            <GripVertical className="w-5 h-5" />
          </div>
        )}

        {/* Value Input */}
        <div className="relative flex-1 min-w-0">
          <input
            type="number"
            inputMode="decimal"
            value={currency.value === 0 ? "" : currency.value.toString()}
            onChange={handleValueChange}
            placeholder="0"
            className="w-full px-4 py-3 pr-12 text-lg sm:text-xl font-bold rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 text-right"
            aria-label={`Value for ${currency.code}`}
          />
          {currency.value !== 0 && (
            <button
              type="button"
              onClick={() => updateValue(currency.id, "")}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-red-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Currency Badge and Remove button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 text-lg font-bold bg-blue-200 dark:bg-blue-600 text-blue-900 dark:text-blue-100 rounded-lg whitespace-nowrap">
            <span className={`fi fi-${countryCode}`} style={{ fontSize: '1.4rem' }} />
            <span>{currency.code}</span>
          </div>

          {isRemovable && (
            <button
              onClick={handleRemove}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Conversion Rate Info (1 EUR = X Curr) */}
      {!currency.isBase && rateForOneEuro && (
        <div className="mt-2 px-1 text-xs font-medium text-gray-500 dark:text-gray-400 ml-8">
          1€ = <span className="font-semibold">{rateForOneEuro.toFixed(4)}</span> {currency.code}
        </div>
      )}
    </div>
  );
};

export default CurrencyLine;