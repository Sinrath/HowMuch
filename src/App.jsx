import { useState, useEffect } from 'react'

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'BWP', name: 'Botswana Pula', symbol: 'P', flag: '🇧🇼' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' }
]

function App() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [exchangeRates, setExchangeRates] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchExchangeRates = async (baseCurrency) => {
    if (!amount || !baseCurrency) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
      const data = await response.json()
      setExchangeRates(data.rates)
    } catch (err) {
      setError('Failed to fetch exchange rates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (amount && fromCurrency) {
      fetchExchangeRates(fromCurrency)
    }
  }, [fromCurrency, amount])

  const convertedAmounts = currencies
    .filter(currency => currency.code !== fromCurrency)
    .map(currency => ({
      ...currency,
      convertedAmount: amount && exchangeRates[currency.code] 
        ? (parseFloat(amount) * exchangeRates[currency.code]).toFixed(2)
        : '0.00'
    }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">HowMuch</h1>
          <p className="text-gray-600">Currency Converter</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Currency
              </label>
              <div className="relative">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg appearance-none bg-white pr-10"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {amount && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Converted Amounts
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {convertedAmounts.map(currency => (
                  <div
                    key={currency.code}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-200 transition-all duration-200 bg-white"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xl">{currency.flag}</span>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{currency.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{currency.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600 whitespace-nowrap">
                          {currency.symbol} {currency.convertedAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App