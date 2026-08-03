<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

import WeatherSearch from '@/components/weather/WeatherSearch.vue'
import WeatherSummary from '@/components/weather/WeatherSummary.vue'
import WeatherList from '@/components/weather/WeatherList.vue'
import WeatherStatus from '@/components/weather/WeatherStatus.vue'

// Reactive State
// 4일차 API 연동을 대비한 가상의 백엔드 데이터 배열 (v-for 및 :key 실습용)
const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    feelsLike: 30,
    humidity: 65,
    wind: 3,
    status: '맑음',
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    feelsLike: 25,
    humidity: 80,
    wind: 5,
    status: '비',
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    feelsLike: 28,
    humidity: 70,
    wind: 4,
    status: '구름',
  },
])

// 검색어 및 알림창 제어용 데이터 (v-model 대용 한글 처리 및 이벤트 실습용)
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// Computed
// 검색 결과 필터링
const filteredWeatherList = computed(() => {
  if (!searchQuery.value) {
    return weatherList.value
  }

  return weatherList.value.filter((city) => city.name.includes(searchQuery.value))
})

// 평균 온도
const averageTemp = computed(() => {
  const total = weatherList.value.reduce((sum, city) => sum + city.temp, 0)

  return Math.round(total / weatherList.value.length)
})

// 최고 온도 도시
const hottestCity = computed(() => {
  return weatherList.value.reduce((max, city) => (city.temp > max.temp ? city : max))
})

// 비 오는 지역 개수
const rainCityCount = computed(() => {
  return weatherList.value.filter((city) => city.status === '비').length
})

// Watch
// 선택 도시 변경 감지
watch(selectedCityInfo, (newValue) => {
  console.log('선택 도시 변경:', newValue)
})

// 검색어 변화 감지
watchEffect(() => {
  console.log('검색어 변경:', searchQuery.value)
})

// 카드 선택 이벤트
const selectCity = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}
</script>

<template>
  <div class="dashboard-wrapper">
    <h1>🌤 Weather Dashboard</h1>

    <WeatherSearch v-model="searchQuery" />

    <WeatherSummary
      :average-temp="averageTemp"
      :hottest-city="hottestCity"
      :rain-city-count="rainCityCount"
    />

    <WeatherList :weather-list="filteredWeatherList" @select-city="selectCity" />

    <WeatherStatus :message="selectedCityInfo" />
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 1000px;
  max-width: 95%;
  margin: 40px auto;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}
</style>
