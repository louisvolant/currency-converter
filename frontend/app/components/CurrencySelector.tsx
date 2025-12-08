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
      {/* Button that currently displays the selected currency - responsive sizing */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 text-base sm:text-xl font-semibold bg-blue-200 dark:bg-blue-600 text-blue-800 dark:text-blue-100 rounded-md transition duration-150 justify-center
                   flex-shrink-0 max-w-[80px] sm:max-w-[120px] overflow-hidden"
      >
        {/* 🚨 USE OF FLAG-ICONS ON THE BUTTON - responsive size */}
        <span
          className={`fi fi-${currentCountryCode} mr-0.5 sm:mr-1 rounded text-sm sm:text-base flex-shrink-0`}
          aria-label={`Flag of ${currentCode}`}
        ></span> {/* Removed inline style */}
        <span className="truncate min-w-0">{currentCode}</span> {/* Added min-w-0 for better truncate */}
        <ChevronDown className={`w-3 sm:w-4 h-3 sm:h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {/* Dropdown Menu - responsive width */}
      {isOpen && (
        <div className="absolute z-10 top-full mt-1 sm:mt-2 right-0 w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {selectableCodes.map(code => {
            const detail = currencyDetails[code] || { name: 'Unknown Currency' };
            const isSelected = code === currentCode;
            const codeForFlag = getCountryCode(code); // Retrieve the country code for the option

            return (
              <div
                key={code}
                onClick={() => handleSelect(code)}
                className={`flex items-center p-2 sm:p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${isSelected ? 'bg-blue-100 dark:bg-blue-900 font-bold' : ''}`}
              >
                {/* 🚨 USE OF FLAG-ICONS IN THE LIST - responsive size */}
                <span
                  className={`fi fi-${codeForFlag} mr-2 sm:mr-3 flex-shrink-0 rounded text-base sm:text-lg`}
                  aria-label={`Flag of ${code}`}
                ></span>
                <div className="flex flex-col text-left min-w-0"> {/* Added min-w-0 */}
                  <span className="text-sm sm:text-base">{code}</span> {/* Responsive text in options */}
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