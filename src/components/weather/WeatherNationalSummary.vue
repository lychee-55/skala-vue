<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { formatTemperature } from '@/utils/temperature'

const props = defineProps({
  cities: {
    type: Array,
    required: true,
  },
})

const configStore = useConfigStore()
const averageTemperature = computed(() => {
  if (!props.cities.length) return 0
  return Math.round(props.cities.reduce((sum, city) => sum + city.temp, 0) / props.cities.length)
})
const hottestCity = computed(() =>
  props.cities.reduce(
    (hottest, city) => (!hottest || city.temp > hottest.temp ? city : hottest),
    null,
  ),
)
const rainyCityCount = computed(
  () =>
    props.cities.filter((city) => ['rain', 'snow', 'thunderstorm'].includes(city.weather.type))
      .length,
)
const displayTemp = (temperature) => formatTemperature(temperature, configStore.unit)
</script>

<template>
  <section class="national-summary" aria-label="오늘 전국 날씨 통계">
    <div class="summary-heading">
      <span>대한민국</span>
      <h2>오늘 전국 날씨 통계</h2>
    </div>
    <div class="summary-grid">
      <div>
        <span>평균 기온</span><strong>{{ displayTemp(averageTemperature) }}</strong>
      </div>
      <div>
        <span>최고 기온</span
        ><strong>{{ hottestCity ? displayTemp(hottestCity.temp) : '-' }}</strong
        ><small>{{ hottestCity?.name || '-' }}</small>
      </div>
      <div>
        <span>강수 지역</span><strong>{{ rainyCityCount }}곳</strong><small>비 · 눈 · 뇌우</small>
      </div>
    </div>
  </section>
</template>

<style scoped>
.national-summary {
  padding: var(--spacing);
}
.summary-heading span {
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
}
h2 {
  margin: 3px 0 var(--spacing-sm);
  color: var(--color-text);
  font-size: 18px;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.summary-grid > div {
  display: grid;
  gap: 3px;
  min-width: 0;
  padding: 10px;
  border-radius: var(--radius-sm);
  background: #f5f8fb;
}
.summary-grid span,
small {
  color: #607080;
  font-size: 11px;
}
.summary-grid strong {
  overflow: hidden;
  color: var(--color-text);
  font-size: 17px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 520px) {
  .summary-grid {
    gap: 5px;
  }
  .summary-grid > div {
    padding: 8px;
  }
  .summary-grid strong {
    font-size: 15px;
  }
}
</style>
