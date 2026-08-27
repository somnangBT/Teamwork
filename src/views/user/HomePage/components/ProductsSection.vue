<template>
  <section id="products" ref="sectionRef" class="py-4 py-lg-5">
    <div class="products-wrapper" ref="wrapperRef">
      <div class="container">
        
        <!-- Awwwards Section Header -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4 mb-lg-5">
          <div>
            <div class="d-flex align-items-center gap-2 mb-2">
              <span class="badge-tag badge-tag-orange">CURATED SELECTION</span>
              <span class="badge-count">{{ products.length }} items</span>
            </div>
            <h2 class="display-6 fw-bold text-dark mb-0">Winning Botanical Products</h2>
          </div>
          <div>
            <router-link to="/products" class="awwwards-pill text-decoration-none">
              <span>View All Products</span>
              <span class="pill-arrow">→</span>
            </router-link>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
          <div class="col" v-for="product in products.slice(0, 8)" :key="product.id">
            <ProductCard :product="product" @buy="$emit('buy', $event)" />
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProductCard from '../../../../components/ProductCard.vue'
import { useProducts } from '../../../../composables/useProducts'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { products } = useProducts()
defineEmits(['buy'])

const sectionRef = ref(null)
const wrapperRef = ref(null)
let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 1. Header Reveal
    gsap.from('.products-wrapper h2, .products-wrapper .badge-tag', {
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 25,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    })

    // 2. Entrance Cards Stagger Reveal on Scroll
    gsap.from('.products-wrapper .col', {
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 35,
      opacity: 0,
      duration: 0.7,
      stagger: 0.06,
      ease: 'power3.out'
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
#products {
  width: 100%;
  position: relative;
  background-color: var(--color-bg);
}

.products-wrapper {
  width: 100%;
  position: relative;
  background-color: var(--color-bg);
}

.pill-arrow {
  font-size: 0.9rem;
}
</style>
