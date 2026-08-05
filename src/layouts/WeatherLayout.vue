<script setup>
import { RouterView } from 'vue-router'
import WeatherHomeView from '@/views/WeatherHomeView.vue'
</script>

<template>
  <div class="weather-layout">
    <aside class="weather-sidebar">
      <!-- <header class="sidebar-header">
        <div>
          <h1>오늘의 날씨</h1>
          <p class="sidebar-eyebrow">WEATHER DASHBOARD</p>
        </div>
      </header> -->
      <WeatherHomeView />
    </aside>

    <main class="weather-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.weather-layout {
  display: flex;
  height: 100vh;
  max-height: 100%;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  background: var(--color-app-bg);
}

.weather-sidebar {
  display: flex;
  flex: 0 0 var(--sidebar-width);
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  box-shadow: var(--shadow-sidebar);
  z-index: 1;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: var(--spacing);
  border-bottom: 1px solid var(--color-border);
}

.sidebar-eyebrow {
  margin: 0 0 4px;
  color: var(--color-text);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

h1 {
  margin: 0;
  font-size: 22px;
}

.weather-main {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  max-height: 100vh;
  overflow: auto;
  /* padding: var(--layout-padding); */
}

.weather-main > :deep(*) {
  width: 100%;
}

@media (max-width: 800px) {
  .weather-layout {
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .weather-sidebar {
    flex: 0 0 72%;
    max-height: 72%;
    border-right: 0;
    border-bottom: 1px solid var(--color-border);
  }

  .weather-main {
    min-height: 0;
    flex: 1 1 auto;
    /* padding: 16px; */
  }
}
</style>
