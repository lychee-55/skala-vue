<script setup>
import { computed } from 'vue'
import SunEffect from './SunEffect.vue'
import CloudEffect from './CloudEffect.vue'
import RainEffect from './RainEffect.vue'
import SnowEffect from './SnowEffect.vue'
import StormEffect from './StormEffect.vue'

const props = defineProps({ weather: { type: [String, Object], default: 'unknown' } })
const type = computed(() => typeof props.weather === 'string' ? props.weather.toLowerCase() : props.weather?.type || props.weather?.main?.toLowerCase?.() || 'unknown')
</script>

<template>
  <div class="weather-effect" :class="type" aria-hidden="true">
    <SunEffect v-if="type === 'clear'" />
    <CloudEffect v-else-if="type === 'clouds'" />
    <RainEffect v-else-if="type === 'rain'" />
    <SnowEffect v-else-if="type === 'snow'" />
    <StormEffect v-else-if="type === 'thunderstorm'" />
  </div>
</template>

<style scoped>
.weather-effect { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
</style>
