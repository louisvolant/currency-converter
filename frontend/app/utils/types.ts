// frontend/src/app/utils/types.ts

// Define the structure for a single currency line in the converter
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
  addCurrencyLine: (code?: string) => void;
  updateValue: (id: number, newValue: string) => void;
  updateCurrencyCode: (id: number, newCode: string) => void;
  removeCurrencyLine: (id: number) => void;
}