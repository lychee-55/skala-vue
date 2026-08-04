<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

import WeatherSearch from '@/components/weather/WeatherSearch.vue'
import WeatherSummary from '@/components/weather/WeatherSummary.vue'
import WeatherList from '@/components/weather/WeatherList.vue'
import WeatherStatus from '@/components/weather/WeatherStatus.vue'

const router = useRouter()
const configStore = useConfigStore()

const searchQuery = ref('')
const filterOnlyFavorites = ref(false)
const weatherStatusFilter = ref('all')
const cities = ref([])
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const filteredCities = computed(() => {
  let result = cities.value
  if (filterOnlyFavorites.value) {
    result = result.filter((city) => configStore.isFavorite(city.id))
  }
  if (weatherStatusFilter.value !== 'all') {
    result = result.filter((city) => city.status === weatherStatusFilter.value)
  }
  if (!searchQuery.value) {
    return result
  }
  return result.filter((city) => city.name.includes(searchQuery.value))
})

const averageTemp = computed(() => {
  if (!filteredCities.value.length) return 0
  const sum = filteredCities.value.reduce((sum, city) => sum + city.temp, 0)
  return Math.round(sum / filteredCities.value.length)
})

const hottestCity = computed(() => {
  return (
    filteredCities.value.reduce(
      (max, city) => (city.temp > max.temp ? city : max),
      filteredCities.value[0] || { name: '-', temp: 0, status: '-', feelsLike: 0 },
    ) || { name: '-', temp: 0, status: '-', feelsLike: 0 }
  )
})

// const displayTemp = (rawTemp) => {
//   if (configStore.unit === 'fahrenheit') {
//     return Math.round((rawTemp * 9) / 5 + 32)
//   }
//   return rawTemp
// }

const loadWeatherData = async () => {
  try {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
    if (!apiKey) {
      throw new Error('OpenWeather API key missing')
    }
    console.log(apiKey)
    const response = await axios.get('https://api.openweathermap.org/data/2.5/group', {
      params: {
        id: '1835848,1835235,1835553,1833744,1835327',
        units: 'metric',
        appid: apiKey,
      },
    })
    cities.value = response.data.list.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      wind: item.wind.speed,
      status: item.weather[0]?.main || '맑음',
    }))
  } catch (error) {
    console.error('API 불러오기 실패, mock data 사용', error)
    cities.value = [
      {
        id: '1835848',
        name: '서울',
        temp: 28,
        feelsLike: 30,
        humidity: 65,
        wind: 3,
        status: '맑음',
      },
      {
        id: '1835235',
        name: '수원',
        temp: 24,
        feelsLike: 25,
        humidity: 80,
        wind: 5,
        status: '비',
      },
      {
        id: '1835553',
        name: '부산',
        temp: 26,
        feelsLike: 28,
        humidity: 70,
        wind: 4,
        status: '구름',
      },
    ]
  }
}

const selectCity = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

const viewDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}

const toggleFavorite = (cityId) => {
  configStore.toggleFavorite(cityId)
}

onMounted(loadWeatherData)
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="top-bar">
      <h1>🌤 Weather Dashboard</h1>
    </div>

    <WeatherSummary
      :average-temp="averageTemp"
      :hottest-city="hottestCity"
      :rain-city-count="filteredCities.filter((city) => city.status === '비').length"
    />

    <WeatherSearch v-model="searchQuery" />

    <WeatherList
      :weather-list="filteredCities"
      :weather-status-filter="weatherStatusFilter"
      :filter-only-favorites="filterOnlyFavorites"
      @select-city="selectCity"
      @view-detail="viewDetail"
      @toggle-favorite="toggleFavorite"
      @update:weather-status-filter="(value) => (weatherStatusFilter = value)"
      @toggle-favorites-only="() => (filterOnlyFavorites = !filterOnlyFavorites)"
    />

    <WeatherStatus :message="selectedCityInfo" />
  </div>
</template>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.top-actions {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 12px;
}

.top-actions button {
  padding: 10px 16px;
  border-radius: 14px;
  border: 1px solid #3498db;
  background: #ffffff;
  color: #3498db;
  cursor: pointer;
  font-weight: 700;
}
</style>
