<script setup>
import WeatherCard from './WeatherCard.vue'

defineProps({
  weatherList: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['select-city'])
</script>

<template>
  <section class="list-box">
    <h3>🏙 지역별 날씨</h3>

    <div v-if="weatherList.length">
      <WeatherCard
        v-for="city in weatherList"
        :key="city.id"
        :city="city"
        @select="emit('select-city', city)"
      />
    </div>

    <p v-else class="empty">검색 결과가 없습니다.</p>
  </section>
</template>

<style scoped>
.list-box {
  background: #f8fafc;
  padding: 25px;
  border-radius: 20px;
}

h3 {
  margin-bottom: 20px;
}

.empty {
  text-align: center;
  color: #78909c;
  padding: 20px;
}
</style>
