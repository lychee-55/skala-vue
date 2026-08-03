<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="status-bar">📍 {{ message }}</div>
</template>

<style scoped>
.status-bar {
  margin-top: 25px;
  padding: 18px;
  text-align: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #e8f5e9, #ffffff);
  color: #2e7d32;
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(46, 125, 50, 0.15);
}
</style>
