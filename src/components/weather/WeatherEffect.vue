<script setup>
import WeatherEffectLayer from './effects/WeatherEffect.vue'

defineProps({ weather: { type: [String, Object], default: 'unknown' } })
</script>

<template><WeatherEffectLayer :weather="weather" /></template>
