// frontend/src/app/utils/types.ts

export interface CurrencyLine {
  id: number;
  code: string;
  value: number;
  isBase: boolean;
}

// Define the structure for the Currency Context state
export interface CurrencyContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currencyLines: CurrencyLine[];
  exchangeRates: Record<string, number>;
  availableCurrencies: string[];
  currencyNames: Record<string, string>;
  addCurrencyLine: (code?: string) => void;
  updateValue: (id: number, newValue: string) => void;
  updateCurrencyCode: (id: number, newCode: string) => void;
  removeCurrencyLine: (id: number) => void;
}

// Define the structure for cached data
export interface CachedRates {
    timestamp: number;
    rates: Record<string, number>;
    names: Record<string, string>;
}