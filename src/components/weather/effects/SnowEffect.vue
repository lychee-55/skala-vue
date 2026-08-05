<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import confetti from 'canvas-confetti'

const canvas = ref(null)
let snow
let timer
let observer
let resizeObserver
let visible = true

const launchSnow = () => {
  if (!visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const count = window.innerWidth < 640 ? 5 : 10
  snow({
    particleCount: count,
    startVelocity: 0,
    gravity: 0.3,
    drift: -0.35,
    ticks: 160,
    scalar: 0.45,
    shapes: ['circle'],
    colors: ['#ffffff', '#dff4ff', '#bfe2ff'],
    origin: { x: Math.random(), y: -0.08 },
  })
}

onMounted(() => {
  snow = confetti.create(canvas.value, { resize: true, useWorker: true, disableForReducedMotion: true })
  observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
  })
  observer.observe(canvas.value)
  resizeObserver = new ResizeObserver(() => launchSnow())
  resizeObserver.observe(canvas.value)
  timer = window.setInterval(launchSnow, 450)
  launchSnow()
})

onBeforeUnmount(() => {
  window.clearInterval(timer)
  snow?.reset()
  observer?.disconnect()
  resizeObserver?.disconnect()
})
</script>

<template><canvas ref="canvas" class="snow-canvas" aria-hidden="true"></canvas></template>

<style scoped>
.snow-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
</style>
