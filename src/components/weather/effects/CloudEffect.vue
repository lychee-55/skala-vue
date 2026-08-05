<script setup>
import { useEffectVisibility } from './useEffectVisibility'

const { root, visible } = useEffectVisibility()
</script>

<template><div ref="root" class="cloud-effect" :class="{ paused: !visible }" aria-hidden="true"><i></i><i></i><i></i></div></template>

<style scoped>
.cloud-effect { position: absolute; inset: 0; overflow: hidden; opacity: 0.3; pointer-events: none; }
i { position: absolute; width: 42%; height: 11%; border-radius: 999px; background: rgba(255, 255, 255, 0.9); filter: blur(12px); animation: drift 26s linear infinite; }
i::before, i::after { position: absolute; bottom: 12%; border-radius: 50%; background: inherit; content: ''; }
i::before { width: 40%; aspect-ratio: 1; left: 18%; }
i::after { width: 32%; aspect-ratio: 1; right: 18%; }
i:nth-child(1) { top: 18%; left: -38%; }
i:nth-child(2) { top: 48%; left: -50%; transform: scale(0.7); animation-delay: -11s; animation-duration: 34s; }
i:nth-child(3) { top: 70%; left: -35%; transform: scale(0.5); animation-delay: -19s; animation-duration: 29s; }
.paused i { animation-play-state: paused; }
@keyframes drift { to { transform: translateX(360%); } }
@media (prefers-reduced-motion: reduce) { i { animation: none; } }
</style>
