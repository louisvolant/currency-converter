// frontend/src/lib/api.ts

// Define the structure of the response from frankfurter.dev (old API)
interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

// Define the structure of the response for the rates from fawazahmed0 (new API)
interface FawazahmedRatesResponse {
  date: string;
  eur: Record<string, number>; // Rates against the base 'eur'
}

// Define the structure for the currencies list (new API)
interface FawazahmedCurrenciesListResponse extends Record<string, string> {}


// --- FRANKFURTER API FUNCTION ---

/**
 * Fetches the latest exchange rates from the Frankfurter API, using EUR as the base.
 * @returns A promise that resolves to a record of currency codes to their exchange rate relative to EUR.
 */
export async function fetchExchangeRatesFrankFurterDev(): Promise<Record<string, number>> {
    const API_URL = 'https://api.frankfurter.dev/v1/latest?from=EUR';

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Frankfurter API returned status ${response.status}: ${response.statusText}`);
        }

        const data: FrankfurterResponse = await response.json();

        return {
            ...data.rates,
            [data.base]: 1, // Ensure EUR is present with rate 1
        };

    } catch (error) {
        console.error("Error fetching rates from Frankfurter:", error);
        throw error;
    }
}


// --- FAWAZAHMED0 API FUNCTION (NEW) ---

/**
 * Fetches the latest exchange rates from the Fawazahmed0 API.
 * It combines the list of all currencies and their rates against EUR.
 * @returns A promise that resolves to a record of currency codes to their exchange rate relative to EUR.
 */
export async function fetchExchangeRatesFawazahmed0(): Promise<Record<string, number>> {
    const RATES_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json';

    try {
        // We only need the rates URL for the rate data
        const response = await fetch(RATES_URL);

        if (!response.ok) {
            throw new Error(`Fawazahmed0 API returned status ${response.status}: ${response.statusText}`);
        }

        const data: FawazahmedRatesResponse = await response.json();

        // The data structure is { "date": ..., "eur": { "usd": 1.08, ... } }
        // We return the inner 'eur' object as the rates map.
        const rates = data.eur || {};

        // The API provides the rates in lowercase (e.g., 'usd', 'eur').
        // We need to convert the keys to uppercase to match your existing currency codes (EUR, USD, etc.)
        const uppercaseRates: Record<string, number> = {};
        for (const [code, rate] of Object.entries(rates)) {
            uppercaseRates[code.toUpperCase()] = rate;
        }

        return uppercaseRates;

    } catch (error) {
        console.error("Error fetching rates from Fawazahmed0:", error);
        throw error;
    }
}
