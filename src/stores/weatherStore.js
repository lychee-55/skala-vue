import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchCities, fetchCurrentWeather, fetchFiveDayForecast } from '@/services/weatherApi'

const CITY_IDS = [
  '1835848', '1838524', '1835327', '1843561', '1841811', '1835235', '1833747', '1835553', '1846326',
  '1846266', '1845136', '1845604', '1845457', '1841066', '1846986', '1839071', '1842485',
]

export const useWeatherStore = defineStore('weather', () => {
  const cities = ref([])
  const selectedCity = ref(null)
  const currentWeather = ref(null)
  const forecast = ref([])
  const loading = ref({ weather: false, forecast: false })
  const error = ref({ weather: null, forecast: null })
  let latestWeatherRequest = 0
  let latestForecastRequest = 0

  const temperature = computed(() => currentWeather.value?.temp ?? 0)
  const weatherStatus = computed(() => currentWeather.value?.weather ?? null)
  const weatherClass = computed(() => weatherStatus.value?.type || 'unknown')

  const fetchForecast = async (cityId = selectedCity.value?.id) => {
    if (!cityId) return
    const requestId = ++latestForecastRequest
    loading.value.forecast = true
    error.value.forecast = null

    try {
      const result = await fetchFiveDayForecast(cityId)
      if (requestId === latestForecastRequest) forecast.value = result
    } catch (requestError) {
      if (requestId === latestForecastRequest) {
        forecast.value = []
        error.value.forecast = requestError.message
      }
    } finally {
      if (requestId === latestForecastRequest) loading.value.forecast = false
    }
  }

  const selectCity = async (cityOrId) => {
    const cityId = typeof cityOrId === 'object' ? cityOrId.id : cityOrId
    const city = typeof cityOrId === 'object' ? cityOrId : cities.value.find((item) => item.id === cityId)
    if (!city) return

    selectedCity.value = city
    currentWeather.value = city
    forecast.value = []
    await fetchForecast(city.id)
  }

  const fetchWeather = async (cityId) => {
    const requestId = ++latestWeatherRequest
    loading.value.weather = true
    error.value.weather = null

    try {
      if (cityId) {
        const city = await fetchCurrentWeather(cityId)
        if (requestId !== latestWeatherRequest) return null
        const index = cities.value.findIndex((item) => item.id === city.id)
        if (index >= 0) cities.value.splice(index, 1, city)
        else cities.value.push(city)
        await selectCity(city)
        return city
      }

      const result = await fetchCities(CITY_IDS)
      if (requestId !== latestWeatherRequest) return null
      cities.value = result
      const initialCity = result.find((city) => city.id === selectedCity.value?.id) || result[0]
      if (initialCity) await selectCity(initialCity)
      return initialCity
    } catch (requestError) {
      if (requestId !== latestWeatherRequest) return null
      error.value.weather = requestError.message
      if (cityId) {
        selectedCity.value = null
        currentWeather.value = null
        forecast.value = []
      }
      return null
    } finally {
      if (requestId === latestWeatherRequest) loading.value.weather = false
    }
  }

  return {
    cities,
    selectedCity,
    currentWeather,
    forecast,
    loading,
    error,
    temperature,
    weatherStatus,
    weatherClass,
    selectCity,
    fetchWeather,
    fetchForecast,
  }
})
