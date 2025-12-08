// frontend/src/app/utils/currencyData.ts

// Mapping of currencies with their names and flag emojis (for reference)
export const currencyDetails: Record<string, { name: string, flag: string }> = {
    // Already defined
    'EUR': { name: 'Euro', flag: '🇪🇺' },
    'USD': { name: 'US Dollar', flag: '🇺🇸' },
    'GBP': { name: 'British Pound', flag: '🇬🇧' },
    'JPY': { name: 'Japanese Yen', flag: '🇯🇵' },
    'CAD': { name: 'Canadian Dollar', flag: '🇨🇦' },
    'AUD': { name: 'Australian Dollar', flag: '🇦🇺' },
    'BGN': { name: 'Bulgarian Lev', flag: '🇧🇬' },
    'BRL': { name: 'Brazilian Real', flag: '🇧🇷' },
    'CHF': { name: 'Swiss Franc', flag: '🇨🇭' },
    'CNY': { name: 'Chinese Yuan', flag: '🇨🇳' },
    'CZK': { name: 'Czech Koruna', flag: '🇨🇿' },
    'DKK': { name: 'Danish Krone', flag: '🇩🇰' },
    'HKD': { name: 'Hong Kong Dollar', flag: '🇭🇰' },
    'HUF': { name: 'Hungarian Forint', flag: '🇭🇺' },
    'IDR': { name: 'Indonesian Rupiah', flag: '🇮🇩' },
    'ILS': { name: 'Israeli New Shekel', flag: '🇮🇱' },
    'INR': { name: 'Indian Rupee', flag: '🇮🇳' },
    'ISK': { name: 'Icelandic Króna', flag: '🇮🇸' },
    'KRW': { name: 'South Korean Won', flag: '🇰🇷' },
    'MXN': { name: 'Mexican Peso', flag: '🇲🇽' },
    'MYR': { name: 'Malaysian Ringgit', flag: '🇲🇾' },
    'NOK': { name: 'Norwegian Krone', flag: '🇳🇴' },
    'NZD': { name: 'New Zealand Dollar', flag: '🇳🇿' },
    'PHP': { name: 'Philippine Peso', flag: '🇵🇭' },
    'PLN': { name: 'Polish Złoty', flag: '🇵🇱' },
    'RON': { name: 'Romanian Leu', flag: '🇷🇴' },
    'SEK': { name: 'Swedish Krona', flag: '🇸🇪' },
    'SGD': { name: 'Singapore Dollar', flag: '🇸🇬' },
    'THB': { name: 'Thai Baht', flag: '🇹🇭' },
    'TRY': { name: 'Turkish Lira', flag: '🇹🇷' },
    'ZAR': { name: 'South African Rand', flag: '🇿🇦' },
};

// Function to get the country code for FlagCDN
export const getCountryCode = (currencyCode: string): string => {
    // Special cases where currency code != standard country code
    switch (currencyCode) {
        case 'EUR': return 'eu'; // European Union flag
        case 'GBP': return 'gb'; // Great Britain
        case 'DKK': return 'dk'; // Denmark
        case 'CHF': return 'ch'; // Switzerland (Confoederatio Helvetica)
        case 'CNY': return 'cn'; // China (Yuan is linked to China)
        case 'HKD': return 'hk'; // Hong Kong
        case 'MYR': return 'my'; // Malaysia
        case 'NZD': return 'nz'; // New Zealand
        case 'SGD': return 'sg'; // Singapore
        case 'ZAR': return 'za'; // South Africa

        // Case where the first two letters of the code work as the country code
        default:
            return currencyCode.substring(0, 2).toLowerCase();
    }
};