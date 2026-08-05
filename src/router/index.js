import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/WeatherLayout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/components/weather/WeatherPanel.vue'),
          props: { detailed: false },
        },
        {
          path: 'weather/:cityId',
          name: 'weather-detail',
          component: () => import('@/views/WeatherDetailView.vue'),
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/map',
      name: 'weather-map',
      component: () => import('@/views/WeatherMapView.vue'),
    },
    {
      path: '/vocabulary',
      name: 'weather-vocabulary',
      component: () => import('@/views/WeatherVocabularyView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
