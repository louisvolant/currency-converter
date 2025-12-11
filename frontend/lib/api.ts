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

// --- NEW/UPDATED EXPORT TYPES ---
export interface CurrencyNameMap {
    [code: string]: string; // e.g., 'USD': 'United States Dollar'
}
export interface ExchangeData {
    rates: Record<string, number>;
    names: CurrencyNameMap;
}

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
 * Fetches the latest exchange rates and currency names from the Fawazahmed0 API.
 * It filters the results to only include 3-letter codes.
 * @returns A promise that resolves to an object containing filtered rates and names.
 */
export async function fetchExchangeRatesFawazahmed0(): Promise<ExchangeData> {
    const RATES_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json';
    const NAMES_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json';

    try {
        // Fetch rates and names in parallel
        const [ratesResponse, namesResponse] = await Promise.all([
            fetch(RATES_URL),
            fetch(NAMES_URL),
        ]);

        if (!ratesResponse.ok) {
            throw new Error(`Fawazahmed0 Rates API returned status ${ratesResponse.status}: ${ratesResponse.statusText}`);
        }
        if (!namesResponse.ok) {
            throw new Error(`Fawazahmed0 Names API returned status ${namesResponse.status}: ${namesResponse.statusText}`);
        }

        const ratesData: FawazahmedRatesResponse = await ratesResponse.json();
        const namesData: FawazahmedCurrenciesListResponse = await namesResponse.json();

        const rawRates = ratesData.eur || {};
        const rawNames = namesData || {};

        const filteredRates: Record<string, number> = {};
        const filteredNames: CurrencyNameMap = {};

        // Combine, convert to uppercase, and filter to 3-letter codes
        for (const [codeLower, rate] of Object.entries(rawRates)) {
            const codeUpper = codeLower.toUpperCase();

            // 1. Filter: Check for 3-letter code
            if (codeUpper.length === 3) {
                // 2. Add Rate
                filteredRates[codeUpper] = rate;

                // 3. Add Name (from the other endpoint)
                // Use the name from the names endpoint, falling back to a default if not found
                filteredNames[codeUpper] = rawNames[codeLower] || codeUpper;
            }
        }

        return {
            rates: filteredRates,
            names: filteredNames
        };

    } catch (error) {
        console.error("Error fetching data from Fawazahmed0:", error);
        throw error;
    }
}