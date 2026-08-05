import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useEffectVisibility = () => {
  const root = ref(null)
  const visible = ref(true)
  let observer

  onMounted(() => {
    observer = new IntersectionObserver(([entry]) => {
      visible.value = entry.isIntersecting
    })
    observer.observe(root.value)
  })

  onBeforeUnmount(() => observer?.disconnect())
  return { root, visible }
}
