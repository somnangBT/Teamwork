<template>
  <div
    class="premium-bg-stage position-fixed w-100 h-100 top-0 start-0 overflow-hidden"
    :style="spotlightStyle"
    aria-hidden="true"
  >
    <!-- 1. Flowing Silk Aurora Gradient Blobs -->
    <div class="aurora-mesh w-100 h-100 position-relative">
      <div class="aurora-orb orb-warm"></div>
      <div class="aurora-orb orb-blush"></div>
      <div class="aurora-orb orb-gold"></div>
      <div class="aurora-orb orb-pearl"></div>
    </div>

    <!-- 2. Pointer-Responsive Ambient Spotlight -->
    <div class="ambient-spotlight"></div>

    <!-- 3. Flowing Botanical Silk Ribbon Waves + Custom Appearance Shapes -->
    <svg
      class="premium-bg-shapes position-absolute inset-0 w-100 h-100"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ribbonGradWarm" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--primary-color, #EA7A38)" stop-opacity="0.16" />
          <stop offset="50%" stop-color="#f48fb1" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#f6c177" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="ribbonStroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--primary-color, #EA7A38)" stop-opacity="0" />
          <stop offset="35%" stop-color="var(--primary-color, #EA7A38)" stop-opacity="0.28" />
          <stop offset="70%" stop-color="#f48fb1" stop-opacity="0.22" />
          <stop offset="100%" stop-color="#f6c177" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Gentle Animated Silk Waves -->
      <g class="ribbon-wave wave-slow">
        <path
          d="M-120 700 C 260 540, 620 820, 1020 620 C 1240 510, 1410 560, 1580 460 V940 H-120 Z"
          fill="url(#ribbonGradWarm)"
        />
        <path
          d="M-120 695 C 260 535, 620 815, 1020 615 C 1240 505, 1410 555, 1580 455"
          stroke="url(#ribbonStroke)"
          stroke-width="2"
        />
      </g>

      <g class="ribbon-wave wave-reverse">
        <path
          d="M-120 220 C 310 340, 690 80, 1090 250 C 1290 335, 1430 190, 1580 240 V-40 H-120 Z"
          fill="url(#ribbonGradWarm)"
          opacity="0.65"
        />
        <path
          d="M-120 225 C 310 345, 690 85, 1090 255 C 1290 340, 1430 195, 1580 245"
          stroke="url(#ribbonStroke)"
          stroke-width="1.5"
        />
      </g>

      <!-- Dynamic Appearance Shapes -->
      <template v-for="(shape, index) in shapes" :key="index">
        <circle
          v-if="shape.type === 'circle'"
          :cx="shape.cx"
          :cy="shape.cy"
          :r="shape.r"
          :fill="shape.fill"
          :fill-opacity="shape.opacity"
          class="floating-svg-shape"
          :style="{ animationDelay: `${(index * -4.5)}s` }"
        />
        <path
          v-else-if="shape.type === 'path'"
          :d="shape.d"
          :fill="shape.fill"
          :fill-opacity="shape.opacity"
          class="floating-svg-path"
          :style="{ animationDelay: `${(index * -6)}s` }"
        />
      </template>
    </svg>

    <!-- 4. Rising Luminous Champagne & Pearl Bokeh Specs -->
    <div class="shimmer-particles">
      <span
        v-for="p in particles"
        :key="p.id"
        class="shimmer-dot"
        :style="{
          left: p.left,
          width: `${p.size}px`,
          height: `${p.size}px`,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          '--drift-x': `${p.driftX}px`
        }"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const shapes = ref([])
const pointer = ref({ x: 50, y: 38 })
let rafPending = false
let nextX = 50
let nextY = 38

const spotlightStyle = computed(() => ({
  '--spot-x': `${pointer.value.x.toFixed(1)}%`,
  '--spot-y': `${pointer.value.y.toFixed(1)}%`
}))

const particles = [
  { id: 1, left: '7%', size: 6, duration: 19, delay: -2, driftX: 28 },
  { id: 2, left: '14%', size: 10, duration: 24, delay: -9, driftX: -22 },
  { id: 3, left: '23%', size: 5, duration: 17, delay: -5, driftX: 18 },
  { id: 4, left: '34%', size: 8, duration: 23, delay: -14, driftX: -30 },
  { id: 5, left: '43%', size: 6, duration: 20, delay: -7, driftX: 24 },
  { id: 6, left: '54%', size: 11, duration: 26, delay: -11, driftX: -18 },
  { id: 7, left: '63%', size: 5, duration: 18, delay: -3, driftX: 32 },
  { id: 8, left: '72%', size: 9, duration: 25, delay: -16, driftX: -26 },
  { id: 9, left: '81%', size: 7, duration: 21, delay: -8, driftX: 20 },
  { id: 10, left: '90%', size: 10, duration: 22, delay: -12, driftX: -24 },
  { id: 11, left: '29%', size: 4, duration: 16, delay: -1, driftX: 16 },
  { id: 12, left: '77%', size: 6, duration: 20, delay: -15, driftX: 22 }
]

const defaultShapes = [
  { type: 'circle', cx: '12%', cy: '14%', r: 280, fill: 'var(--primary-color)', opacity: 0.05 },
  { type: 'circle', cx: '88%', cy: '82%', r: 340, fill: 'var(--primary-color)', opacity: 0.05 },
  { type: 'circle', cx: '52%', cy: '48%', r: 240, fill: 'var(--text-color)', opacity: 0.025 }
]

const generateShapes = () => {
  const newShapes = []
  const numCircles = Math.floor(Math.random() * 3) + 3
  for (let i = 0; i < numCircles; i++) {
    const isPrimary = Math.random() > 0.3
    newShapes.push({
      type: 'circle',
      cx: `${Math.floor(Math.random() * 100)}%`,
      cy: `${Math.floor(Math.random() * 100)}%`,
      r: Math.floor(Math.random() * 280) + 140,
      fill: isPrimary ? 'var(--primary-color)' : 'var(--text-color)',
      opacity: isPrimary ? (Math.random() * 0.035 + 0.025).toFixed(3) : (Math.random() * 0.02 + 0.015).toFixed(3)
    })
  }
  const numPaths = Math.floor(Math.random() * 2) + 1
  for (let i = 0; i < numPaths; i++) {
    const startY = Math.floor(Math.random() * 900)
    const cp1x = Math.floor(Math.random() * 600) + 200
    const cp1y = Math.floor(Math.random() * 900)
    const cp2x = Math.floor(Math.random() * 600) + 600
    const cp2y = Math.floor(Math.random() * 900)
    const endY = Math.floor(Math.random() * 900)
    newShapes.push({
      type: 'path',
      d: `M-100 ${startY}C${cp1x} ${cp1y} ${cp2x} ${cp2y} 1500 ${endY}V900H-100Z`,
      fill: 'var(--primary-color)',
      opacity: (Math.random() * 0.025 + 0.015).toFixed(3)
    })
  }
  shapes.value = newShapes
}

const loadShapes = () => {
  const saved = localStorage.getItem('app-Appearance')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.bgStyle === 'random') {
        generateShapes()
        return
      }
    } catch (e) {}
  }
  shapes.value = defaultShapes
}

const handlePointerMove = (e) => {
  nextX = (e.clientX / Math.max(window.innerWidth, 1)) * 100
  nextY = (e.clientY / Math.max(window.innerHeight, 1)) * 100
  if (rafPending) return
  rafPending = true
  requestAnimationFrame(() => {
    pointer.value.x = pointer.value.x + (nextX - pointer.value.x) * 0.25
    pointer.value.y = pointer.value.y + (nextY - pointer.value.y) * 0.25
    rafPending = false
  })
}

onMounted(() => {
  loadShapes()
  window.addEventListener('bg-shapes-updated', loadShapes)
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('bg-shapes-updated', loadShapes)
  window.removeEventListener('pointermove', handlePointerMove)
})
</script>

<style scoped>
.premium-bg-stage {
  z-index: 0;
  pointer-events: none;
  contain: layout style paint;
}

.aurora-mesh {
  position: absolute;
  inset: -12%;
}

.aurora-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(78px);
  will-change: transform, opacity;
}

.orb-warm {
  width: clamp(340px, 42vw, 620px);
  height: clamp(340px, 42vw, 620px);
  top: -8%;
  left: -6%;
  background: radial-gradient(circle at 35% 35%, color-mix(in srgb, var(--primary-color, #EA7A38) 38%, transparent), transparent 72%);
  animation: orbOrbitA 24s ease-in-out infinite alternate;
}

.orb-blush {
  width: clamp(300px, 38vw, 560px);
  height: clamp(300px, 38vw, 560px);
  top: 18%;
  right: -8%;
  background: radial-gradient(circle at 50% 50%, rgba(244, 143, 177, 0.26), transparent 70%);
  animation: orbOrbitB 29s ease-in-out infinite alternate;
}

.orb-gold {
  width: clamp(320px, 40vw, 580px);
  height: clamp(320px, 40vw, 580px);
  bottom: -14%;
  left: 24%;
  background: radial-gradient(circle at 45% 45%, rgba(246, 193, 119, 0.28), transparent 72%);
  animation: orbOrbitC 33s ease-in-out infinite alternate;
}

.orb-pearl {
  width: clamp(260px, 32vw, 460px);
  height: clamp(260px, 32vw, 460px);
  top: 48%;
  left: 55%;
  background: radial-gradient(circle at 50% 50%, rgba(196, 181, 253, 0.2), transparent 72%);
  animation: orbOrbitB 26s ease-in-out infinite alternate-reverse;
}

[data-theme="dark"] .orb-warm {
  background: radial-gradient(circle at 35% 35%, color-mix(in srgb, var(--primary-color, #EA7A38) 28%, transparent), transparent 72%);
}

[data-theme="dark"] .orb-blush {
  background: radial-gradient(circle at 50% 50%, rgba(219, 112, 147, 0.18), transparent 70%);
}

[data-theme="dark"] .orb-gold {
  background: radial-gradient(circle at 45% 45%, rgba(245, 158, 11, 0.14), transparent 72%);
}

[data-theme="dark"] .orb-pearl {
  background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.14), transparent 72%);
}

.ambient-spotlight {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    460px circle at var(--spot-x, 50%) var(--spot-y, 38%),
    color-mix(in srgb, var(--primary-color, #EA7A38) 12%, transparent),
    transparent 68%
  );
  transition: background 0.25s ease-out;
}

.premium-bg-shapes {
  inset: 0;
}

.ribbon-wave {
  transform-box: fill-box;
  transform-origin: center;
  will-change: transform;
}

.wave-slow {
  animation: waveGlideA 22s ease-in-out infinite alternate;
}

.wave-reverse {
  animation: waveGlideB 26s ease-in-out infinite alternate;
}

.floating-svg-shape {
  transform-box: fill-box;
  transform-origin: center;
  animation: floatPulse 18s ease-in-out infinite alternate;
}

.floating-svg-path {
  transform-box: fill-box;
  transform-origin: center;
  animation: waveGlideA 24s ease-in-out infinite alternate-reverse;
}

.shimmer-particles {
  position: absolute;
  inset: 0;
}

.shimmer-dot {
  position: absolute;
  bottom: -24px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, color-mix(in srgb, var(--primary-color, #EA7A38) 55%, transparent) 60%, transparent 100%);
  box-shadow: 0 0 12px color-mix(in srgb, var(--primary-color, #EA7A38) 28%, transparent);
  opacity: 0;
  will-change: transform, opacity;
  animation-name: riseBokeh;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes orbOrbitA {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(14vw, 12vh, 0) scale(1.14); }
  100% { transform: translate3d(6vw, 24vh, 0) scale(0.95); }
}

@keyframes orbOrbitB {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-16vw, 10vh, 0) scale(1.1); }
  100% { transform: translate3d(-8vw, -12vh, 0) scale(1.04); }
}

@keyframes orbOrbitC {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(12vw, -14vh, 0) scale(1.12); }
  100% { transform: translate3d(-10vw, -6vh, 0) scale(0.96); }
}

@keyframes waveGlideA {
  0% { transform: translate3d(-18px, 0, 0) scaleY(1); }
  100% { transform: translate3d(24px, -16px, 0) scaleY(1.06); }
}

@keyframes waveGlideB {
  0% { transform: translate3d(18px, 0, 0) scaleY(1); }
  100% { transform: translate3d(-22px, 14px, 0) scaleY(1.05); }
}

@keyframes floatPulse {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(20px, -18px, 0) scale(1.08); }
}

@keyframes riseBokeh {
  0% {
    transform: translate3d(0, 0, 0) scale(0.75);
    opacity: 0;
  }
  18% {
    opacity: 0.65;
  }
  80% {
    opacity: 0.45;
  }
  100% {
    transform: translate3d(var(--drift-x, 20px), -105vh, 0) scale(1.2);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .aurora-orb,
  .ribbon-wave,
  .floating-svg-shape,
  .floating-svg-path,
  .shimmer-dot {
    animation: none !important;
  }

  .shimmer-dot {
    display: none;
  }
}
</style>

<style>
/* Hide the premium background motion layer when disabled in Appearance Settings */
html[data-background-shapes="false"] .premium-bg-stage {
  display: none !important;
}
</style>
