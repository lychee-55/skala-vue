<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { formatTemperature } from '@/utils/temperature'
import WeatherEffect from './WeatherEffect.vue'

const props = defineProps({
  detailed: {
    type: Boolean,
    default: false,
  },
})

const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const router = useRouter()
const { currentWeather, forecast, loading, error, weatherClass } = storeToRefs(weatherStore)
const city = computed(() => currentWeather.value)
const displayTemp = (temperature) => formatTemperature(temperature, configStore.unit)
const goToDetail = () => {
  if (city.value) router.push({ name: 'weather-detail', params: { cityId: city.value.id } })
}
</script>

<template>
  <aside class="weather-panel" :class="[weatherClass, { detailed: props.detailed }]">
    <WeatherEffect v-if="city" :weather="city.weather" />
    <div class="panel-bg" aria-hidden="true"></div>

    <div v-if="loading.weather && !city" class="panel-state" role="status">
      <span class="loading-spinner"></span>
      <p>현재 날씨를 불러오는 중입니다.</p>
    </div>

    <div v-else-if="!city" class="panel-state error-state" role="alert">
      <strong>날씨 정보를 표시할 수 없습니다.</strong>
      <p>{{ error.weather || '도시를 선택하세요.' }}</p>
    </div>

    <div v-else class="panel-inner">
      <div v-if="loading.weather" class="panel-loading-overlay" role="status">
        <span class="loading-spinner"></span>
        날씨 정보를 업데이트하는 중입니다.
      </div>

      <header class="hero-header">
        <div class="location-block">
          <p class="eyebrow">CURRENT LOCATION</p>
          <h2>{{ city.name }}</h2>
          <p class="current-date">
            {{
              new Date().toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })
            }}
          </p>
        </div>
        <div class="temperature-block">
          <p class="temp-large">{{ displayTemp(city.temp) }}</p>
          <p class="high-low">
            최고 {{ displayTemp(city.temp) }} · 최저 {{ displayTemp(city.feelsLike) }}
          </p>
        </div>
      </header>

      <section class="hero-visual">
        <div class="weather-symbol" :class="weatherClass" aria-hidden="true">
          <span v-if="weatherClass === 'clear'">☀</span>
          <span v-else-if="weatherClass === 'clouds'">☁</span>
          <span v-else-if="weatherClass === 'rain'">🌧</span>
          <span v-else-if="weatherClass === 'snow'">❄</span>
          <span v-else-if="weatherClass === 'thunderstorm'">⛈</span>
          <span v-else>◌</span>
        </div>
        <div class="weather-copy">
          <p class="weather-description">{{ city.weather.label }}</p>
          <p>{{ city.description || '현재 날씨 정보를 확인하세요.' }}</p>
        </div>
      </section>

      <section class="condition-row" aria-label="현재 기상 정보">
        <div class="condition-item">
          <span>체감</span><strong>{{ displayTemp(city.feelsLike) }}</strong>
        </div>
        <div class="condition-item">
          <span>습도</span><strong>{{ city.humidity }}%</strong>
        </div>
        <div class="condition-item">
          <span>풍속</span><strong>{{ city.wind }} m/s</strong>
        </div>
      </section>

      <section v-if="props.detailed" class="forecast" aria-label="향후 날씨 예보">
        <div class="forecast-heading">
          <div>
            <p class="eyebrow">WEATHER TIMELINE</p>
            <h3>향후 5일 예보</h3>
          </div>
          <span class="timeline-hint">좌우로 밀어보기</span>
        </div>

        <div v-if="loading.forecast" class="forecast-loading" role="status">
          <span v-for="index in 5" :key="index" class="forecast-skeleton"></span>
        </div>
        <div v-else-if="error.forecast" class="forecast-error" role="alert">
          예보를 불러오지 못했습니다. {{ error.forecast }}
        </div>
        <div v-else class="forecast-list">
          <article v-for="d in forecast" :key="d.date" class="forecast-item">
            <time>{{ d.date }}</time>
            <div class="forecast-icon" :class="d.weather.type" aria-hidden="true">
              <span v-if="d.weather.type === 'clear'">☀</span
              ><span v-else-if="d.weather.type === 'clouds'">☁</span>
              <span v-else-if="d.weather.type === 'rain'">🌧</span
              ><span v-else-if="d.weather.type === 'snow'">❄</span>
              <span v-else-if="d.weather.type === 'thunderstorm'">⛈</span><span v-else>◌</span>
            </div>
            <strong>{{ displayTemp(d.temp) }}</strong>
            <small>{{ d.weather.label }}</small>
          </article>
        </div>
      </section>

      <div v-if="!props.detailed" class="panel-actions">
        <button @click="goToDetail">상세 페이지로 이동</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.weather-panel {
  position: relative;
  width: 100%;
  min-height: 590px;
  max-height: 100vh;
  padding: clamp(24px, 4vw, 44px);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.34);
  /* border-radius: 32px; */
  background: rgba(29, 58, 96, 0.54);
  color: #fff;
  box-shadow: 0 24px 60px rgba(17, 33, 56, 0.25);
  isolation: isolate;
  backdrop-filter: blur(20px) saturate(135%);
  -webkit-backdrop-filter: blur(20px) saturate(135%);
}

.weather-panel::after {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.12),
    transparent 45%,
    rgba(0, 0, 0, 0.12)
  );
  content: '';
  pointer-events: none;
}
.weather-panel.clear {
  background: linear-gradient(145deg, #3b9edf, #4f8ddf 52%, #7569ca);
}
.weather-panel.clouds {
  background: linear-gradient(145deg, #61758d, #9aa8b8 52%, #6a83a5);
}
.weather-panel.rain {
  background: linear-gradient(145deg, #1e476e, #4f759c 52%, #233d67);
}
.weather-panel.snow {
  background: linear-gradient(145deg, #6f9bb8, #bed3e5 54%, #7f9cb9);
}
.weather-panel.thunderstorm {
  background: linear-gradient(145deg, #18243d, #3f4f78 52%, #261f45);
}

.panel-inner {
  position: relative;
  z-index: 3;
}
.panel-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: radial-gradient(circle at 92% 4%, rgba(255, 255, 255, 0.32), transparent 26%);
  opacity: 0.7;
  pointer-events: none;
}
.hero-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing);
}
.eyebrow {
  margin: 0 0 4px;
  color: rgba(255, 255, 255, 0.68);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
}
h2,
h3,
p {
  margin-top: 0;
}
h2 {
  margin-bottom: 4px;
  font-size: clamp(30px, 4vw, 38px);
  font-weight: 500;
  letter-spacing: -0.04em;
}
.current-date,
.high-low,
.weather-copy > p,
.forecast-heading > span {
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.75);
}
.current-date {
  font-size: 14px;
}
.temperature-block {
  text-align: right;
}
.temp-large {
  margin: -10px 0 2px;
  font-size: clamp(64px, 10vw, 82px);
  font-weight: 200;
  letter-spacing: -0.09em;
  line-height: 0.95;
}
.high-low {
  font-size: 13px;
}

.hero-visual {
  display: grid;
  min-height: 236px;
  place-items: center;
  align-content: center;
  padding: 20px 0;
  text-align: center;
}
.weather-symbol {
  display: grid;
  width: 148px;
  height: 148px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 1px rgba(255, 255, 255, 0.34),
    0 12px 30px rgba(9, 28, 65, 0.18);
  font-size: 82px;
  line-height: 1;
  text-shadow: 0 8px 18px rgba(21, 41, 83, 0.22);
  backdrop-filter: blur(12px);
}
.weather-symbol.clear {
  color: #fff5b8;
}
.weather-symbol.snow {
  color: #f7fbff;
}
.weather-copy {
  margin-top: 14px;
}
.weather-description {
  margin-bottom: 4px;
  font-size: 18px;
  font-weight: 700;
}
.weather-copy > p:last-child {
  font-size: 14px;
}

.condition-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
}
.condition-item {
  display: grid;
  gap: 4px;
  padding: 15px 16px;
}
.condition-item + .condition-item {
  border-left: 1px solid rgba(255, 255, 255, 0.16);
}
.condition-item span {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}
.condition-item strong {
  font-size: 16px;
  font-weight: 600;
}

.forecast {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.forecast-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
}
.forecast-heading h3 {
  margin-bottom: 0;
  font-size: 18px;
  font-weight: 650;
}
.forecast-heading > span {
  font-size: 12px;
}
.forecast-list,
.forecast-loading {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  overflow-x: auto;
  padding: 2px 0 8px;
  scrollbar-width: thin;
}
.forecast-item {
  display: grid;
  min-width: 92px;
  gap: 9px;
  justify-items: center;
  padding: 14px 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  text-align: center;
  backdrop-filter: blur(12px);
}
.forecast-item time,
.forecast-item small {
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}
.forecast-item strong {
  font-size: 17px;
}
.forecast-icon {
  font-size: 28px;
  line-height: 1;
}

@media (min-width: 641px) {
  .forecast-list,
  .forecast-loading {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    overflow-x: visible;
  }

  .forecast-item,
  .forecast-skeleton {
    min-width: 0;
  }

  .timeline-hint {
    display: none;
  }
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.panel-actions button {
  padding: 11px 15px;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  backdrop-filter: blur(10px);
}
.panel-state {
  position: relative;
  z-index: 3;
  display: grid;
  min-height: 460px;
  place-content: center;
  gap: var(--spacing-sm);
  color: #fff;
  text-align: center;
}
.panel-state p {
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.78);
}
.error-state strong,
.forecast-error {
  color: #ffe1df;
}
.panel-loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  border-radius: inherit;
  background: rgba(16, 36, 68, 0.35);
  color: #fff;
  backdrop-filter: blur(5px);
}
.loading-spinner {
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.28);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.forecast-skeleton {
  width: 92px;
  height: 116px;
  flex: 0 0 auto;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1)
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
}
.forecast-error {
  margin-top: 14px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(119, 35, 45, 0.28);
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 640px) {
  .weather-panel {
    min-height: 0;
    /* padding: 24px 18px;
    border-radius: 24px; */
  }
  .hero-header {
    align-items: flex-end;
  }
  h2 {
    font-size: 30px;
  }
  .temp-large {
    font-size: 72px;
  }
  .hero-visual {
    min-height: 190px;
  }
  .weather-symbol {
    width: 118px;
    height: 118px;
    font-size: 65px;
  }
  .condition-row {
    grid-template-columns: 1fr;
  }
  .condition-item + .condition-item {
    border-top: 1px solid rgba(255, 255, 255, 0.16);
    border-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-spinner,
  .forecast-skeleton {
    animation: none;
  }
}
</style>
