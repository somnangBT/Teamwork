<template>
  <div class="product-detail-page">
    <div class="app-container py-4">
      <!-- Top Breadcrumb & Back Bar -->
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <nav aria-label="breadcrumb" class="small text-muted d-flex align-items-center gap-2 flex-wrap">
          <router-link to="/" class="text-muted text-decoration-none">{{ t('nav.home') }}</router-link>
          <span>›</span>
          <router-link to="/products" class="text-muted text-decoration-none">{{ t('nav.products') }}</router-link>
          <span>›</span>
          <span class="fw-semibold detail-heading text-truncate" style="max-width: 260px;">
            {{ product ? product.name : 'Not Found' }}
          </span>
        </nav>

        <router-link to="/products" class="btn-back-pill text-decoration-none d-inline-flex align-items-center gap-2 small fw-semibold">
          <ArrowLeft :size="15" />
          <span>Back to Products</span>
        </router-link>
      </div>

      <!-- Product Found View -->
      <template v-if="product">
        <!-- Primary Product Showcase Card -->
        <section class="detail-surface rounded-4 p-3 p-md-4 mb-4">
          <div class="row g-4 align-items-center">
            <!-- Left Image -->
            <div class="col-12 col-lg-5">
              <div class="detail-image-box rounded-4 overflow-hidden position-relative">
                <img :src="product.image" :alt="product.name" class="w-100 h-100 object-fit-cover d-block" />
                <span
                  v-if="product.tag"
                  class="position-absolute top-0 start-0 m-3 badge rounded-pill text-white px-3 py-2 fw-semibold"
                  style="background: var(--primary-color, #EA7A38);"
                >
                  {{ product.tag }}
                </span>
              </div>
            </div>

            <!-- Right Details & Actions -->
            <div class="col-12 col-lg-7 d-flex flex-column gap-3">
              <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                <span class="chip-pill chip-soft">{{ product.category }}</span>
                <BaseBadge :status="product.status || 'In Stock'" size="sm" />
              </div>

              <div>
                <h1 class="detail-heading fs-2 fw-bold mb-2">{{ product.name }}</h1>
                <div class="d-flex align-items-baseline gap-3">
                  <span class="fs-2 fw-bolder text-primary">{{ product.price }}</span>
                  <span class="text-muted small">{{ product.stock }} units available</span>
                </div>
              </div>

              <p class="text-muted mb-0" style="line-height: 1.7;">
                {{ product.description }}
              </p>

              <!-- Care & Quality Highlights -->
              <div class="row g-2 pt-1">
                <div class="col-12 col-sm-4">
                  <div class="meta-mini-box rounded-3 p-2 px-3 d-flex align-items-center gap-2 small">
                    <ShieldCheck :size="16" class="text-primary flex-shrink-0" />
                    <span class="fw-medium">Salon Approved</span>
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="meta-mini-box rounded-3 p-2 px-3 d-flex align-items-center gap-2 small">
                    <Truck :size="16" class="text-primary flex-shrink-0" />
                    <span class="fw-medium">Fast Local Delivery</span>
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="meta-mini-box rounded-3 p-2 px-3 d-flex align-items-center gap-2 small">
                    <Sparkles :size="16" class="text-primary flex-shrink-0" />
                    <span class="fw-medium">Virtual Try-On Ready</span>
                  </div>
                </div>
              </div>

              <!-- Purchase Row -->
              <div class="d-flex flex-wrap align-items-center gap-2 pt-2">
                <div class="qty-box d-flex align-items-center rounded-pill px-2 py-1 gap-2">
                  <button
                    type="button"
                    class="btn btn-sm border-0 fw-bold qty-btn"
                    aria-label="Decrease quantity"
                    @click="quantity = Math.max(1, quantity - 1)"
                  >
                    -
                  </button>
                  <span class="fw-bold px-2 detail-heading">{{ quantity }}</span>
                  <button
                    type="button"
                    class="btn btn-sm border-0 fw-bold qty-btn"
                    aria-label="Increase quantity"
                    @click="quantity = Math.min(Math.max(1, product.stock), quantity + 1)"
                  >
                    +
                  </button>
                </div>

                <BaseButton
                  variant="primary"
                  class="flex-grow-1 rounded-pill py-2"
                  :disabled="product.stock <= 0"
                  @click="handleAddToBag"
                >
                  <ShoppingBag :size="17" />
                  <span>{{ product.stock <= 0 ? t('products.outOfStock') : t('products.addToBag') }}</span>
                </BaseButton>

                <button
                  type="button"
                  class="btn-fav-outline rounded-circle d-flex align-items-center justify-content-center"
                  :class="{ 'is-fav': isFav }"
                  :aria-label="isFav ? 'Remove from favorites' : 'Save to favorites'"
                  @click="handleFavorite(product)"
                >
                  <Heart :size="18" :fill="isFav ? 'currentColor' : 'none'" />
                </button>
              </div>

              <div>
                <button
                  type="button"
                  class="btn-studio-jump rounded-pill px-4 py-2 small fw-semibold d-inline-flex align-items-center gap-2"
                  @click="scrollToStudio"
                >
                  <Sparkles :size="15" />
                  <span>Preview Styling in VELL Studio ↓</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Full-Width VELL Virtual Try-On Studio Section -->
        <section ref="studioSectionRef" class="detail-surface rounded-4 p-3 p-md-4 mb-5">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="chip-pill chip-accent d-inline-flex align-items-center gap-1">
                  <Sparkles :size="12" />
                  <span>INTERACTIVE PREVIEW</span>
                </span>
              </div>
              <h2 class="detail-heading fs-4 fw-bold m-0">VELL Virtual Try-On Studio</h2>
              <p class="text-muted small m-0">Preview outfits, poses, lighting filters, and full character styling in real time.</p>
            </div>

            <div class="d-flex align-items-center gap-2">
              <button
                type="button"
                class="btn-back-pill small fw-semibold d-inline-flex align-items-center gap-2"
                @click="isFullscreenStudio = true"
              >
                <Maximize2 :size="14" />
                <span>Full Screen</span>
              </button>
              <a
                href="/vell-studio.html"
                target="_blank"
                rel="noopener"
                class="btn-back-pill text-decoration-none small fw-semibold d-inline-flex align-items-center gap-2"
              >
                <ExternalLink :size="14" />
                <span>Open Tab</span>
              </a>
            </div>
          </div>

          <div class="studio-frame-wrap rounded-4 overflow-hidden">
            <iframe
              src="/vell-studio.html"
              title="VELL Virtual Styling Studio"
              class="studio-iframe"
            ></iframe>
          </div>
        </section>

        <!-- Fullscreen Studio Overlay -->
        <div v-if="isFullscreenStudio" class="studio-fullscreen-overlay">
          <button
            type="button"
            class="btn-close-fullscreen rounded-pill px-3 py-2 small fw-semibold d-inline-flex align-items-center gap-2"
            @click="isFullscreenStudio = false"
          >
            <X :size="16" />
            <span>Exit Full Screen</span>
          </button>
          <iframe
            src="/vell-studio.html"
            title="VELL Virtual Styling Studio Fullscreen"
            class="w-100 h-100 border-0 d-block"
          ></iframe>
        </div>

        <!-- Related Products -->
        <section v-if="relatedProducts.length > 0">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h3 class="detail-heading fs-5 fw-bold m-0">More Care Essentials</h3>
            <router-link to="/products" class="small fw-semibold text-primary text-decoration-none">
              View All →
            </router-link>
          </div>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 g-xl-4">
            <div class="col" v-for="item in relatedProducts" :key="item.id">
              <ProductCard
                :product="item"
                @buy="handleRelatedBuy"
                @favorite="handleFavorite"
                @view="goToProduct"
              />
            </div>
          </div>
        </section>
      </template>

      <!-- Not Found State -->
      <div v-else class="detail-surface rounded-4 p-5 text-center my-4">
        <div class="fs-1 mb-3">📦</div>
        <h2 class="detail-heading fw-bold mb-2">Product Not Found</h2>
        <p class="text-muted small mb-4">The item you are looking for may have been removed or is unavailable.</p>
        <router-link to="/products" class="btn-tnak-primary text-decoration-none px-4 py-2 d-inline-block">
          Browse Products
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, ShoppingBag, Heart, Sparkles,
  ShieldCheck, Truck, Maximize2, ExternalLink, X
} from '@lucide/vue'
import ProductCard from '../../../components/ProductCard.vue'
import BaseBadge from '../../../components/base/BaseBadge.vue'
import BaseButton from '../../../components/base/BaseButton.vue'
import { useProducts } from '../../../composables/useProducts'
import { useCart } from '../../../composables/useCart'
import { useProfile } from '../../../composables/useProfile'
import { useI18n } from '../../../composables/useI18n'
import { useToastStore } from '../../../stores/toast'

const route = useRoute()
const router = useRouter()
const { products } = useProducts()
const { addToCart } = useCart()
const { isProductFavorite, toggleFavoriteProduct } = useProfile()
const { t } = useI18n()
const toastStore = useToastStore()

const quantity = ref(1)
const studioSectionRef = ref(null)
const isFullscreenStudio = ref(false)

const product = computed(() => {
  return products.value.find(p => String(p.id) === String(route.params.id)) || null
})

const isFav = computed(() => (product.value ? isProductFavorite(product.value.id) : false))

const relatedProducts = computed(() => {
  if (!product.value) return []
  const others = products.value.filter(p => String(p.id) !== String(product.value.id))
  const sameCat = others.filter(p => p.category === product.value.category)
  const diffCat = others.filter(p => p.category !== product.value.category)
  return [...sameCat, ...diffCat].slice(0, 4)
})

watch(() => route.params.id, () => {
  quantity.value = 1
  isFullscreenStudio.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const handleAddToBag = () => {
  if (!product.value || product.value.stock <= 0) return
  addToCart(product.value, quantity.value)
  toastStore.showToast(`${product.value.name} — ${t('products.addedToast')}`, 'success')
}

const handleRelatedBuy = (item) => {
  if (item.stock <= 0) {
    toastStore.showToast(`${item.name} is currently out of stock.`, 'warning')
    return
  }
  addToCart(item, 1)
  toastStore.showToast(`${item.name} — ${t('products.addedToast')}`, 'success')
}

const handleFavorite = (item) => {
  if (!item) return
  const added = toggleFavoriteProduct(item.id)
  toastStore.showToast(
    added ? `${item.name}: ${t('products.savedToast')}` : `${item.name}: ${t('products.removedFavToast')}`,
    'info'
  )
}

const goToProduct = (item) => {
  router.push({ name: 'product-detail', params: { id: item.id } })
}

const scrollToStudio = () => {
  studioSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const handleEsc = (e) => {
  if (e.key === 'Escape' && isFullscreenStudio.value) {
    isFullscreenStudio.value = false
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.product-detail-page {
  background-color: color-mix(in srgb, var(--storefront-bg, #f4f6f9) 76%, transparent);
  min-height: 100vh;
  padding-top: 74px;
  padding-bottom: 60px;
}

.detail-heading {
  color: var(--text-heading-color, #0f172a);
}

.detail-surface {
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  box-shadow: none !important;
}

.detail-image-box {
  aspect-ratio: 1 / 1;
  background-color: var(--surface-ground, #f1f5f9);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
}

.btn-back-pill {
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  color: var(--text-heading-color, #0f172a);
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  transition: border-color 0.18s ease, color 0.18s ease;
}

.btn-back-pill:hover {
  border-color: var(--primary-color, #EA7A38);
  color: var(--primary-color, #EA7A38);
}

.chip-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.7rem;
  border-radius: 9999px;
}

.chip-soft {
  background-color: var(--surface-ground, #f1f5f9);
  color: var(--text-secondary-color, #475569);
  border: 1px solid var(--border-clr, #e2e8f0);
}

.chip-accent {
  background-color: var(--primary-color-soft, rgba(234, 122, 56, 0.12));
  color: var(--primary-color, #EA7A38);
  border: 1px solid var(--primary-color-border, rgba(234, 122, 56, 0.3));
}

.meta-mini-box {
  background-color: var(--surface-ground, #f8fafc);
  border: 1px solid var(--border-clr, #e2e8f0);
  color: var(--text-heading-color, #0f172a);
}

.qty-box {
  background-color: var(--surface-ground, #f8fafc);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
}

.qty-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: var(--text-heading-color, #0f172a);
}

.btn-fav-outline {
  width: 44px;
  height: 44px;
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  color: var(--text-heading-color, #0f172a);
  flex-shrink: 0;
  transition: border-color 0.18s ease, color 0.18s ease;
}

.btn-fav-outline:hover,
.btn-fav-outline.is-fav {
  border-color: #ef4444;
  color: #ef4444;
}

.btn-studio-jump {
  background-color: var(--primary-color-soft, rgba(234, 122, 56, 0.12));
  border: 1.5px solid var(--primary-color-border, rgba(234, 122, 56, 0.35));
  color: var(--primary-color, #EA7A38);
  transition: background-color 0.18s ease, color 0.18s ease;
}

.btn-studio-jump:hover {
  background-color: var(--primary-color, #EA7A38);
  color: #ffffff;
}

.studio-frame-wrap {
  background-color: #cfd2d4;
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
}

.studio-iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 480px;
  border: 0;
  display: block;
}

.studio-fullscreen-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: #cfd2d4;
}

.btn-close-fullscreen {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2010;
  background: rgba(24, 24, 28, 0.82);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
}
</style>
