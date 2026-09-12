// frontend/lib/currencyDB.ts
import { openDB, DBSchema } from 'idb';
import { CurrencyLine, CachedRates } from '../app/utils/types';

interface CurrencyDB extends DBSchema {
  currencyLines: {
    key: string;
    value: CurrencyLine[];
  };
  ratesCache: {
    key: string;
    value: CachedRates;
  };
}

const DB_NAME = 'currency-converter-db';
const DB_VERSION = 1;
const CURRENCY_LINES_STORE = 'currencyLines';
const RATES_CACHE_STORE = 'ratesCache';
const CURRENCY_LINES_KEY = 'current';
const RATES_CACHE_KEY = 'rates';

let dbPromise: ReturnType<typeof openDB<CurrencyDB>> | null = null;

const getDB = () => {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<CurrencyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(CURRENCY_LINES_STORE)) {
          db.createObjectStore(CURRENCY_LINES_STORE);
        }
        if (!db.objectStoreNames.contains(RATES_CACHE_STORE)) {
          db.createObjectStore(RATES_CACHE_STORE);
        }
      },
    });
  }
  return dbPromise;
};

// --- Currency Lines ---

export const loadCurrencyLines = async (): Promise<CurrencyLine[] | null> => {
  const db = await getDB();
  if (!db) return null;

  try {
    return await db.get(CURRENCY_LINES_STORE, CURRENCY_LINES_KEY) ?? null;
  } catch (e) {
    console.error("Failed to load currency lines from IndexedDB", e);
    return null;
  }
};

export const saveCurrencyLines = async (lines: CurrencyLine[]): Promise<void> => {
  const db = await getDB();
  if (!db) return;

  try {
    await db.put(CURRENCY_LINES_STORE, lines, CURRENCY_LINES_KEY);
  } catch (e) {
    console.error("Failed to save currency lines to IndexedDB", e);
  }
};

// --- Rates Cache ---

export const loadRatesCache = async (): Promise<CachedRates | null> => {
  const db = await getDB();
  if (!db) return null;

  try {
    return await db.get(RATES_CACHE_STORE, RATES_CACHE_KEY) ?? null;
  } catch (e) {
    console.error("Failed to load rates cache from IndexedDB", e);
    return null;
  }
};

export const saveRatesCache = async (cache: CachedRates): Promise<void> => {
  const db = await getDB();
  if (!db) return;

  try {
    await db.put(RATES_CACHE_STORE, cache, RATES_CACHE_KEY);
  } catch (e) {
    console.error("Failed to save rates cache to IndexedDB", e);
  }
};