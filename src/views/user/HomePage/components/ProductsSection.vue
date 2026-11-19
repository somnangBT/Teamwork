<template>
  <section id="products" ref="sectionRef" class="py-4 py-lg-5">
    <div class="products-wrapper" ref="wrapperRef">
      <div class="container">
        <!-- Section Header -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4 mb-lg-5">
          <div>
            <div class="d-flex align-items-center gap-2 mb-2">
              <span class="badge-tag-pill">{{ t('home.curatedBadge') }}</span>
              <span class="badge-count-pill">{{ products.length }} items</span>
            </div>
            <h2 class="display-6 fw-bold mb-0 section-heading">{{ t('home.productsTitle') }}</h2>
          </div>
          <div>
            <router-link to="/products" class="awwwards-pill text-decoration-none">
              <span>{{ t('home.viewAllProducts') }}</span>
              <span class="pill-arrow">→</span>
            </router-link>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
          <div class="col" v-for="product in products.slice(0, 8)" :key="product.id">
            <ProductCard
              :product="product"
              @buy="handleBuy"
              @favorite="handleFavorite"
              @view="openQuickView"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../../../../components/ProductCard.vue'
import { useProducts } from '../../../../composables/useProducts'
import { useCart } from '../../../../composables/useCart'
import { useProfile } from '../../../../composables/useProfile'
import { useI18n } from '../../../../composables/useI18n'
import { useToastStore } from '../../../../stores/toast'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const { products } = useProducts()
const { addToCart } = useCart()
const { toggleFavoriteProduct } = useProfile()
const { t } = useI18n()
const toastStore = useToastStore()

const handleBuy = (product, qty = 1) => {
  addToCart(product, qty)
  toastStore.showToast(`${product.name} — ${t('products.addedToast')}`, 'success')
}

const handleFavorite = (product) => {
  const added = toggleFavoriteProduct(product.id)
  toastStore.showToast(
    added ? `${product.name}: ${t('products.savedToast')}` : `${product.name}: ${t('products.removedFavToast')}`,
    'info'
  )
}

const openQuickView = (product) => {
  router.push({ name: 'product-detail', params: { id: product.id } })
}

const sectionRef = ref(null)
const wrapperRef = ref(null)
let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.products-wrapper h2, .products-wrapper .badge-tag-pill', {
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

    gsap.from('.products-wrapper .col', {
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.65,
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
  background-color: color-mix(in srgb, var(--color-bg) 76%, transparent);
}

.products-wrapper {
  width: 100%;
  position: relative;
  background-color: transparent;
}

.section-heading {
  color: var(--text-heading-color, #0f172a);
}

.badge-tag-pill {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.7rem;
  border-radius: 9999px;
  background: var(--primary-color-soft, rgba(234, 122, 56, 0.12));
  color: var(--primary-color, #EA7A38);
}

.badge-count-pill {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--secondary-color, #64748b);
}

.pill-arrow {
  font-size: 0.9rem;
}
</style>
