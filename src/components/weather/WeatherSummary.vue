<script setup>
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
</script>

<template>
  <section class="summary-box">
    <h3>📊 오늘 날씨 통계</h3>

    <div class="summary-grid">
      <div class="summary-card">
        <h4>🌡 평균 기온</h4>

        <p>{{ averageTemp }}℃</p>
      </div>

      <div class="summary-card">
        <h4>🔥 최고 기온</h4>

        <p>
          {{ hottestCity.name }}

          {{ hottestCity.temp }}℃
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
  padding: 25px;
  border-radius: 20px;
  margin-bottom: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
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
