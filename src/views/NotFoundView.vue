<template>
  <section class="not-found">
    <h1>페이지를 찾을 수 없습니다.</h1>
    <RouterLink to="/">날씨 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  display: grid;
  width: 100%;
  place-content: center;
  text-align: center;
}

h1 {
  margin: 0 0 12px;
}
</style>
