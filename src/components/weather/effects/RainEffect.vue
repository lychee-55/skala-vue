<script setup>
import { useCanvasEffect } from './useCanvasEffect'

const drops = []
const createDrop = (width, height, reset = false) => ({
  x: Math.random() * width,
  y: reset ? -Math.random() * height : Math.random() * height,
  length: 12 + Math.random() * 20,
  speed: 7 + Math.random() * 9,
  alpha: 0.18 + Math.random() * 0.36,
})

const { canvas } = useCanvasEffect((context, width, height) => {
  const count = width < 640 ? 34 : 68
  while (drops.length < count) drops.push(createDrop(width, height))
  drops.splice(count)
  context.clearRect(0, 0, width, height)
  context.lineWidth = 1
  for (const drop of drops) {
    context.strokeStyle = `rgba(226, 244, 255, ${drop.alpha})`
    context.beginPath()
    context.moveTo(drop.x, drop.y)
    context.lineTo(drop.x + 5, drop.y + drop.length)
    context.stroke()
    drop.x += 0.75
    drop.y += drop.speed
    if (drop.y > height + drop.length) Object.assign(drop, createDrop(width, height, true))
  }
})
</script>

<template><canvas ref="canvas" class="rain-canvas" aria-hidden="true"></canvas></template>

<style scoped>
.rain-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
</style>
