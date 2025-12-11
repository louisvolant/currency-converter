// frontend/src/lib/api.ts

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>; // e.g., { 'USD': 1.08, 'GBP': 0.85, ... }
}

/**
 * Fetches the latest exchange rates from the Frankfurter API, using EUR as the base.
 * @returns A promise that resolves to a record of currency codes to their exchange rate relative to EUR.
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
    const API_URL = 'https://api.frankfurter.dev/v1/latest?from=EUR';
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            // Throw a specific error if the response status is not OK (e.g., 404, 500)
            throw new Error(`API returned status ${response.status}: ${response.statusText}`);
        }

        const data: FrankfurterResponse = await response.json();

        // The API returns rates, but typically omits the base currency (EUR) at rate 1.
        // We ensure EUR is always present with a rate of 1 for internal calculations.
        return {
            ...data.rates,
            [data.base]: 1, // Add the base currency (EUR) itself with rate 1
        };

    } catch (error) {
        console.error("Error fetching rates in api.ts:", error);
        // Re-throw the error or return an empty object to handle failure gracefully in the context
        throw error;
    }
}
