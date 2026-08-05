<script setup>
import { useEffectVisibility } from './useEffectVisibility'

const { root, visible } = useEffectVisibility()
</script>

<template><div ref="root" class="sun-effect" :class="{ paused: !visible }" aria-hidden="true"><i class="sun-core"></i><i class="flare flare-one"></i><i class="flare flare-two"></i></div></template>

<style scoped>
.sun-effect { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.sun-core { position: absolute; top: -16%; right: -5%; width: min(46vw, 330px); aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle, rgba(255, 252, 200, 0.95), rgba(255, 230, 122, 0.35) 35%, transparent 68%); filter: blur(1px); animation: breathe 6s ease-in-out infinite alternate; }
.flare { position: absolute; border-radius: 50%; background: rgba(255, 250, 212, 0.55); filter: blur(3px); animation: float 9s ease-in-out infinite; }
.flare-one { top: 38%; right: 22%; width: 10px; height: 10px; }
.flare-two { top: 53%; right: 38%; width: 6px; height: 6px; animation-delay: -4s; }
.paused i { animation-play-state: paused; }
@keyframes breathe { to { transform: scale(1.12); opacity: 0.75; } }
@keyframes float { 50% { transform: translate(-18px, -14px); } }
@media (prefers-reduced-motion: reduce) { .sun-core, .flare { animation: none; } }
</style>
