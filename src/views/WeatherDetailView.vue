<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityItem = ref(null)
const cityId = route.params.cityId

const mockCities = [
  {
    id: '1835848',
    name: '서울',
    temp: 28,
    feelsLike: 30,
    humidity: 65,
    wind: 3,
    status: '맑음',
    description: '맑고 쾌청한 날씨입니다.',
  },
  {
    id: '1835235',
    name: '수원',
    temp: 24,
    feelsLike: 25,
    humidity: 80,
    wind: 5,
    status: '비',
    description: '비가 내리고 있습니다.',
  },
  {
    id: '1835553',
    name: '부산',
    temp: 26,
    feelsLike: 28,
    humidity: 70,
    wind: 4,
    status: '구름',
    description: '구름이 많습니다.',
  },
]

const displayTemp = computed(() => {
  if (!cityItem.value) return 0
  const rawTemp = cityItem.value.temp
  return configStore.unit === 'fahrenheit' ? Math.round((rawTemp * 9) / 5 + 32) : rawTemp
})

const displayFeelsLike = computed(() => {
  if (!cityItem.value) return 0
  const rawTemp = cityItem.value.feelsLike
  return configStore.unit === 'fahrenheit' ? Math.round((rawTemp * 9) / 5 + 32) : rawTemp
})

const loadCity = () => {
  cityItem.value = mockCities.find((item) => item.id === cityId) || mockCities[0]
}

const goBack = () => {
  router.push('/')
}

onMounted(loadCity)
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="detail-header">
      <div>
        <h1>📌 {{ cityItem?.name || '도시 정보 없음' }}</h1>
        <p class="subtitle">{{ cityItem?.description }}</p>
      </div>
      <button @click="goBack" class="home-btn">대시보드로 돌아가기</button>
    </div>

    <div class="detail-card">
      <div class="detail-top">
        <div>
          <p>현재 온도</p>
          <strong>{{ displayTemp }} {{ configStore.unitSymbol }}</strong>
        </div>
        <div>
          <p>체감 온도</p>
          <strong>{{ displayFeelsLike }} {{ configStore.unitSymbol }}</strong>
        </div>
      </div>

      <div class="detail-grid">
        <div>
          <p>습도</p>
          <strong>{{ cityItem?.humidity }}%</strong>
        </div>
        <div>
          <p>풍속</p>
          <strong>{{ cityItem?.wind }} m/s</strong>
        </div>
        <div>
          <p>날씨</p>
          <strong>{{ cityItem?.status }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.subtitle {
  margin-top: 8px;
  color: #546e7a;
}

.detail-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.detail-top {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.detail-top div {
  min-width: 120px;
}

.detail-top p,
.detail-grid p {
  color: #546e7a;
  margin-bottom: 8px;
}

.detail-top strong,
.detail-grid strong {
  font-size: 2rem;
  color: #263238;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 18px;
}

.detail-grid div {
  padding: 18px;
  background: #f8fafc;
  border-radius: 18px;
  text-align: center;
}

.home-btn {
  padding: 12px 18px;
  border-radius: 14px;
  border: none;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  font-weight: 700;
}
</style>
