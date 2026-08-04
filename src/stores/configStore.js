import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const FAVORITES_STORAGE_KEY = 'skala-weather-favorites'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')
  const favoriteCities = ref(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]') || [])

  const unitSymbol = computed(() => {
    return unit.value === 'fahrenheit' ? '℉' : '℃'
  })

  const toggleUnit = () => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  const isFavorite = (cityId) => {
    return favoriteCities.value.includes(cityId)
  }

  const toggleFavorite = (cityId) => {
    const index = favoriteCities.value.indexOf(cityId)
    if (index >= 0) {
      favoriteCities.value.splice(index, 1)
    } else {
      favoriteCities.value.push(cityId)
    }
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteCities.value))
  }

  return {
    unit,
    unitSymbol,
    favoriteCities,
    toggleUnit,
    isFavorite,
    toggleFavorite,
  }
})
