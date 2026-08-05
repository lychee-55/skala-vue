export const convertTemperature = (celsius, unit = 'celsius') => {
  if (typeof celsius !== 'number') return 0
  return unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius)
}

export const formatTemperature = (celsius, unit = 'celsius') => {
  const symbol = unit === 'fahrenheit' ? '℉' : '℃'
  return `${convertTemperature(celsius, unit)} ${symbol}`
}
