// Currency formatting utility functions

export const formatCurrency = (amount, currency = 'USD') => {
  const currencyOptions = {
    USD: { style: 'currency', currency: 'USD' },
    EUR: { style: 'currency', currency: 'EUR' },
    GBP: { style: 'currency', currency: 'GBP' },
    JPY: { style: 'currency', currency: 'JPY' },
    CAD: { style: 'currency', currency: 'CAD' },
    AUD: { style: 'currency', currency: 'AUD' },
    CHF: { style: 'currency', currency: 'CHF' },
    CNY: { style: 'currency', currency: 'CNY' },
    INR: { style: 'currency', currency: 'INR' },
    BRL: { style: 'currency', currency: 'BRL' },
    MXN: { style: 'currency', currency: 'MXN' },
    SGD: { style: 'currency', currency: 'SGD' },
    HKD: { style: 'currency', currency: 'HKD' },
    NOK: { style: 'currency', currency: 'NOK' },
    SEK: { style: 'currency', currency: 'SEK' },
    KRW: { style: 'currency', currency: 'KRW' },
    TRY: { style: 'currency', currency: 'TRY' },
    RUB: { style: 'currency', currency: 'RUB' },
    ZAR: { style: 'currency', currency: 'ZAR' },
    PLN: { style: 'currency', currency: 'PLN' }
  };

  const options = currencyOptions[currency] || currencyOptions.USD;
  
  try {
    return new Intl.NumberFormat('en-US', options).format(amount);
  } catch (error) {
    // Fallback to USD if there's an error
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
};

export const getCurrencySymbol = (currency = 'USD') => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
    INR: '₹',
    BRL: 'R$',
    MXN: '$',
    SGD: 'S$',
    HKD: 'HK$',
    NOK: 'kr',
    SEK: 'kr',
    KRW: '₩',
    TRY: '₺',
    RUB: '₽',
    ZAR: 'R',
    PLN: 'zł'
  };
  
  return symbols[currency] || '$';
};

export const getCurrencyName = (currency = 'USD') => {
  const names = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    CAD: 'Canadian Dollar',
    AUD: 'Australian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    INR: 'Indian Rupee',
    BRL: 'Brazilian Real',
    MXN: 'Mexican Peso',
    SGD: 'Singapore Dollar',
    HKD: 'Hong Kong Dollar',
    NOK: 'Norwegian Krone',
    SEK: 'Swedish Krona',
    KRW: 'South Korean Won',
    TRY: 'Turkish Lira',
    RUB: 'Russian Ruble',
    ZAR: 'South African Rand',
    PLN: 'Polish Złoty'
  };
  
  return names[currency] || 'US Dollar';
}; 