<script setup>
import { useConfigStore } from '@/stores/configStore'

defineProps({
  averageTemp: {
    type: Number,
    required: true,
  },

  hottestCity: {
    type: Object,
    required: true,
  },

  rainCityCount: {
    type: Number,
    required: true,
  },
})

const configStore = useConfigStore()

const displayTemp = (rawTemp) => {
  return configStore.unit === 'fahrenheit' ? Math.round((rawTemp * 9) / 5 + 32) : rawTemp
}
</script>

<template>
  <section class="summary-box panel-box">
    <h3>📊 오늘 날씨 통계</h3>

    <div class="summary-grid">
      <div class="summary-card">
        <h4>🌡 평균 기온</h4>

        <p>{{ displayTemp(averageTemp) }} {{ configStore.unitSymbol }}</p>
      </div>

      <div class="summary-card">
        <h4>🔥 최고 기온</h4>

        <p>
          {{ hottestCity.name }}
          {{ displayTemp(hottestCity.temp) }} {{ configStore.unitSymbol }}
        </p>
      </div>

      <div class="summary-card">
        <h4>🌧 비 오는 지역</h4>

        <p>{{ rainCityCount }}곳</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.summary-box {
  background: #ffffff;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.summary-card {
  padding: 18px;
  text-align: center;
  border-radius: 15px;
  background: #f8fafc;
}

.summary-card h4 {
  font-size: 14px;
  margin-bottom: 10px;
  color: #546e7a;
}

.summary-card p {
  font-size: 22px;
  font-weight: bold;
}

@media (max-width: 600px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
