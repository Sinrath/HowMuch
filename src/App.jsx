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
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'BWP', name: 'Botswana Pula', symbol: 'P', flag: '🇧🇼' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' }
]

function App() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [exchangeRates, setExchangeRates] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const fetchExchangeRates = async (baseCurrency) => {
    if (!amount || !baseCurrency) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
      const data = await response.json()
      
      setExchangeRates(data.rates)
      setLastUpdated(data.date)
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
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 relative">
          <button
            onClick={toggleDarkMode}
            className="absolute top-0 right-0 p-2 rounded-lg bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">HowMuch</h1>
          <p className="text-gray-600 dark:text-gray-300">Currency Converter</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-colors">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg transition-colors"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Currency
              </label>
              <div className="relative">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg appearance-none bg-white pr-10 transition-colors"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded transition-colors">
              {error}
            </div>
          )}

          {lastUpdated && (
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center transition-colors">
              Exchange rates last updated: {lastUpdated}
            </div>
          )}
        </div>

        {amount && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
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
                    onClick={() => setFromCurrency(currency.code)}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md hover:border-blue-200 dark:hover:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xl">{currency.flag}</span>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white text-sm">{currency.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{currency.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
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