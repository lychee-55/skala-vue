const WEATHER_STATUS_MAP = {
  clear: { type: 'clear', label: '맑음' },
  clouds: { type: 'clouds', label: '구름' },
  rain: { type: 'rain', label: '비' },
  drizzle: { type: 'rain', label: '비' },
  snow: { type: 'snow', label: '눈' },
  thunderstorm: { type: 'thunderstorm', label: '뇌우' },
}

const UNKNOWN_STATUS = { type: 'unknown', label: '알 수 없음' }

export const mapWeatherStatus = (openWeatherStatus) => {
  const status = String(openWeatherStatus || '').toLowerCase()
  return WEATHER_STATUS_MAP[status] || UNKNOWN_STATUS
}
