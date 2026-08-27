<template>
  <section 
    class="bloom-hero-section position-relative d-flex align-items-center justify-content-center overflow-hidden" 
    ref="heroContainerRef"
  >
    
    <!-- 1. Background Nature Landscape with Scroll Parallax -->
    <div class="hero-bg-layer position-absolute w-100 h-100 top-0 start-0" ref="bgLayerRef">
      <img 
        :src="bgImage" 
        alt="Bloom Haven Nature Landscape" 
        class="hero-bg-image w-100 h-100 object-fit-cover" 
      />
      <!-- Soft Sunlit Gradient Overlay for Perfect Contrast -->
      <div class="hero-gradient-overlay position-absolute w-100 h-100 top-0 start-0"></div>
    </div>

    <!-- 2. Falling Sakura Petals HTML5 Canvas Animation Layer -->
    <canvas ref="petalsCanvasRef" class="petals-canvas position-absolute w-100 h-100 top-0 start-0"></canvas>

    <!-- 3. Hero Content: Headline, Subtitle, and CTAs -->
    <div class="container position-relative z-3 text-center px-3 px-md-4 hero-content-box" ref="contentBoxRef">
      
      <!-- Headline: Where Nature Meets Modern Living -->
      <h1 class="bloom-main-title text-white mb-3" ref="titleRef">
        {{ title }}
      </h1>

      <!-- Subtitle -->
      <p class="bloom-subtitle text-white-50 mb-4 mx-auto" ref="subtitleRef">
        {{ subtitle }}
      </p>

      <!-- Action Buttons -->
      <div class="d-flex flex-wrap align-items-center justify-content-center gap-3 pt-2" ref="ctaGroupRef">
        
        <!-- Primary CTA: Book Grooming Service -->
        <router-link 
          to="/booking" 
          class="btn-bloom-primary rounded-pill fw-semibold text-decoration-none d-inline-flex align-items-center justify-content-center px-4 py-3"
        >
          <span>✨ Book Grooming Service</span>
        </router-link>

        <!-- Secondary CTA: Browse Products -->
        <router-link 
          to="/products" 
          class="btn-bloom-glass rounded-pill fw-semibold text-decoration-none d-inline-flex align-items-center justify-content-center px-4 py-3"
        >
          <span>Browse Pet Products</span>
        </router-link>

      </div>

    </div>

    <!-- 4. Bottom Mouse Scroll Indicator -->
    <div class="bloom-scroll-indicator position-absolute bottom-0 start-50 translate-middle-x mb-4 z-3 text-center" ref="scrollIndicatorRef">
      <div class="scroll-mouse-pill d-inline-flex align-items-start justify-content-center p-1">
        <div class="scroll-mouse-dot"></div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useBooking } from '../composables/useBooking'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { openBooking } = useBooking()

const props = defineProps({
  title: {
    type: String,
    default: 'Where Pets Experience Luxury & Care'
  },
  subtitle: {
    type: String,
    default: 'Gentle grooming, organic spa hydro-baths, and premium veterinary-approved nutrition for your furry companions.'
  },
  bgImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1920'
  }
})

defineEmits(['explore-click', 'discover-click'])

// Element refs
const heroContainerRef = ref(null)
const bgLayerRef = ref(null)
const petalsCanvasRef = ref(null)
const contentBoxRef = ref(null)
const titleRef = ref(null)
const subtitleRef = ref(null)
const ctaGroupRef = ref(null)
const scrollIndicatorRef = ref(null)

let animationFrameId = null
let gsapCtx = null

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

  update(w, h) {
    this.y += this.speedY
    this.x += this.speedX + Math.sin(this.y * 0.008) * 0.6
    this.rotation += this.rotationSpeed
    this.flip += this.flipSpeed

    if (this.y > h + 30 || this.x < -40 || this.x > w + 40) {
      this.reset(w, h, false)
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)
    ctx.scale(1, Math.sin(this.flip))

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(-this.size * 0.6, -this.size * 0.8, -this.size * 0.5, -this.size * 1.5, 0, -this.size * 1.6)
    ctx.bezierCurveTo(this.size * 0.5, -this.size * 1.5, this.size * 0.6, -this.size * 0.8, 0, 0)

    const grad = ctx.createLinearGradient(0, 0, 0, -this.size * 1.6)
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

  const ctx = canvas.getContext('2d')
  let width = (canvas.width = canvas.offsetWidth)
  let height = (canvas.height = canvas.offsetHeight)

  const petalCount = Math.min(32, Math.floor(width / 36))
  const petals = Array.from({ length: petalCount }, () => new Petal(width, height))

  const handleResize = () => {
    if (!canvas) return
    width = canvas.width = canvas.offsetWidth
    height = canvas.height = canvas.offsetHeight
  }
  window.addEventListener('resize', handleResize)

  const render = () => {
    ctx.clearRect(0, 0, width, height)
    petals.forEach((petal) => {
      petal.update(width, height)
      petal.draw(ctx)
    })
    animationFrameId = requestAnimationFrame(render)
  }
  render()
}

onMounted(() => {
  initPetalsCanvas()

  gsapCtx = gsap.context(() => {
    // 1. Entrance Animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })

    if (titleRef.value) {
      tl.from(titleRef.value, { opacity: 0, y: 30, duration: 1.0 }, 0.1)
    }
    if (subtitleRef.value) {
      tl.from(subtitleRef.value, { opacity: 0, y: 20, duration: 0.9 }, 0.25)
    }
    if (ctaGroupRef.value) {
      tl.from(ctaGroupRef.value, { opacity: 0, y: 15, duration: 0.8 }, 0.4)
    }
    if (scrollIndicatorRef.value) {
      tl.from(scrollIndicatorRef.value, { opacity: 0, y: -10, duration: 0.7 }, 0.55)
    }

    // 2. Ultra-Smooth Hardware-Accelerated ScrollTrigger Parallax (No CSS transition fighting)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroContainerRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })

    if (bgLayerRef.value) {
      scrollTl.to(bgLayerRef.value, { yPercent: 22, ease: 'none' }, 0)
    }
    if (contentBoxRef.value) {
      scrollTl.to(contentBoxRef.value, { y: -70, opacity: 0, ease: 'none' }, 0)
    }
    if (scrollIndicatorRef.value) {
      scrollTl.to(scrollIndicatorRef.value, { opacity: 0, ease: 'none' }, 0)
    }
  }, heroContainerRef.value)
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (gsapCtx) gsapCtx.revert()
})
</script>

<style scoped>
/* Full Viewport Bloom Hero Section */
.bloom-hero-section {
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-color: #1a1a1a;
  contain: paint;
}

/* Background Layer with Hardware Acceleration */
.hero-bg-layer {
  transform-origin: center center;
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.hero-bg-image {
  filter: brightness(0.96) saturate(1.08);
  will-change: transform;
}

.hero-gradient-overlay {
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.35) 100%),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, transparent 40%, rgba(0, 0, 0, 0.35) 100%);
  pointer-events: none;
}

/* Falling Sakura Canvas */
.petals-canvas {
  pointer-events: none;
  z-index: 2;
  will-change: transform;
}

/* Hero Content */
.hero-content-box {
  max-width: 900px;
  margin-top: 3.5rem;
  will-change: transform, opacity;
}

/* Luxury Serif Typography */
.bloom-main-title {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-size: clamp(2.6rem, 5.5vw, 4.75rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.025em;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.45);
}

.bloom-subtitle {
  font-size: clamp(1rem, 1.35vw, 1.25rem);
  font-weight: 400;
  line-height: 1.6;
  max-width: 680px;
  color: rgba(255, 255, 255, 0.9) !important;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.55);
}

/* Primary Coral CTA Button */
.btn-bloom-primary {
  background: linear-gradient(135deg, #F06A6A 0%, #E85555 100%);
  color: #ffffff !important;
  font-size: 0.96rem;
  padding: 0.85rem 2rem !important;
  box-shadow: 0 8px 24px rgba(232, 85, 85, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-bloom-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(232, 85, 85, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  background: linear-gradient(135deg, #f37777 0%, #eb5e5e 100%);
}

/* Secondary Frosted Glass CTA Button */
.btn-bloom-glass {
  background: rgba(45, 50, 42, 0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: #ffffff !important;
  font-size: 0.96rem;
  padding: 0.85rem 2rem !important;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-bloom-glass:hover {
  background: rgba(60, 68, 55, 0.75);
  border-color: rgba(255, 255, 255, 0.45);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

/* Mouse Scroll Indicator */
.bloom-scroll-indicator {
  cursor: pointer;
  will-change: transform, opacity;
}

.scroll-mouse-pill {
  width: 22px;
  height: 36px;
  border: 2px solid rgba(255, 255, 255, 0.75);
  border-radius: 9999px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.scroll-mouse-dot {
  width: 4px;
  height: 8px;
  background-color: #ffffff;
  border-radius: 2px;
  animation: scrollMouseAnim 1.8s infinite cubic-bezier(0.65, 0, 0.35, 1);
}

@keyframes scrollMouseAnim {
  0% {
    opacity: 0;
    transform: translateY(2px);
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 0.8;
    transform: translateY(12px);
  }
  100% {
    opacity: 0;
    transform: translateY(16px);
  }
}

@media (max-width: 768px) {
  .hero-content-box {
    margin-top: 4.5rem;
  }
  
  .bloom-main-title {
    font-size: 2.3rem;
  }
  
  .btn-bloom-primary,
  .btn-bloom-glass {
    width: 100%;
    max-width: 280px;
  }
}
</style>
