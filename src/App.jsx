import { useState, useEffect } from 'react'

const currencies = [
  { code: 'BWP', name: 'Botswana Pula', symbol: 'P', flag: '🇧🇼' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' }
]

function App() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('CHF')
  const [exchangeRates, setExchangeRates] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  const fetchExchangeRates = async (baseCurrency) => {
    if (!amount || !baseCurrency) return

    setLoading(true)
    setError('')

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || ''

      // Get all currency codes except the base currency
      const targetCurrencies = currencies
        .filter(currency => currency.code !== baseCurrency)
        .map(currency => currency.code)

      // Use the backend API for each target currency
      const conversionPromises = targetCurrencies.map(async (targetCurrency) => {
        const response = await fetch(`${backendUrl}/api/convert?from=${baseCurrency}&to=${targetCurrency}&amount=${amount}`)
        const data = await response.json()

        if (data.success) {
          return { currency: targetCurrency, rate: data.rate }
        } else {
          throw new Error(data.error || 'Conversion failed')
        }
      })

      const conversions = await Promise.all(conversionPromises)

      // Convert array to rates object
      const rates = {}
      conversions.forEach(({ currency, rate }) => {
        rates[currency] = rate
      })

      setExchangeRates(rates)
      setLastUpdated(new Date().toLocaleString())
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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  const convertedAmounts = currencies
    .filter(currency => currency.code !== fromCurrency)
    .map(currency => {
      const currentRate = exchangeRates[currency.code]

      return {
        ...currency,
        convertedAmount: amount && currentRate
          ? (parseFloat(amount) * currentRate).toFixed(2)
          : '0.00'
      }
    })

  return (
    <div className={`min-h-screen px-3 py-4 transition-colors ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 relative">
          <button
            onClick={toggleDarkMode}
            className={`absolute top-0 right-0 w-10 h-10 rounded shadow-md hover:shadow-lg transition-all border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-200'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <h1 className={`text-3xl md:text-4xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>HowMuch</h1>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Currency Converter</p>
        </div>

        <div className={`rounded-lg shadow-lg p-4 md:p-6 mb-6 transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="space-y-4 md:flex md:flex-row md:gap-4 md:items-end md:space-y-0">
            <div className="w-full md:flex-1">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg transition-colors ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              />
            </div>

            <div className="w-full md:flex-1">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                From Currency
              </label>
              <div className="relative">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg appearance-none pr-10 transition-colors ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className={`mt-4 p-3 border rounded transition-colors ${darkMode ? 'bg-red-900 border-red-600 text-red-300' : 'bg-red-100 border-red-400 text-red-700'}`}>
              {error}
            </div>
          )}

          {lastUpdated && (
            <div className={`mt-4 text-sm text-center transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Last fetched: {lastUpdated}
            </div>
          )}
        </div>

        {amount && (
          <div className={`rounded-lg shadow-lg p-4 md:p-6 transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-lg md:text-xl font-semibold mb-3 md:mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Converted Amounts
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {convertedAmounts.map(currency => (
                  <div
                    key={currency.code}
                    onClick={() => setFromCurrency(currency.code)}
                    className={`p-3 md:p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer ${darkMode ? 'border-gray-600 bg-gray-700 hover:border-blue-400 hover:bg-gray-600' : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50'}`}
                  >
                    <div className="flex items-center justify-between gap-2 md:gap-4">
                      <div className="flex items-center gap-2 md:gap-3 flex-1">
                        <span className="text-lg md:text-xl">{currency.flag}</span>
                        <div>
                          <p className={`font-medium text-xs md:text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{currency.name}</p>
                          <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{currency.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-base md:text-lg font-bold whitespace-nowrap ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
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
