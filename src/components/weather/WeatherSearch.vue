<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <section class="search-box panel-box">
    <h3>🔍 도시 검색</h3>

    <input
      type="text"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      placeholder="검색할 도시 이름 입력"
    />

    <p>
      검색 중인 도시:
      <strong>
        {{ modelValue || '전체' }}
      </strong>
    </p>
  </section>
</template>

<style scoped>
.search-box {
  background: linear-gradient(135deg, #e3f2fd, #ffffff);
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.12);
}

h3 {
  margin-bottom: 15px;
}

input {
  width: 95%;
  padding: 13px;
  border-radius: 12px;
  border: 1px solid #cfd8dc;

  font-size: 15px;
}

input:focus {
  outline: none;
  border-color: #2196f3;
}

p {
  margin-top: 15px;
  color: #546e7a;
}
</style>
