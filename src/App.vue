<script setup>
import { RouterLink } from 'vue-router'
import UnitToggler from './components/UnitToggler.vue'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <nav class="app-nav">
        <RouterLink to="/">대시보드</RouterLink>
        <RouterLink to="/about">서비스 소개</RouterLink>
      </nav>
      <UnitToggler />
    </header>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.app-nav {
  display: flex;
  gap: 20px;
}

.app-nav a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 700;
}

.app-nav a.router-link-active {
  color: #3498db;
}

.app-main {
  min-height: calc(100vh - 120px);
}
</style>
