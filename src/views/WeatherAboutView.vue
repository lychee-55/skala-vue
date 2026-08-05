<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="about-page">
    <section class="about-hero">
      <p class="eyebrow">SKALA VUE WEATHER</p>
      <h1>날씨 데이터를<br />이해하기 쉬운 화면으로</h1>
      <p class="hero-copy">
        전국 주요 도시의 현재 날씨와 5일 예보를 한 화면에서 확인하는 Vue 3 기반 날씨 대시보드입니다.
        데이터 흐름, 상태 관리, 화면 전환을 단계적으로 학습하기 위해 제작했습니다.
      </p>
      <div class="hero-actions">
        <RouterLink to="/">대시보드 보기</RouterLink>
        <RouterLink class="secondary" to="/map">날씨 지도 보기</RouterLink>
      </div>
    </section>

    <section class="about-section">
      <div class="section-heading">
        <p class="eyebrow">SERVICE FLOW</p>
        <h2>서비스는 이렇게 동작합니다</h2>
      </div>
      <ol class="flow-list">
        <li>
          <span>01</span>
          <div>
            <strong>OpenWeather API 요청</strong>
            <p>
              Axios 서비스 레이어가 현재 날씨와 5일 예보를 요청하며, API 키는
              <code>VITE_OPENWEATHER_API_KEY</code> 환경 변수에서 읽습니다.
            </p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <strong>응답 데이터 정리</strong>
            <p>
              API의 영문 날씨 상태를 <code>clear</code>, <code>clouds</code>, <code>rain</code> 등
              공통 type과 한글 label로 변환합니다.
            </p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <strong>Pinia Store 상태 갱신</strong>
            <p>
              <code>cities</code>, <code>selectedCity</code>, <code>currentWeather</code>,
              <code>forecast</code>를 한 곳에서 관리해 홈·상세·지도 화면이 같은 데이터를 사용합니다.
            </p>
          </div>
        </li>
        <li>
          <span>04</span>
          <div>
            <strong>컴포넌트 화면 반영</strong>
            <p>
              검색·필터·카드 선택 이벤트가 Store를 갱신하고, WeatherPanel과 지도 마커가 반응형
              데이터에 맞춰 즉시 다시 렌더링됩니다.
            </p>
          </div>
        </li>
      </ol>
    </section>

    <section class="about-section implementation-section">
      <div class="section-heading">
        <p class="eyebrow">ASSIGNMENT IMPLEMENTATION</p>
        <h2>과제 요구사항 적용 내용</h2>
      </div>
      <div class="feature-grid">
        <article>
          <h3>컴포넌트 분리와 통신</h3>
          <p>
            <code>BaseDashboardCard</code>는 slot으로 공통 카드 틀을 제공하고,
            <code>SearchBar</code>는 props와 <code>update-query</code> 이벤트로 검색어를 전달합니다.
          </p>
          <p>
            <code>WeatherCard</code>는 도시 객체를 props로 받고 <code>select-card</code>,
            <code>click-detail</code> 이벤트를 부모로 전달합니다.
          </p>
        </article>
        <article>
          <h3>Vue Router</h3>
          <p>
            라우트는 Lazy Loading으로 불러오며, 대시보드(<code>/</code>), 동적 상세
            페이지(<code>/weather/:cityId</code>), 날씨 지도(<code>/map</code>)와 Catch-all NotFound
            페이지를 제공합니다.
          </p>
        </article>
        <article>
          <h3>Pinia 설정 Store</h3>
          <p>
            섭씨·화씨 설정과 즐겨찾기 도시를 관리합니다. 온도 표시는 공통 변환 유틸을 사용해
            메인·상세·지도 마커에서 동일하게 적용됩니다.
          </p>
        </article>
        <article>
          <h3>상태별 UI와 반응형</h3>
          <p>
            날씨 type에 따라 카드, 패널, WeatherEffect의 색상과 애니메이션이 변합니다. 목록은 화면
            높이에 맞춰 내부 스크롤되고 모바일에서는 제한된 카드 수를 보여 줍니다.
          </p>
        </article>
        <article>
          <h3>지도 기반 날씨 확인</h3>
          <p>
            Leaflet과 OpenStreetMap을 바탕으로 도시 마커를 표시합니다. OpenWeather 지도 레이어로
            기온·강수·구름·바람 정보를 선택해서 겹쳐 볼 수 있습니다.
          </p>
        </article>
        <article>
          <h3>Element Plus 활용</h3>
          <p>
            데이터 로직을 바꾸지 않는 범위에서 날씨 상태 필터에는 <code>ElSelect</code>, 단위
            설정에는 <code>ElSwitch</code>를 적용했습니다.
          </p>
        </article>
      </div>
    </section>

    <section class="about-section technical-section">
      <div>
        <p class="eyebrow">DATA STABILITY</p>
        <h2>안정적인 요청 처리</h2>
        <p>
          도시를 빠르게 선택해도 이전 요청이 최신 화면을 덮어쓰지 않도록 요청 식별자를 사용합니다.
          API 오류는 Store의 error 상태로 전달되어 화면에서 안내합니다.
        </p>
      </div>
      <div>
        <p class="eyebrow">LOCAL PREFERENCE</p>
        <h2>사용자 설정 유지</h2>
        <p>
          즐겨찾기 도시는 브라우저 Local Storage에 저장합니다. 페이지를 새로고침해도 즐겨찾기 선택은
          유지되며, 날씨 정보는 API에서 다시 갱신됩니다.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.about-page {
  width: min(1080px, calc(100% - 32px));
  margin: 0 auto;
  padding: 54px 0 70px;
  color: var(--color-text);
}
.about-hero {
  padding: clamp(28px, 6vw, 72px);
  border-radius: var(--radius-lg);
  color: #fff;
  background: linear-gradient(135deg, #1e5e94, #328bd0 55%, #6e7ece);
  box-shadow: var(--shadow);
}
.eyebrow {
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
}
.about-hero .eyebrow {
  color: rgba(255, 255, 255, 0.72);
}
h1,
h2,
h3,
p {
  margin-top: 0;
}
h1 {
  margin-bottom: 18px;
  font-size: clamp(36px, 6vw, 62px);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 1.04;
}
.hero-copy {
  max-width: 650px;
  margin-bottom: 28px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 17px;
  line-height: 1.75;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.hero-actions a {
  padding: 11px 16px;
  border-radius: 10px;
  color: #1c5e94;
  background: #fff;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
}
.hero-actions a.secondary {
  border: 1px solid rgba(255, 255, 255, 0.48);
  color: #fff;
  background: rgba(255, 255, 255, 0.13);
}
.about-section {
  margin-top: 48px;
}
.section-heading {
  margin-bottom: 18px;
}
h2 {
  margin-bottom: 0;
  font-size: 28px;
  letter-spacing: -0.04em;
}
.flow-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.flow-list li,
.feature-grid article,
.technical-section > div {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  box-shadow: 0 5px 16px rgba(27, 43, 59, 0.05);
}
.flow-list li {
  padding: 20px;
}
.flow-list li > span {
  display: inline-flex;
  margin-bottom: 20px;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 800;
}
.flow-list strong,
h3 {
  display: block;
  margin-bottom: 8px;
  font-size: 17px;
}
.flow-list p,
.feature-grid p,
.technical-section p {
  margin-bottom: 0;
  color: #5e7181;
  font-size: 14px;
  line-height: 1.7;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.feature-grid article {
  padding: 20px;
}
.feature-grid p + p {
  margin-top: 10px;
}
.technical-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.technical-section > div {
  padding: 26px;
}
.technical-section h2 {
  margin-bottom: 10px;
  font-size: 21px;
}
code {
  padding: 2px 5px;
  border-radius: 4px;
  color: #176ca8;
  background: #edf6fc;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.9em;
}
@media (max-width: 900px) {
  .flow-list,
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .about-page {
    width: min(100% - 32px, 1080px);
    padding: 24px 0 44px;
  }
  .about-section {
    margin-top: 32px;
  }
  .flow-list,
  .feature-grid,
  .technical-section {
    grid-template-columns: 1fr;
  }
  .about-hero {
    padding: 28px;
  }
  .hero-copy {
    font-size: 15px;
  }
  h2 {
    font-size: 25px;
  }
}
</style>
