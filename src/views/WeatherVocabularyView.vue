<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '@/stores/weatherStore'

const VOCABULARY = {
  clear: {
    icon: '☀️', label: '맑음', word: 'clear', pronunciation: '/klɪr/', meaning: '맑은, 구름이 없는',
    sentence: 'The sky is clear in Seoul today.', translation: '오늘 서울의 하늘은 맑습니다.',
    related: [{ word: 'sunny', meaning: '화창한' }, { word: 'sunshine', meaning: '햇빛' }, { word: 'bright', meaning: '밝은' }],
  },
  clouds: {
    icon: '☁️', label: '구름', word: 'cloudy', pronunciation: '/ˈklaʊ.di/', meaning: '구름이 낀',
    sentence: 'It is cloudy over Busan today.', translation: '오늘 부산에는 구름이 많이 끼었습니다.',
    related: [{ word: 'cloud', meaning: '구름' }, { word: 'overcast', meaning: '흐린' }, { word: 'shade', meaning: '그늘' }],
  },
  rain: {
    icon: '🌧️', label: '비', word: 'rain', pronunciation: '/reɪn/', meaning: '비, 비가 오다',
    sentence: 'It is raining in {{city}} today.', translation: '오늘 {{city}}에는 비가 내리고 있습니다.',
    related: [{ word: 'rainy', meaning: '비가 오는' }, { word: 'umbrella', meaning: '우산' }, { word: 'drizzle', meaning: '이슬비' }],
  },
  snow: {
    icon: '❄️', label: '눈', word: 'snow', pronunciation: '/snoʊ/', meaning: '눈, 눈이 오다',
    sentence: 'Snow is expected in {{city}} tonight.', translation: '오늘 밤 {{city}}에는 눈이 예상됩니다.',
    related: [{ word: 'snowy', meaning: '눈이 오는' }, { word: 'snowflake', meaning: '눈송이' }, { word: 'icy', meaning: '얼음이 언' }],
  },
  thunderstorm: {
    icon: '⛈️', label: '뇌우', word: 'thunderstorm', pronunciation: '/ˈθʌn.dɚ.stɔːrm/', meaning: '천둥과 번개를 동반한 폭풍',
    sentence: 'A thunderstorm is moving toward {{city}}.', translation: '뇌우가 {{city}} 쪽으로 이동하고 있습니다.',
    related: [{ word: 'thunder', meaning: '천둥' }, { word: 'lightning', meaning: '번개' }, { word: 'stormy', meaning: '폭풍우가 치는' }],
  },
}

const DEFAULT_VOCABULARY = {
  icon: '🌤️', label: '날씨', word: 'weather', pronunciation: '/ˈweð.ɚ/', meaning: '날씨',
  sentence: 'What is the weather like in {{city}}?', translation: '{{city}}의 날씨는 어떤가요?',
  related: [{ word: 'forecast', meaning: '일기 예보' }, { word: 'temperature', meaning: '기온' }, { word: 'humidity', meaning: '습도' }],
}

const weatherStore = useWeatherStore()
const { currentWeather, cities, loading } = storeToRefs(weatherStore)
const cityName = computed(() => currentWeather.value?.name || '서울')
const vocabulary = computed(() => VOCABULARY[currentWeather.value?.weather?.type] || DEFAULT_VOCABULARY)
const exampleSentence = computed(() => vocabulary.value.sentence.replaceAll('{{city}}', cityName.value))
const translatedSentence = computed(() => vocabulary.value.translation.replaceAll('{{city}}', cityName.value))

onMounted(() => {
  if (!cities.value.length) weatherStore.fetchWeather()
})
</script>

<template>
  <main class="vocabulary-page">
    <section class="vocabulary-hero" :class="currentWeather?.weather?.type || 'default'">
      <div>
        <p class="eyebrow">WEATHER ENGLISH OF THE DAY</p>
        <h1>오늘의 날씨 영어</h1>
        <p class="hero-copy">{{ cityName }}의 현재 날씨를 활용해 매일 한 단어씩 자연스럽게 익혀 보세요.</p>
      </div>
      <p class="location-chip">{{ currentWeather?.name || '날씨 불러오는 중' }} · {{ vocabulary.label }}</p>
    </section>

    <section v-if="loading.weather && !currentWeather" class="state-card">오늘의 날씨 단어를 준비하고 있습니다…</section>

    <template v-else>
      <section class="word-card">
        <div class="weather-emoji" aria-hidden="true">{{ vocabulary.icon }}</div>
        <div class="word-main">
          <p class="word-label">{{ vocabulary.label }} WEATHER</p>
          <h2>{{ vocabulary.word }}</h2>
          <p class="pronunciation">{{ vocabulary.pronunciation }}</p>
          <p class="meaning">{{ vocabulary.meaning }}</p>
        </div>
        <div class="word-tip"><strong>학습 팁</strong><span>단어를 소리 내어 읽고 예문에서 다시 찾아보세요.</span></div>
      </section>

      <section class="example-card">
        <p class="eyebrow">EXAMPLE SENTENCE</p>
        <blockquote>“{{ exampleSentence }}”</blockquote>
        <p>{{ translatedSentence }}</p>
      </section>

      <section class="related-section">
        <div class="section-heading"><div><p class="eyebrow">BUILD YOUR WEATHER VOCABULARY</p><h2>함께 알아두면 좋은 단어</h2></div><span>오늘의 핵심 단어와 연결해 기억해 보세요.</span></div>
        <div class="related-grid">
          <article v-for="(item, index) in vocabulary.related" :key="item.word">
            <span>0{{ index + 1 }}</span><strong>{{ item.word }}</strong><p>{{ item.meaning }}</p>
          </article>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.vocabulary-page { width:min(960px,calc(100% - 32px)); margin:0 auto; padding:44px 0 64px; color:var(--color-text); }
.vocabulary-hero { display:flex; align-items:flex-end; justify-content:space-between; gap:20px; padding:clamp(28px,5vw,54px); border-radius:var(--radius-lg); color:#fff; background:linear-gradient(135deg,#477dbb,#78a7d9); box-shadow:var(--shadow); }
.vocabulary-hero.clear { background:linear-gradient(135deg,#308ed3,#8aa5e1); }.vocabulary-hero.clouds { background:linear-gradient(135deg,#566e87,#a5b2c0); }.vocabulary-hero.rain { background:linear-gradient(135deg,#214968,#617f9f); }.vocabulary-hero.snow { background:linear-gradient(135deg,#6c9abb,#b7d1e4); }.vocabulary-hero.thunderstorm { background:linear-gradient(135deg,#202d4c,#5d5b8b); }
.eyebrow { margin:0 0 8px; color:var(--color-primary); font-size:12px; font-weight:800; letter-spacing:.12em; }.vocabulary-hero .eyebrow { color:rgba(255,255,255,.72); }
h1,h2,p { margin-top:0; }h1 { margin-bottom:12px; font-size:clamp(36px,6vw,58px); font-weight:500; letter-spacing:-.06em; }.hero-copy { max-width:570px; margin-bottom:0; color:rgba(255,255,255,.87); line-height:1.65; }.location-chip { flex:0 0 auto; margin:0; padding:9px 13px; border:1px solid rgba(255,255,255,.38); border-radius:999px; background:rgba(255,255,255,.15); font-size:13px; font-weight:700; }
.word-card,.example-card,.related-grid article,.state-card { border:1px solid var(--color-border); border-radius:var(--radius); background:var(--color-surface); box-shadow:0 6px 18px rgba(27,43,59,.06); }.word-card { display:grid; grid-template-columns:auto 1fr minmax(180px,250px); align-items:center; gap:28px; margin-top:20px; padding:clamp(24px,4vw,42px); }.weather-emoji { display:grid; width:112px; height:112px; place-items:center; border-radius:30px; background:#edf6fc; font-size:60px; }.word-label { margin-bottom:4px; color:var(--color-primary); font-size:12px; font-weight:800; letter-spacing:.1em; }.word-main h2 { margin-bottom:3px; font-size:clamp(42px,7vw,68px); font-weight:400; letter-spacing:-.06em; }.pronunciation { margin-bottom:9px; color:#637586; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; }.meaning { margin-bottom:0; font-size:18px; font-weight:700; }.word-tip { display:grid; gap:7px; padding:18px; border-radius:12px; color:#49677e; background:#f1f8fc; font-size:13px; line-height:1.55; }.word-tip strong { color:#287ab7; }
.example-card { margin-top:14px; padding:clamp(24px,4vw,38px); }.example-card blockquote { margin:7px 0 12px; color:#254965; font-size:clamp(22px,4vw,32px); font-weight:500; line-height:1.35; }.example-card > p:last-child { margin-bottom:0; color:#607282; }
.related-section { margin-top:40px; }.section-heading { display:flex; align-items:end; justify-content:space-between; gap:16px; margin-bottom:14px; }.section-heading h2 { margin-bottom:0; font-size:25px; letter-spacing:-.04em; }.section-heading > span { color:#6b7d8c; font-size:13px; }.related-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }.related-grid article { padding:20px; }.related-grid span { display:block; margin-bottom:22px; color:var(--color-primary); font-size:12px; font-weight:800; }.related-grid strong { display:block; margin-bottom:6px; font-size:23px; }.related-grid p { margin-bottom:0; color:#657887; }.state-card { margin-top:20px; padding:34px; color:#587084; text-align:center; }
@media (max-width:700px) { .vocabulary-page { padding:24px 0 44px; }.vocabulary-hero,.section-heading { align-items:flex-start; flex-direction:column; }.word-card { grid-template-columns:1fr; gap:18px; }.weather-emoji { width:84px; height:84px; border-radius:22px; font-size:44px; }.word-tip { max-width:none; }.related-grid { grid-template-columns:1fr; }.location-chip { margin-top:4px; }.section-heading > span { line-height:1.5; } }
</style>
