import React from 'react';
import { Globe } from 'lucide-react';

const CurrencySelector = ({ currency, onCurrencyChange }) => {
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', flag: '🇭🇰' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', flag: '🇵🇱' }
  ];

  const currentCurrency = currencies.find(c => c.code === currency) || currencies[0];

  return (
    <div className="relative" style={{ display: 'inline-block' }}>
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg bg-white/90 hover:bg-white"
        style={{
          background: 'linear-gradient(90deg, #f0fdf4 0%, #dbeafe 100%)',
          minWidth: 200,
          transition: 'box-shadow 0.2s',
        }}
      >
        {/* Show globe icon instead of flag or emoji */}
        <Globe size={22} style={{ marginRight: 6, color: '#10b981' }} />
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="appearance-none bg-transparent border-none outline-none text-base font-semibold cursor-pointer pr-8 text-green-900"
          style={{ width: '100%', minHeight: 32 }}
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.symbol} {curr.code} - {curr.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector; 