// frontend/src/app/context/CurrencyContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CurrencyLine, CurrencyContextType, CachedRates } from '../utils/types';
import {
    fetchExchangeRatesFawazahmed0
    // fetchExchangeRatesFrankFurterDev // to be used if we want to use FrankFurterDev
} from '@/lib/api';
import { arrayMove } from '@dnd-kit/sortable';
import {
  loadCurrencyLines,
  saveCurrencyLines,
  loadRatesCache,
  saveRatesCache,
} from '@/lib/currencyDB';

// Initialize the context with undefined or null, and use a type assertion
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Initial state for the currency lines (EUR is the base)
const initialCurrencyLines: CurrencyLine[] = [
  { id: 1, code: 'EUR', value: 1.00, isBase: true },
];

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  // 1. Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Initialize Theme on Mount
  useEffect(() => {
    // Check localStorage or System Preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle Function
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  // 2. Currency State
  const [currencyLines, setCurrencyLines] = useState<CurrencyLine[]>(initialCurrencyLines);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [currencyNames, setCurrencyNames] = useState<Record<string, string>>({});

  // New State: specific flag to track if we have loaded from IndexedDB yet
  const [isInitialized, setIsInitialized] = useState(false);

  // --- 3. PERSISTENCE LOGIC (Load & Save via IndexedDB) ---

  // A. LOAD STATE ON MOUNT
  useEffect(() => {
    const loadFromDB = async () => {
      const savedLines = await loadCurrencyLines();
      if (savedLines && Array.isArray(savedLines) && savedLines.length > 0) {
        setCurrencyLines(savedLines);
      }
      setIsInitialized(true);
    };

    loadFromDB();
  }, []);

  // B. SAVE STATE ON CHANGE (IndexedDB)
  useEffect(() => {
    const saveToDB = async () => {
      if (!isInitialized) return;
      await saveCurrencyLines(currencyLines);
    };
    saveToDB();
  }, [currencyLines, isInitialized]);

  // --- 4. Fetch Exchange Rates (Major Update with IndexedDB + TTL) ---
  useEffect(() => {
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        const loadAndFetchRates = async () => {
            let ratesData: Record<string, number> = {};
            let namesData: Record<string, string> = {};
            let isCacheValid = false;

            // 1. Check IndexedDB cache first
            const cached = await loadRatesCache();
            if (cached) {
                // Always use cached data if available (even if expired)
                ratesData = cached.rates;
                namesData = cached.names;

                // Check if cache is still valid (< 24h)
                if (Date.now() - cached.timestamp < ONE_DAY_MS) {
                    isCacheValid = true;
                    console.log("Using cached rates and names from IndexedDB.");
                } else {
                    console.log("IndexedDB cache expired (>24h), will try to refresh in background.");
                }
            }

            // 2. Fetch fresh data if cache is expired or missing
            if (!isCacheValid) {
                try {
                    console.log("Fetching fresh rates and names from Fawazahmed0 API...");

                    const apiData = await fetchExchangeRatesFawazahmed0();
                    ratesData = apiData.rates;
                    namesData = apiData.names;

                    // 3. Store fresh data in IndexedDB
                    if (Object.keys(ratesData).length > 0) {
                        const newCache: CachedRates = {
                            timestamp: Date.now(),
                            rates: ratesData,
                            names: namesData,
                        };
                        await saveRatesCache(newCache);
                        console.log("Rates cache updated in IndexedDB.");
                    }
                } catch (error) {
                    console.error("Failed to fetch fresh rates (will use stale cache if available).", error);
                    // If fetch fails, we keep the stale data from step 1
                }
            }

            // Only update state if we have valid data (stale or fresh)
            if (Object.keys(ratesData).length > 0) {
                setExchangeRates(ratesData);
                setCurrencyNames(namesData);
                setAvailableCurrencies(Object.keys(ratesData).sort());
            }
        };
        loadAndFetchRates();
    }, []);

  // --- 5. Action Functions ---
  const addCurrencyLine = (code?: string) => {
    // Use provided code, or default to USD if available, otherwise pick the first available currency
    const newCode = code || (availableCurrencies.includes('USD') ? 'USD' : (availableCurrencies[0] || 'USD'));

    // Check for duplicate to prevent adding the same currency twice
    if (currencyLines.some(line => line.code === newCode)) {
      console.warn(`Currency ${newCode} is already added. Skipping duplicate.`);
      return;
    }

    // Ensure unique ID
    const newId = currencyLines.length > 0 ? Math.max(...currencyLines.map(c => c.id)) + 1 : 1;

    // Calculate initial value based on EUR (assuming EUR line is always present)
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

  // 8. Function to be able to reorder currencies
  const reorderCurrencies = (oldIndex: number, newIndex: number) => {
    setCurrencyLines((items) => arrayMove(items, oldIndex, newIndex));
  };


  // The context value, ensuring it matches CurrencyContextType
  const contextValue: CurrencyContextType = {
    isDarkMode,
    toggleDarkMode,
    currencyLines,
    exchangeRates,
    availableCurrencies,
    currencyNames,
    addCurrencyLine,
    updateValue,
    updateCurrencyCode,
    removeCurrencyLine,
    reorderCurrencies,
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