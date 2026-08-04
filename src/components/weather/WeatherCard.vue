<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

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

const emit = defineEmits(['select', 'view-detail', 'toggle-favorite'])

// 날씨 상태별 class

const weatherClass = computed(() => {
  switch (props.city.status) {
    case '맑음':
      return 'clear'

    case '비':
      return 'rain'

    case '구름':
      return 'cloud'

    default:
      return ''
  }
})

const displayTemp = (rawTemp) => {
  return configStore.unit === 'fahrenheit' ? Math.round((rawTemp * 9) / 5 + 32) : rawTemp
}
</script>

<template>
  <div class="weather-card" :class="weatherClass" @click="emit('select')">
    <!-- 도시명 + 상태 -->
    <div class="weather-header">
      <div class="cityset">
        <h4>
          {{ city.name }}
        </h4>
        <span class="badge">
          {{ city.status }}
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

    <!-- 날씨 정보 영역 -->
    <div class="weather-info">
      <!-- 온도 + 상세정보 영역 -->
      <div class="weather-main">
        <!-- 현재 온도 -->
        <div class="temperature">
          {{ displayTemp(city.temp) }}
          <span>{{ configStore.unitSymbol }}</span>
        </div>

        <!-- 상세 정보 -->
        <div class="detail-info">
          <div>
            <span>체감</span>
            <strong> {{ displayTemp(city.feelsLike) }} {{ configStore.unitSymbol }} </strong>
          </div>

          <div>
            <span>습도</span>
            <strong> {{ city.humidity }}% </strong>
          </div>
        </div>
      </div>

      <!-- 오른쪽 버튼 -->
      <button type="button" @click.stop="emit('view-detail', city.id)">상세보기</button>
    </div>

    <!-- 버튼 -->
  </div>
</template>

<style scoped>
.weather-card {
  padding: 24px;
  border-radius: 24px;
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

.cloud {
  background: linear-gradient(135deg, #eff5f8, #eceff1);
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

/* 상태 badge */

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
  gap: 35px;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 35px;
}

/* 큰 온도 */
.temperature {
  font-size: 56px;
  font-weight: 700;
  color: #263238;
  line-height: 1;
}

.temperature span {
  font-size: 28px;
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
  /* margin-top: 25px; */
  /* max-width: 100%; */
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
