<script setup>
import WeatherCard from './WeatherCard.vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

defineProps({
  weatherList: {
    type: Array,
    required: true,
  },
  weatherStatusFilter: {
    type: String,
    default: 'all',
  },
  filterOnlyFavorites: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'select-city',
  'view-detail',
  'toggle-favorite',
  'update:weather-status-filter',
  'toggle-favorites-only',
])
</script>

<template>
  <section class="list-box panel-box">
    <div class="list-header">
      <h3>🏙 지역별 날씨</h3>
      <div class="list-filters">
        <div class="status-filters">
          <button
            :class="{ active: weatherStatusFilter === 'all' }"
            type="button"
            @click="emit('update:weather-status-filter', 'all')"
          >
            전체
          </button>
          <button
            :class="{ active: weatherStatusFilter === '맑음' }"
            type="button"
            @click="emit('update:weather-status-filter', '맑음')"
          >
            맑음
          </button>
          <button
            :class="{ active: weatherStatusFilter === '비' }"
            type="button"
            @click="emit('update:weather-status-filter', '비')"
          >
            비
          </button>
          <button
            :class="{ active: weatherStatusFilter === '구름' }"
            type="button"
            @click="emit('update:weather-status-filter', '구름')"
          >
            구름
          </button>
        </div>

        <div class="favorite-filter-wrapper">
          <button
            class="favorite-filter-btn"
            :class="{ active: filterOnlyFavorites }"
            type="button"
            @click="emit('toggle-favorites-only')"
          >
            {{ filterOnlyFavorites ? '전체 보기' : '즐겨찾기만 보기' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="weatherList.length">
      <WeatherCard
        v-for="city in weatherList"
        :key="city.id"
        :city="city"
        :is-favorite="configStore.isFavorite(city.id)"
        @select="emit('select-city', city)"
        @view-detail="emit('view-detail', $event)"
        @toggle-favorite="emit('toggle-favorite', $event)"
      />
    </div>

    <p v-else class="empty">검색 결과가 없습니다.</p>
  </section>
</template>

<style scoped>
.list-box {
  background: #f8fafc;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.list-header h3 {
  margin: 0;
}

.list-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  /* width: 100%; */
}

.status-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.status-filters button,
.favorite-filter-btn {
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid #d0d7de;
  background: #ffffff;
  color: #2c3e50;
  cursor: pointer;
  font-weight: 700;
}

.status-filters button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.favorite-filter-btn {
  min-width: 170px;
}

/* .favorite-filter-btn.active {
  background: #f5b431;
  color: #2c3e50;
  border-color: #f5b431;
} */

.favorite-filter-wrapper {
  margin-left: auto;
}

.empty {
  text-align: center;
  color: #78909c;
  padding: 20px;
}
</style>
