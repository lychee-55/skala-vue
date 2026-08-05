import axios from 'axios'
import { mapWeatherStatus } from '@/utils/weatherMapper'

const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
})

const KOREAN_CITY_NAMES = {
  1835848: '서울',
  1838524: '부산',
  1835327: '대구',
  1843561: '인천',
  1841811: '광주',
  1835235: '대전',
  1833747: '울산',
  1835553: '수원',
  1846326: '창원',
  1846266: '제주',
  1845136: '춘천',
  1845604: '청주',
  1845457: '전주',
  1841066: '목포',
  1846986: '안동',
  1839071: '포항',
  1842485: '고양',
}

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  if (!apiKey) throw new Error('OpenWeather API key is not configured.')
  return apiKey
}

const mapCity = (item) => ({
  id: String(item.id),
  name: KOREAN_CITY_NAMES[item.id] || item.name,
  temp: Math.round(item.main.temp),
  feelsLike: Math.round(item.main.feels_like),
  humidity: item.main.humidity,
  wind: item.wind.speed,
  weather: mapWeatherStatus(item.weather?.[0]?.main),
  description: item.weather?.[0]?.description || '',
})

const toWeatherError = (error) => {
  if (axios.isAxiosError(error)) {
    return new Error(error.response?.data?.message || '날씨 정보를 불러오지 못했습니다.')
  }
  return error instanceof Error ? error : new Error('날씨 정보를 불러오지 못했습니다.')
}

const withApiError = async (request) => {
  try {
    return await request()
  } catch (error) {
    throw toWeatherError(error)
  }
}

export const fetchCurrentWeather = (cityId) =>
  withApiError(async () => {
    const { data } = await weatherClient.get('/weather', {
      params: { id: cityId, units: 'metric', lang: 'kr', appid: getApiKey() },
    })
    return mapCity(data)
  })

// `/group` endpoint is not available for every API key/plan.
// Use the verified Current Weather endpoint for each configured city instead.
export const fetchCities = async (cityIds) => {
  const results = await Promise.allSettled(cityIds.map((cityId) => fetchCurrentWeather(cityId)))
  const cities = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)

  if (!cities.length) {
    const failure = results.find((result) => result.status === 'rejected')
    throw failure?.reason || new Error('도시 날씨 정보를 불러오지 못했습니다.')
  }

  return cities
}

export const fetchFiveDayForecast = (cityId) =>
  withApiError(async () => {
    const { data } = await weatherClient.get('/forecast', {
      params: { id: cityId, units: 'metric', lang: 'kr', appid: getApiKey() },
    })

    const dates = new Set()
    return (data.list || []).reduce((days, item) => {
      const date = item.dt_txt?.split(' ')[0]
      if (!date || dates.has(date) || days.length >= 5) return days

      dates.add(date)
      days.push({
        date,
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        weather: mapWeatherStatus(item.weather?.[0]?.main),
        description: item.weather?.[0]?.description || '',
      })
      return days
    }, [])
  })
