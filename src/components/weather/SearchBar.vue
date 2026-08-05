<script setup>
defineProps({
  query: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])
</script>

<template>
  <div class="search-bar">
    <label for="city-search">도시 검색</label>
    <input
      id="city-search"
      type="search"
      :value="query"
      placeholder="검색할 도시 이름 입력"
      @input="emit('update-query', $event.target.value)"
    />
    <p>검색 중인 도시: <strong>{{ query || '전체' }}</strong></p>
  </div>
</template>

<style scoped>
.search-bar {
  padding: var(--spacing);
}

label {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 800;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: #fff;
  font-size: 15px;
}

input:focus {
  outline: 2px solid rgba(39, 135, 216, 0.22);
  border-color: var(--color-primary);
}

p {
  margin: var(--spacing-sm) 0 0;
  color: #546e7a;
  font-size: 13px;
}
</style>
