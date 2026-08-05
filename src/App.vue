<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from '@/components/UnitToggler.vue'
</script>

<template>
  <div class="app-shell">
    <header class="app-navigation">
      <RouterLink class="app-brand" to="/">Weather Dashboard</RouterLink>
      <nav aria-label="주요 메뉴">
        <RouterLink to="/">대시보드</RouterLink>
        <RouterLink to="/map">날씨 지도</RouterLink>
        <RouterLink to="/vocabulary">오늘의 영어</RouterLink>
        <RouterLink to="/about">서비스 소개</RouterLink>
      </nav>
      <UnitToggler />
    </header>

    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.app-navigation {
  display: flex;
  min-height: var(--navigation-height);
  align-items: center;
  gap: var(--spacing);
  padding: 0 var(--layout-padding);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.app-brand {
  color: var(--color-text);
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
}

nav {
  display: flex;
  gap: 4px;
}

nav a {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  color: #52616f;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
}

nav a.router-link-exact-active {
  background: #e6f3fc;
  color: var(--color-primary);
}

.app-navigation :deep(.unit-toggler) {
  margin-left: auto;
}

.app-content {
  display: flex;
  min-height: 0;
  flex: 1;
}

@media (max-width: 640px) {
  .app-navigation {
    flex-wrap: wrap;
    padding: var(--spacing-sm) var(--spacing);
  }

  .app-navigation :deep(.unit-toggler) {
    margin-left: 0;
  }
}
</style>
