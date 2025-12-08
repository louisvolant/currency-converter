// frontend/src/app/components/CurrencySelector.tsx
'use client';

import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { ChevronDown } from 'lucide-react';
import { currencyDetails, getCountryCode } from '../utils/currencyData';
import Image from 'next/image';

interface CurrencySelectorProps {
  currentCode: string;
  lineId: number;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ currentCode, lineId }) => {
  const { updateCurrencyCode, availableCurrencies, currencyLines } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (newCode: string) => {
    updateCurrencyCode(lineId, newCode);
    setIsOpen(false);
  };

  const usedCodes = currencyLines.map(line => line.code);
  const selectableCodes = availableCurrencies.filter(code => !usedCodes.includes(code) || code === currentCode);

  const currentDetail = currencyDetails[currentCode] || { name: 'Unknown', flag: '' };
    const currentCountryCode = getCountryCode(currentCode);

  return (
    <div className="relative">
      {/* Button that currently displays the selected currency */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-xl font-semibold bg-blue-200 dark:bg-blue-600 text-blue-800 dark:text-blue-100 rounded-md transition duration-150 justify-center
                   flex-shrink-0 max-w-[120px] overflow-hidden"
      >
        {/* 🚨 USE OF FLAG-ICONS ON THE BUTTON */}
        <span
            className={`fi fi-${currentCountryCode} mr-1 rounded flex-shrink-0`}
            aria-label={`Flag of ${currentCode}`}
            style={{ fontSize: '1rem' }}
        ></span>
        <span className="truncate">{currentCode}</span>
        <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 top-full mt-2 right-0 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {selectableCodes.map(code => {
            const detail = currencyDetails[code] || { name: 'Unknown Currency' };
            const isSelected = code === currentCode;
            const codeForFlag = getCountryCode(code); // Retrieve the country code for the option

            return (
              <div
                key={code}
                onClick={() => handleSelect(code)}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${isSelected ? 'bg-blue-100 dark:bg-blue-900 font-bold' : ''}`}
              >
{               /* 🚨 USE OF FLAG-ICONS IN THE LIST */}
                <span
                    className={`fi fi-${codeForFlag} mr-3 flex-shrink-0 rounded`}
                    aria-label={`Flag of ${code}`}
                    style={{ fontSize: '1.5rem' }}
                ></span>
                <div className="flex flex-col text-left">
                  <span className="text-sm">{code}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{detail.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;