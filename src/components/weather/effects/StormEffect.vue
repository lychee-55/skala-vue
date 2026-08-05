<script setup>
import RainEffect from './RainEffect.vue'
import { useEffectVisibility } from './useEffectVisibility'

const { root, visible } = useEffectVisibility()
</script>

<template><div ref="root" class="storm-effect" :class="{ paused: !visible }" aria-hidden="true"><RainEffect /><i></i></div></template>

<style scoped>
.storm-effect { position: absolute; inset: 0; pointer-events: none; }
i { position: absolute; inset: 0; background: rgba(230, 242, 255, 0.7); opacity: 0; mix-blend-mode: screen; animation: lightning 6s steps(1, end) infinite; }
.paused i { animation-play-state: paused; }
@keyframes lightning { 0%, 71%, 73%, 100% { opacity: 0; } 72%, 74% { opacity: 0.7; } }
@media (prefers-reduced-motion: reduce) { i { animation: none; } }
</style>
