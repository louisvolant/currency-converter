// frontend/src/app/context/CurrencyContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CurrencyLine, CurrencyContextType } from '../types';

// Initialize the context with undefined or null, and use a type assertion
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Initial state for the currency lines (EUR is the base)
const initialCurrencyLines: CurrencyLine[] = [
  { id: 1, code: 'EUR', value: 1.00, isBase: true },
];

// Define the structure for cached data
interface CachedRates {
    timestamp: number;
    rates: Record<string, number>;
}

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  // 1. Dark Mode Management
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // 2. Currency State
  const [currencyLines, setCurrencyLines] = useState<CurrencyLine[]>(initialCurrencyLines);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);

    // 3. Fetch Exchange Rates (With use of localStorage)
    useEffect(() => {
        const CACHE_KEY = 'frankfurter_rates_cache';
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        const fetchRates = async () => {
            let ratesData: Record<string, number> = {};
            let isCacheValid = false;

            // 1. Check LocalStorage
            if (typeof window !== 'undefined') {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const parsed: CachedRates = JSON.parse(cached);
                    // Check if cache is less than 24 hours old
                    if (Date.now() - parsed.timestamp < ONE_DAY_MS) {
                        ratesData = parsed.rates;
                        isCacheValid = true;
                        console.log("Using cached rates.");
                    }
                }
            }

            // 2. Fetch if cache is invalid/expired
            if (!isCacheValid) {
                try {
                    console.log("Fetching fresh rates from API...");
                    const response = await fetch('https://api.frankfurter.dev/v1/latest?from=EUR');
                    if (!response.ok) {
                         throw new Error(`API returned status ${response.status}`);
                    }
                    const data = await response.json();
                    ratesData = data.rates || {};

                    // 3. Store fresh data in LocalStorage
                    if (typeof window !== 'undefined') {
                        const newCache: CachedRates = {
                            timestamp: Date.now(),
                            rates: ratesData,
                        };
                        localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
                    }
                } catch (error) {
                    console.error("Error fetching or validating rates:", error);
                    // Handle failure: maybe load stale cache if fetch fails
                }
            }

            setExchangeRates(ratesData);
            setAvailableCurrencies(Object.keys(ratesData).sort());
        };

        fetchRates();
    }, []);

  // 4. Function to add a new currency
  const addCurrencyLine = () => {
    // Default to USD if available, otherwise pick the first available currency
    const newCode = availableCurrencies.includes('USD') ? 'USD' : (availableCurrencies[0] || 'USD');

    // Ensure unique ID
    const newId = currencyLines.length > 0 ? Math.max(...currencyLines.map(c => c.id)) + 1 : 1;

    // Calculate initial value based on EUR (assuming EUR line is always ID 1)
    const baseEuroValue = currencyLines.find(line => line.isBase)?.value || 1.00;
    const rate = exchangeRates[newCode] || 1;
    const initialValue = baseEuroValue * rate;

    setCurrencyLines(prev => [
      ...prev,
      { id: newId, code: newCode, value: parseFloat(initialValue.toFixed(4)), isBase: false },
    ]);
  };

  // 5. Main Conversion Function
  const updateValue = (id: number, newValueString: string) => {
    const newValue = parseFloat(newValueString) || 0;
    const lines = [...currencyLines];
    const updatedLineIndex = lines.findIndex(line => line.id === id);

    if (updatedLineIndex === -1) return;

    // Update the edited line's value
    lines[updatedLineIndex].value = newValue;

    const editedLine = lines[updatedLineIndex];

    // 1. Determine the value in EUR based on the edited line
    let valueInEUR: number;

    if (editedLine.isBase) {
      // If editing EUR (base), EUR value is the new value
      valueInEUR = editedLine.value;
    } else {
      // If editing another currency, calculate its EUR equivalent
      const rateToEUR = 1 / (exchangeRates[editedLine.code] || 1); // Use 1 as fallback
      valueInEUR = editedLine.value * rateToEUR;
    }

    // 2. Update all other lines
    lines.forEach(line => {
      if (line.id !== id) {
        if (line.isBase) {
          // If it's EUR, set to the calculated EUR value
          line.value = valueInEUR;
        } else {
          // Apply the conversion rate from EUR
          const rateFromEUR = exchangeRates[line.code] || 1;
          line.value = valueInEUR * rateFromEUR;
        }
      }
      // Round for display purposes
      line.value = parseFloat(line.value.toFixed(4));
    });

    setCurrencyLines(lines);
  };

  // 6. Function to update a currency line's code
    const updateCurrencyCode = (id: number, newCode: string) => {
      setCurrencyLines(prevLines => {
        const lines = [...prevLines];
        const lineIndex = lines.findIndex(line => line.id === id);

        if (lineIndex === -1) return prevLines;

        // 1. Update the code
        lines[lineIndex].code = newCode;

        // 2. Recalculate the value based on the base currency (EUR)
        const baseEuroValue = lines.find(line => line.isBase)?.value || 1.00;

        // Get the new rate for the selected code
        const newRateFromEUR = exchangeRates[newCode] || 1;

        // Calculate the new value for this specific line
        lines[lineIndex].value = parseFloat((baseEuroValue * newRateFromEUR).toFixed(4));

        // IMPORTANT: Since the base value (EUR) hasn't changed, we don't need to recalculate *all* other lines.

        return lines;
      });
    };

// 7. Function to remove a currency line
  const removeCurrencyLine = (id: number) => {
    setCurrencyLines(prevLines => {
      // Prevent deleting the base currency (EUR)
      if (prevLines.length <= 1) return prevLines;

      return prevLines.filter(line => line.id !== id);
    });
  };

  // The context value, ensuring it matches CurrencyContextType
  const contextValue: CurrencyContextType = {
    isDarkMode,
    toggleDarkMode,
    currencyLines,
    exchangeRates,
    availableCurrencies,
    addCurrencyLine,
    updateValue: (id, newValue) => updateValue(id, newValue),
    updateCurrencyCode,
    removeCurrencyLine,

  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use the context
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};