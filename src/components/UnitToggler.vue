<script setup>
import { useConfigStore } from '@/stores/configStore'
import { ElSwitch } from 'element-plus'
import 'element-plus/es/components/switch/style/css'

const configStore = useConfigStore()

const updateUnit = (unit) => {
  if (unit !== configStore.unit) configStore.toggleUnit()
}
</script>

<template>
  <div class="unit-toggler">
    <span>단위</span>
    <ElSwitch
      :model-value="configStore.unit"
      active-value="fahrenheit"
      inactive-value="celsius"
      active-text="℉"
      inactive-text="℃"
      aria-label="온도 단위 전환"
      @change="updateUnit"
    />
    <strong>{{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }}</strong>
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

.unit-toggler strong {
  min-width: 28px;
  color: #3498db;
  font-size: 13px;
  font-weight: 700;
}

.unit-toggler :deep(.el-switch) {
  --el-switch-on-color: #3498db;
  --el-switch-off-color: #8aa7bd;
}
</style>
