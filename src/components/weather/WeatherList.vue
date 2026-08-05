<script setup>
import WeatherCard from './WeatherCard.vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

defineProps({
  weatherList: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])
</script>

<template>
  <section class="list-box">
    <h3>🏙 지역별 날씨</h3>

    <div v-if="weatherList.length">
      <WeatherCard
        v-for="city in weatherList"
        :key="city.id"
        :city="city"
        :is-favorite="configStore.isFavorite(city.id)"
        @select-card="emit('select-card', city)"
        @click-detail="emit('click-detail', $event)"
        @toggle-favorite="emit('toggle-favorite', $event)"
      />
    </div>

    <p v-else class="empty">검색 결과가 없습니다.</p>
  </section>
</template>

<style scoped>
.list-box {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  margin: 0;
  padding: 0;
  overflow-y: auto;
}

h3 {
  margin: 0 0 12px;
  padding: 0 4px;
}

.list-box :deep(.weather-card) {
  margin-bottom: 12px;
}

.list-box > div {
  min-height: 0;
}

.empty {
  text-align: center;
  color: #78909c;
  padding: 20px;
}
</style>
