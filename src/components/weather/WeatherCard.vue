<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { formatTemperature } from '@/utils/temperature'

const configStore = useConfigStore()

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])

const weatherClass = computed(() => {
  return props.city.weather.type
})

const displayTemp = (rawTemp) => {
  return formatTemperature(rawTemp, configStore.unit)
}

const handleViewDetail = (id) => {
  emit('click-detail', id)
}
</script>

<template>
  <div class="weather-card" :class="weatherClass" @click="emit('select-card', city)">
    <div class="weather-header">
      <div class="cityset">
        <h4>
          {{ city.name }}
        </h4>
        <span class="badge">
          {{ city.weather.label }}
        </span>
      </div>

      <div class="weather-actions">
        <button
          type="button"
          :class="isFavorite ? 'favorite-btn-gold' : 'favorite-btn'"
          @click.stop="emit('toggle-favorite', city.id)"
        >
          {{ isFavorite ? '★' : '☆' }} 즐겨찾기
        </button>
      </div>
    </div>

    <div class="weather-info">
      <div class="weather-main">
        <div class="temperature" :class="{ 'temperature-hot': city.temp >= 35 }">
          {{ displayTemp(city.temp) }}
        </div>

        <div class="detail-info">
          <div>
            <span>체감</span>
            <strong>{{ displayTemp(city.feelsLike) }}</strong>
          </div>

          <div>
            <span>습도</span>
            <strong> {{ city.humidity }}% </strong>
          </div>
        </div>
      </div>

      <button type="button" @click.stop="handleViewDetail(city.id)">상세보기</button>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  padding: var(--spacing);
  border-radius: var(--radius);
  margin-bottom: 20px;
  cursor: pointer;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.weather-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.clear {
  background: linear-gradient(135deg, #fff59d, #e3f2fd);
}

.rain {
  background: linear-gradient(135deg, #9faab3, #e3f2fd);
}

.clouds {
  background: linear-gradient(135deg, #eff5f8, #eceff1);
}

.snow {
  background: linear-gradient(135deg, #dff2ff, #f9fcff);
}

.thunderstorm {
  background: linear-gradient(135deg, #6b7280, #c6d2e0);
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.cityset {
  display: flex;
  gap: 12px;
}

.weather-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.favorite-btn-gold {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(228, 157, 24, 0.4);
  background: #f5b431;
  color: #fefeff;
  cursor: pointer;
  font-weight: 700;
}

.favorite-btn {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(49, 50, 128, 0.4);
  background: rgba(255, 255, 255, 0.9);
  color: #283266;
  cursor: pointer;
  font-weight: 700;
}

h4 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #263238;
}

.badge {
  padding: 6px 14px;
  border-radius: 20px;
  background: white;
  color: #37474f;
  font-size: 14px;
  font-weight: bold;
}

.weather-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: var(--spacing);
}

.weather-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.temperature {
  font-size: 44px;
  font-weight: 700;
  color: #263238;
  line-height: 1;
}

.temperature-hot {
  background: linear-gradient(
    to bottom,
    #ff3838 0%,
    #ff5a5a 15%,
    #b34b4b 35%,
    #5b4141 55%,
    #263238 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-info div {
  display: flex;
  flex-direction: column;
}

.detail-info span {
  font-size: 13px;
  color: #546e7a;
}

.detail-info strong {
  font-size: 18px;
  color: #263238;
}

button {
  padding: 12px;
  border-radius: 18px;
  border: none;
  background: #263238;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
}

button:hover {
  background: #1565c0;
}
</style>
