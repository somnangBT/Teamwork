<template>
  <section
    class="bloom-hero-section position-relative overflow-hidden"
    ref="heroContainerRef"
  >
    <div class="hero-media-frame position-relative w-100 overflow-hidden" ref="heroMediaRef">
      <!-- 1. Background Salon Cover (always preserves full artwork & aspect ratio on all screens) -->
      <div class="hero-bg-layer w-100" ref="bgLayerRef">
        <img
          :src="bgImage"
          width="1672"
          height="941"
          alt="Tiki Tiki Women's Beauty and Hair Salon"
          class="hero-bg-image w-100 d-block"
          fetchpriority="high"
          decoding="async"
        />
        <!-- Minimal Soft Edge Overlay to Preserve Bright Cover Colors -->
        <div class="hero-gradient-overlay position-absolute w-100 h-100 top-0 start-0"></div>
      </div>

      <!-- 2. Falling Sakura Petals HTML5 Canvas Animation Layer -->
      <canvas ref="petalsCanvasRef" class="petals-canvas position-absolute w-100 h-100 top-0 start-0"></canvas>
    </div>

    <!-- Accessible screen-reader heading since artwork already displays headline typography -->
    <h1 class="visually-hidden">{{ title || t('hero.title') }}</h1>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  bgImage: {
    type: String,
    default: '/images/coverHero.png'
  }
})

defineEmits(['explore-click', 'discover-click'])

// Element refs
const heroContainerRef = ref(null)
const heroMediaRef = ref(null)
const bgLayerRef = ref(null)
const petalsCanvasRef = ref(null)

let animationFrameId = null
let gsapCtx = null
let resizeHandler = null
let resizeObserver = null

// --- Canvas Falling Sakura Petals Simulation ---
class Petal {
  constructor(w, h) {
    this.reset(w, h, true)
  }

  reset(w, h, randomY = false) {
    this.x = Math.random() * w
    this.y = randomY ? Math.random() * h : -20
    this.size = 10 + Math.random() * 14
    this.speedY = 0.8 + Math.random() * 1.5
    this.speedX = -0.5 + Math.random() * 1.2
    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 1.8
    this.flip = Math.random() * Math.PI
    this.flipSpeed = 0.02 + Math.random() * 0.03
    this.opacity = 0.55 + Math.random() * 0.4
    const hues = [348, 352, 356, 360, 4]
    this.hue = hues[Math.floor(Math.random() * hues.length)]
    this.sat = 75 + Math.random() * 20
    this.light = 80 + Math.random() * 12
  }

  update(w, h, scale = 1) {
    this.y += this.speedY * Math.max(0.55, scale)
    this.x += (this.speedX + Math.sin(this.y * 0.008) * 0.6) * Math.max(0.55, scale)
    this.rotation += this.rotationSpeed
    this.flip += this.flipSpeed

    if (this.y > h + 30 || this.x < -40 || this.x > w + 40) {
      this.reset(w, h, false)
    }
  }

  draw(ctx, scale = 1) {
    const s = this.size * scale
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)
    ctx.scale(1, Math.sin(this.flip))

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(-s * 0.6, -s * 0.8, -s * 0.5, -s * 1.5, 0, -s * 1.6)
    ctx.bezierCurveTo(s * 0.5, -s * 1.5, s * 0.6, -s * 0.8, 0, 0)

    const grad = ctx.createLinearGradient(0, 0, 0, -s * 1.6)
    grad.addColorStop(0, `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${this.opacity})`)
    grad.addColorStop(1, `hsla(${this.hue + 8}, 85%, 92%, ${this.opacity * 0.7})`)

    ctx.fillStyle = grad
    ctx.fill()
    ctx.restore()
  }
}

const initPetalsCanvas = () => {
  const canvas = petalsCanvasRef.value
  if (!canvas) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let width = 1
  let height = 1

  const syncSize = () => {
    if (!canvas) return
    width = canvas.width = Math.max(1, canvas.offsetWidth)
    height = canvas.height = Math.max(1, canvas.offsetHeight)
  }

  syncSize()

  const maxPetals = 32
  const petals = Array.from({ length: maxPetals }, () => new Petal(width, height))

  if (typeof ResizeObserver !== 'undefined' && heroMediaRef.value) {
    resizeObserver = new ResizeObserver(() => {
      syncSize()
    })
    resizeObserver.observe(heroMediaRef.value)
  } else {
    resizeHandler = () => syncSize()
    window.addEventListener('resize', resizeHandler)
  }

  const render = () => {
    ctx.clearRect(0, 0, width, height)
    const scale = Math.min(1, Math.max(0.48, width / 1200))
    const activeCount = Math.max(8, Math.min(maxPetals, Math.floor(width / 36)))
    for (let i = 0; i < activeCount; i++) {
      petals[i].update(width, height, scale)
      petals[i].draw(ctx, scale)
    }
    animationFrameId = requestAnimationFrame(render)
  }
  render()
}

onMounted(() => {
  initPetalsCanvas()

  gsapCtx = gsap.context(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1200px) and (prefers-reduced-motion: no-preference)', () => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroMediaRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })

      if (bgLayerRef.value) {
        scrollTl.to(bgLayerRef.value, { yPercent: 18, ease: 'none' }, 0)
      }
    })
  }, heroContainerRef.value)
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (resizeObserver) resizeObserver.disconnect()
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (gsapCtx) gsapCtx.revert()
})
</script>

<style scoped>
/* Responsive Full-Artwork Hero Section (matches computer aspect ratio on every screen) */
.bloom-hero-section {
  inline-size: 100%;
  padding-block: 0;
  position: relative;
  background-color: var(--storefront-bg, #f7f3ee);
  contain: paint;
}

.hero-media-frame {
  inline-size: 100%;
}

/* Background Layer with Hardware Acceleration */
.hero-bg-layer {
  position: relative;
  inline-size: 100%;
  transform-origin: center center;
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.hero-bg-image {
  display: block;
  inline-size: 100%;
  block-size: auto;
  filter: brightness(1) saturate(1.03);
  will-change: transform;
}

/* Lightened minimal gradient overlay so the cover artwork stays crisp & vibrant */
.hero-gradient-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.04) 0%,
    transparent 24%,
    transparent 76%,
    rgba(0, 0, 0, 0.14) 100%
  );
  pointer-events: none;
}

/* Falling Sakura Canvas */
.petals-canvas {
  pointer-events: none;
  z-index: 2;
  will-change: transform;
}

/* On tablets and mobile, clear the fixed top navbar so 100% of the hero artwork is unobstructed */
@media (max-width: 1199.98px) {
  .bloom-hero-section {
    padding-block-start: 58px;
  }
}
</style>
