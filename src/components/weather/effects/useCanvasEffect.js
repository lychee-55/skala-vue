import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useCanvasEffect = (drawFrame) => {
  const canvas = ref(null)
  let frameId = 0
  let resizeObserver
  let intersectionObserver
  let isVisible = true
  let isReducedMotion = false
  let context
  let width = 0
  let height = 0

  const resize = () => {
    if (!canvas.value) return
    const bounds = canvas.value.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = bounds.width
    height = bounds.height
    canvas.value.width = Math.max(1, Math.round(width * dpr))
    canvas.value.height = Math.max(1, Math.round(height * dpr))
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const render = (timestamp) => {
    if (isVisible && !isReducedMotion) drawFrame(context, width, height, timestamp)
    frameId = requestAnimationFrame(render)
  }

  onMounted(() => {
    context = canvas.value?.getContext('2d')
    if (!context) return
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    resize()
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas.value)
    intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    })
    intersectionObserver.observe(canvas.value)
    frameId = requestAnimationFrame(render)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frameId)
    resizeObserver?.disconnect()
    intersectionObserver?.disconnect()
  })

  return { canvas }
}
