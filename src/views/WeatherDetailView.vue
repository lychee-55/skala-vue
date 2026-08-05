<script setup>
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useWeatherStore } from '@/stores/weatherStore'
import WeatherPanel from '@/components/weather/WeatherPanel.vue'

const route = useRoute()
const weatherStore = useWeatherStore()
const { currentWeather } = storeToRefs(weatherStore)
const loadCity = (cityId = route.params.cityId) => {
  if (currentWeather.value?.id === cityId) return
  return weatherStore.fetchWeather(cityId)
}

onMounted(loadCity)
watch(
  () => route.params.cityId,
  (cityId) => loadCity(cityId),
)
</script>

<template>
  <WeatherPanel detailed />
</template>
