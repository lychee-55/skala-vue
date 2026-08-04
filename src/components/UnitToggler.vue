<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span>단위</span>
    <button @click="configStore.toggleUnit()">
      {{ configStore.unit === 'celsius' ? '섭씨 (℃)' : '화씨 (℉)' }}
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 10px;
}

.unit-toggler span {
  font-weight: 700;
  color: #2c3e50;
}

.unit-toggler button {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #3498db;
  background-color: #ffffff;
  color: #3498db;
  cursor: pointer;
  font-weight: 700;
}
</style>
