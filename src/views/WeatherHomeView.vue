<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { ElOption, ElSelect } from 'element-plus'
import 'element-plus/es/components/select/style/css'

import BaseDashboardCard from '@/components/BaseDashboardCard.vue'
import SearchBar from '@/components/weather/SearchBar.vue'
import WeatherList from '@/components/weather/WeatherList.vue'
import WeatherNationalSummary from '@/components/weather/WeatherNationalSummary.vue'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const { cities } = storeToRefs(weatherStore)

const searchQuery = ref('')
const filterOnlyFavorites = ref(false)
const weatherStatusFilter = ref('all')

const filteredCities = computed(() => {
  let result = cities.value
  if (filterOnlyFavorites.value) {
    result = result.filter((city) => configStore.isFavorite(city.id))
  }
  if (weatherStatusFilter.value !== 'all') {
    result = result.filter((city) => city.weather.type === weatherStatusFilter.value)
  }
  if (!searchQuery.value) {
    return result
  }
  return result.filter((city) => city.name.includes(searchQuery.value))
})

const selectCity = (city) => {
  weatherStore.selectCity(city)
  if (route.name === 'weather-detail') router.push({ name: 'dashboard' })
}

const viewDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}

const toggleFavorite = (cityId) => {
  configStore.toggleFavorite(cityId)
}

const loadCityList = () => {
  if (!route.params.cityId && !cities.value.length) weatherStore.fetchWeather()
}

onMounted(loadCityList)
watch(
  () => route.params.cityId,
  () => loadCityList(),
)
</script>

<template>
  <section class="weather-home">
    <BaseDashboardCard>
      <WeatherNationalSummary :cities="cities" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <SearchBar :query="searchQuery" @update-query="searchQuery = $event" />
    </BaseDashboardCard>

    <BaseDashboardCard class="city-list-card">
      <div class="list-filters">
        <ElSelect v-model="weatherStatusFilter" class="status-select" aria-label="날씨 상태 필터">
          <ElOption label="전체 날씨" value="all" />
          <ElOption label="맑음" value="clear" />
          <ElOption label="구름" value="clouds" />
          <ElOption label="비" value="rain" />
        </ElSelect>
        <button type="button" @click="filterOnlyFavorites = !filterOnlyFavorites">
          {{ filterOnlyFavorites ? '전체 보기' : '즐겨찾기' }}
        </button>
      </div>

      <WeatherList
        :weather-list="filteredCities"
        @select-card="selectCity"
        @click-detail="viewDetail"
        @toggle-favorite="toggleFavorite"
      />
    </BaseDashboardCard>
  </section>
</template>

<style scoped>
.weather-home {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 16px;
  overflow: hidden;
}

.weather-home :deep(.list-box) {
  flex: 1;
}

.weather-home > .dashboard-card {
  flex: 0 0 auto;
}

.weather-home > .dashboard-card + .dashboard-card {
  margin-top: var(--spacing-sm);
}

.weather-home > .city-list-card {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  padding: var(--spacing-sm);
}

.list-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

button {
  min-height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  font-weight: 700;
}

.status-select {
  flex: 1;
  min-width: 0;
}

.status-select :deep(.el-select__wrapper) {
  min-height: 36px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--color-border) inset;
}

.status-select :deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}

button {
  padding: 0 12px;
}

button.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
}

@media (max-width: 800px) {
  .weather-home { overflow: hidden; }

  .weather-home > .city-list-card {
    height: auto;
    flex: 1 1 auto;
  }

  .weather-home :deep(.list-box) { max-height: none; }
  .weather-home :deep(.weather-card) { min-height: 118px; }
}
</style>
