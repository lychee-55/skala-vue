<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useWeatherStore } from '@/stores/weatherStore'
import { useConfigStore } from '@/stores/configStore'
import { formatTemperature } from '@/utils/temperature'

const CITY_COORDINATES = {
  1835848: [37.5665, 126.978],
  1838524: [35.1796, 129.0756],
  1835327: [35.8714, 128.6014],
  1843561: [37.4563, 126.7052],
  1841811: [35.1595, 126.8526],
  1835235: [36.3504, 127.3845],
  1833747: [35.5384, 129.3114],
  1835553: [37.2636, 127.0286],
  1846326: [35.2281, 128.6811],
  1846266: [33.4996, 126.5312],
  1845136: [37.8813, 127.73],
  1845604: [36.6424, 127.489],
  1845457: [35.8242, 127.148],
  1841066: [34.8118, 126.3922],
  1846986: [36.5684, 128.7294],
  1839071: [36.019, 129.3435],
  1842485: [37.6584, 126.832],
}

const LAYERS = {
  none: '기본 지도',
  temp_new: '기온',
  precipitation_new: '강수',
  clouds_new: '구름',
  wind_new: '바람',
}

const weatherStore = useWeatherStore()
const configStore = useConfigStore()
const { cities, loading, error } = storeToRefs(weatherStore)
const mapElement = ref(null)
const selectedLayer = ref('none')
const mapReady = ref(false)
let map
let weatherLayer
let markers = []

const apiKey = computed(() => import.meta.env.VITE_OPENWEATHER_API_KEY)
const hasMapKey = computed(() => Boolean(apiKey.value))
const layerLabel = computed(() => LAYERS[selectedLayer.value])

const weatherEmoji = (type) =>
  ({
    clear: '☀️',
    clouds: '☁️',
    rain: '🌧️',
    snow: '❄️',
    thunderstorm: '⛈️',
  })[type] || '🌤️'

const temperatureText = (city) => formatTemperature(city.temp, configStore.unit)

const markerIcon = (city) =>
  L.divIcon({
    className: 'weather-city-marker',
    html: `<div class="weather-city-marker__content"><span class="weather-city-marker__icon">${weatherEmoji(city.weather?.type)}</span><strong>${temperatureText(city)}</strong><small>${city.name}</small></div>`,
    iconSize: [86, 74],
    iconAnchor: [43, 37],
  })

const clearMarkers = () => {
  markers.forEach((marker) => marker.remove())
  markers = []
}

const renderMarkers = () => {
  if (!map) return
  clearMarkers()
  markers = cities.value
    .filter((city) => CITY_COORDINATES[city.id])
    .map((city) => {
      const marker = L.marker(CITY_COORDINATES[city.id], { icon: markerIcon(city) }).addTo(map)
        .bindPopup(`
          <div class="weather-popup">
            <strong>${city.name}</strong>
            <span>${weatherEmoji(city.weather?.type)} ${city.description || city.weather?.label || ''}</span>
            <b>${temperatureText(city)}</b>
          </div>
        `)
      marker.on('click', () => weatherStore.selectCity(city))
      return marker
    })
}

const updateWeatherLayer = () => {
  if (!map) return
  if (weatherLayer) map.removeLayer(weatherLayer)
  weatherLayer = null
  if (selectedLayer.value === 'none' || !apiKey.value) return
  weatherLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/${selectedLayer.value}/{z}/{x}/{y}.png?appid=${apiKey.value}`,
    { opacity: 0.8, maxZoom: 18, crossOrigin: true, attribution: '© OpenWeather' },
  ).addTo(map)
}

const initializeMap = () => {
  if (!mapElement.value || map) return
  map = L.map(mapElement.value, { zoomControl: false }).setView([36.35, 127.85], 7)
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)
  updateWeatherLayer()
  renderMarkers()
  mapReady.value = true
}

const chooseLayer = (layer) => {
  selectedLayer.value = layer
  updateWeatherLayer()
}

onMounted(async () => {
  if (!cities.value.length) await weatherStore.fetchWeather()
  await nextTick()
  initializeMap()
})

watch(cities, renderMarkers, { deep: true })
watch(() => configStore.unit, renderMarkers)

onBeforeUnmount(() => {
  clearMarkers()
  if (map) map.remove()
  map = null
  weatherLayer = null
})
</script>

<template>
  <section class="weather-map-page">
    <div class="map-heading">
      <div>
        <p class="eyebrow">LIVE WEATHER MAP</p>
        <h1>날씨 지도</h1>
        <p>전국 주요 도시의 현재 날씨와 지도 레이어를 확인하세요.</p>
      </div>
      <div class="layer-selector" aria-label="날씨 지도 레이어">
        <button
          v-for="(label, layer) in LAYERS"
          :key="layer"
          type="button"
          :class="{ active: selectedLayer === layer }"
          @click="chooseLayer(layer)"
        >
          {{ label }}
        </button>
      </div>
    </div>

    <div class="map-frame">
      <div ref="mapElement" class="weather-map" aria-label="대한민국 날씨 지도" />
      <div v-if="loading.weather" class="map-message">날씨 지도를 준비하고 있습니다…</div>
      <div v-else-if="error.weather" class="map-message error">{{ error.weather }}</div>
      <div v-else-if="!hasMapKey && selectedLayer !== 'none'" class="map-message error">
        VITE_OPENWEATHER_API_KEY를 설정하면 {{ layerLabel }} 레이어가 표시됩니다.
      </div>
      <div v-else-if="mapReady && selectedLayer !== 'none'" class="map-caption">
        {{ layerLabel }} 레이어 · 도시 마커를 선택하면 현재 날씨를 확인할 수 있습니다.
      </div>
    </div>
  </section>
</template>

<style scoped>
.weather-map-page {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 18px;
  padding: 28px;
  /* background: var(--background); */
}
.map-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  color: var(--color-text);
}
.eyebrow {
  margin: 0 0 5px;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
}
h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.1;
}
.map-heading > div > p:not(.eyebrow) {
  margin: 7px 0 0;
  color: #52616f;
}
.layer-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.layer-selector button {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 9px 14px;
  color: #52616f;
  background: var(--color-surface);
  cursor: pointer;
  font-weight: 700;
}
.layer-selector button.active {
  border-color: var(--color-primary);
  color: #fff;
  background: var(--color-primary);
  box-shadow: 0 5px 14px rgba(39, 135, 216, 0.25);
}
.map-frame {
  position: relative;
  min-height: 520px;
  flex: 1;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}
.weather-map {
  width: 100%;
  height: 100%;
  min-height: 520px;
  background: #e4eef5;
}
.map-message,
.map-caption {
  position: absolute;
  left: 50%;
  z-index: 500;
  transform: translateX(-50%);
  border-radius: 999px;
  padding: 10px 16px;
  background: rgba(17, 40, 59, 0.82);
  color: #fff;
  font-size: 13px;
  text-align: center;
  backdrop-filter: blur(10px);
}
.map-message {
  top: 50%;
  transform: translate(-50%, -50%);
}
.map-message.error {
  max-width: calc(100% - 32px);
  background: rgba(144, 42, 42, 0.9);
}
.map-caption {
  bottom: 16px;
}
:deep(.weather-city-marker) {
  display: flex;
  width: 86px !important;
  height: 74px !important;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
}
:deep(.weather-city-marker__content) {
  display: flex;
  box-sizing: border-box;
  width: 82px;
  min-height: 66px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(37, 91, 135, 0.28);
  border-radius: 16px;
  color: #193a55;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 7px 17px rgba(26, 68, 98, 0.3);
  backdrop-filter: blur(10px);
  line-height: 1;
  white-space: nowrap;
}
:deep(.weather-city-marker__icon) {
  font-size: 18px;
}
:deep(.weather-city-marker strong) {
  margin-top: 3px;
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
}
:deep(.weather-city-marker small) {
  overflow: hidden;
  max-width: 72px;
  margin-top: 2px;
  font-size: 10px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.weather-popup) {
  display: flex;
  min-width: 105px;
  flex-direction: column;
  gap: 4px;
  color: #29455c;
}
:deep(.weather-popup strong) {
  font-size: 16px;
}
:deep(.weather-popup span) {
  font-size: 12px;
}
:deep(.weather-popup b) {
  font-size: 20px;
}
@media (max-width: 700px) {
  .weather-map-page {
    padding: 16px;
  }
  .map-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  h1 {
    font-size: 27px;
  }
  .map-frame,
  .weather-map {
    min-height: 480px;
  }
  .map-caption {
    display: none;
  }
}
</style>
