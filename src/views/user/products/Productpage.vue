<template>
  <div class="product-page-container">
    <!-- Full-Width Split Hero Band (stays side-by-side across all viewports) -->
    <section class="product-hero-band border-bottom d-flex align-items-center">
      <div class="app-container py-2 py-md-3 w-100">
        <div class="product-hero-row d-flex align-items-center justify-content-between">
          <!-- Left: Botanical Accent + Page Title + Breadcrumb -->
          <div class="product-hero-copy">
            <div class="product-hero-accent mb-1 mb-sm-2" aria-hidden="true">
              <svg width="34" height="24" viewBox="0 0 34 24" fill="none">
                <path
                  d="M15.5 19.5C15.5 11.5 9.8 5.2 2.5 4.2C2.2 11.4 7.7 17.8 15.5 19.5Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.5 19.5C18.5 12.8 23.2 7.5 29.5 6.6C29.8 12.7 25.1 18.1 18.5 19.5Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h1 class="product-hero-heading fw-bolder m-0 mb-1 mb-sm-2">{{ t('products.pageTitle') }}</h1>
            <nav aria-label="breadcrumb" class="product-hero-breadcrumb text-muted d-flex flex-wrap align-items-center gap-1 gap-sm-2">
              <router-link to="/" class="breadcrumb-home-link text-decoration-none">{{ t('nav.home') }}</router-link>
              <span aria-hidden="true">›</span>
              <span class="fw-semibold page-title">{{ t('nav.products') }}</span>
            </nav>
          </div>

          <!-- Right: Women's Salon & Botanical Shampoo/Skincare Showcase -->
          <div class="product-hero-gallery ms-auto">
            <div class="hero-gallery-card hero-card-portrait overflow-hidden">
              <img
                src="/images/hero_model.jpg"
                alt="Women's Beauty and Hair Salon"
                class="w-100 h-100 d-block object-fit-cover"
                style="object-position: center 20%;"
              />
            </div>
            <div class="hero-gallery-card hero-card-main overflow-hidden">
              <img
                src="/images/haircare.jpg"
                alt="Botanical Nourishing Shampoo and Hair Serum"
                class="w-100 h-100 d-block object-fit-cover"
              />
            </div>
            <div class="hero-gallery-card hero-card-side overflow-hidden">
              <img
                src="/images/skincare.jpg"
                alt="Botanical Serum and Glow Moisturizer"
                class="w-100 h-100 d-block object-fit-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <main class="collection-main py-4">
      <div class="app-container">

        <!-- Page Toolbar Row -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div class="d-flex align-items-center gap-2">
            <h2 class="page-title fs-5 fw-bold m-0">{{ selectedCategory === 'All' ? t('nav.products') : selectedCategory }}</h2>
            <span class="badge-count">{{ filteredProducts.length }}</span>
          </div>

          <div class="d-flex align-items-center gap-2">
            <div class="dropdown position-relative" ref="sortRef">
              <button
                type="button"
                class="awwwards-pill rounded-pill"
                @click.stop="isSortOpen = !isSortOpen"
              >
                <ArrowUpDown :size="14" />
                <span>{{ sortBy === 'featured' ? 'Sort: Featured' : (sortBy === 'low' ? 'Price: Low → High' : 'Price: High → Low') }}</span>
                <ChevronDown :size="14" />
              </button>
              <ul class="dropdown-menu dropdown-menu-end rounded-3 p-2" :class="{ show: isSortOpen }">
                <li><button type="button" class="dropdown-item rounded-2" :class="{ active: sortBy === 'featured' }" @click="selectSort('featured')">Featured</button></li>
                <li><button type="button" class="dropdown-item rounded-2" :class="{ active: sortBy === 'low' }" @click="selectSort('low')">Price: Low to High</button></li>
                <li><button type="button" class="dropdown-item rounded-2" :class="{ active: sortBy === 'high' }" @click="selectSort('high')">Price: High to Low</button></li>
              </ul>
            </div>

            <div class="grid-switcher d-flex align-items-center gap-1 p-1 rounded-3 border">
              <button
                type="button"
                class="btn-view-toggle p-1 rounded-2"
                :class="{ active: gridCols === 3 }"
                @click="gridCols = 3"
                aria-label="3 Column Grid"
              >
                <LayoutGrid :size="17" />
              </button>
              <button
                type="button"
                class="btn-view-toggle p-1 rounded-2"
                :class="{ active: gridCols === 2 }"
                @click="gridCols = 2"
                aria-label="2 Column Grid"
              >
                <Columns2 :size="17" />
              </button>
            </div>
          </div>
        </div>

        <!-- 2-COLUMN LAYOUT: LEFT SIDEBAR FILTER + RIGHT PRODUCT GRID (Reference Style) -->
        <div class="row g-4 align-items-start">
          <!-- LEFT SIDEBAR FILTER -->
          <aside class="col-12 col-lg-3">
            <div class="sidebar-filter-card rounded-4 p-3">
              <!-- Sidebar Header -->
              <div class="sidebar-header d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                <div class="d-flex align-items-center gap-2">
                  <div class="sidebar-filter-icon rounded-3 d-flex align-items-center justify-content-center">
                    <Filter :size="16" />
                  </div>
                  <span class="fw-bold small page-title">Filter Categories</span>
                </div>
                <div class="d-flex align-items-center gap-1" aria-hidden="true">
                  <span class="dot-ind" style="background: #EA7A38;"></span>
                  <span class="dot-ind" style="background: #10b981;"></span>
                  <span class="dot-ind" style="background: #f59e0b;"></span>
                </div>
              </div>

              <!-- Search Input Inside Sidebar -->
              <div class="search-pill-wrap position-relative mb-3">
                <Search :size="15" class="search-pill-icon text-muted" />
                <input
                  v-model="searchQuery"
                  type="search"
                  :placeholder="t('products.searchPlaceholder')"
                  :aria-label="t('products.searchPlaceholder')"
                  class="sidebar-search-input"
                />
              </div>

              <!-- Vertical Category List Buttons -->
              <div class="d-flex flex-column gap-2 mb-3">
                <button
                  v-for="cat in categories"
                  :key="cat"
                  type="button"
                  class="sidebar-cat-btn d-flex align-items-center justify-content-between px-3 py-2 rounded-3"
                  :class="{ active: selectedCategory === cat }"
                  @click="selectedCategory = cat"
                >
                  <span class="d-flex align-items-center gap-2">
                    <component :is="getCategoryIcon(cat)" :size="16" />
                    <span class="small fw-semibold">{{ cat === 'All' ? 'All Products' : cat }}</span>
                  </span>
                  <span class="cat-count-badge">{{ getCategoryCount(cat) }}</span>
                </button>
              </div>

              <div class="main-divider my-3"></div>

              <!-- Availability & Saved Quick Filters -->
              <div class="d-flex flex-column gap-2">
                <label class="small fw-semibold text-muted mb-0">{{ t('products.stockStatus') }}</label>
                <div class="d-flex flex-wrap gap-1">
                  <button
                    v-for="st in ['All', 'In Stock', 'Low Stock']"
                    :key="st"
                    type="button"
                    class="mini-filter-chip rounded-pill px-2.5 py-1"
                    :class="{ active: selectedStock === st }"
                    @click="selectedStock = st"
                  >
                    {{ st }}
                  </button>
                </div>

                <button
                  type="button"
                  class="sidebar-cat-btn d-flex align-items-center justify-content-between px-3 py-2 rounded-3 mt-2"
                  :class="{ active: onlyFavorites }"
                  @click="onlyFavorites = !onlyFavorites"
                >
                  <span class="d-flex align-items-center gap-2">
                    <Heart :size="15" :fill="onlyFavorites ? 'currentColor' : 'none'" />
                    <span class="small fw-semibold">{{ t('products.favoritesOnly') }}</span>
                  </span>
                </button>

                <button
                  v-if="activeFilterCount > 0"
                  type="button"
                  class="btn-reset-sidebar rounded-3 py-2 mt-1 small fw-semibold d-flex align-items-center justify-content-center gap-1"
                  @click="resetAllFilters"
                >
                  <RotateCcw :size="13" />
                  <span>{{ t('products.resetFilters') }} ({{ activeFilterCount }})</span>
                </button>
              </div>
            </div>
          </aside>

          <!-- RIGHT PRODUCT GRID -->
          <div class="col-12 col-lg-9">
            <div
              v-if="filteredProducts.length > 0"
              class="row g-3 g-xl-4"
              :class="gridCols === 3 ? 'row-cols-1 row-cols-sm-2 row-cols-xl-3' : 'row-cols-1 row-cols-sm-2'"
            >
              <div class="col" v-for="product in filteredProducts" :key="product.id">
                <ProductCard
                  :product="product"
                  @buy="handleBuy"
                  @favorite="handleFavorite"
                  @view="openProductDetail"
                />
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state text-center py-5 rounded-4 border p-4">
              <div class="fs-1 mb-3">🔍</div>
              <h4 class="fw-bold mb-2 page-title">{{ t('products.emptyTitle') }}</h4>
              <p class="text-muted small mb-4">{{ t('products.emptyDesc') }}</p>
              <button type="button" class="btn-tnak-primary px-4" @click="resetAllFilters">
                {{ t('products.clearAll') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Search, ChevronDown, Heart, RotateCcw, LayoutGrid, Columns2,
  ArrowUpDown, Filter, Grid2x2, Droplets, Sparkles, Sun, Wand2
} from '@lucide/vue'
import ProductCard from '../../../components/ProductCard.vue'
import { useProducts } from '../../../composables/useProducts'
import { useCart } from '../../../composables/useCart'
import { useProfile } from '../../../composables/useProfile'
import { useI18n } from '../../../composables/useI18n'
import { useToastStore } from '../../../stores/toast'

const route = useRoute()
const router = useRouter()
const { products, categories } = useProducts()
const { addToCart } = useCart()
const { isProductFavorite, toggleFavoriteProduct } = useProfile()
const { t } = useI18n()
const toastStore = useToastStore()

const sortRef = ref(null)
const isSortOpen = ref(false)

const selectedCategory = ref('All')
const selectedStock = ref('All')
const sortBy = ref('featured')
const onlyFavorites = ref(false)
const searchQuery = ref('')
const gridCols = ref(3)

const getCategoryIcon = (cat) => {
  if (cat === 'Hair Care') return Sparkles
  if (cat === 'Skin & Glow') return Sun
  if (cat === 'Serums & Oils') return Droplets
  if (cat === 'Makeup & Tools') return Wand2
  return Grid2x2
}

const getCategoryCount = (cat) => {
  if (cat === 'All') return products.value.length
  return products.value.filter(p => p.category === cat).length
}

const selectSort = (val) => {
  sortBy.value = val
  isSortOpen.value = false
}

const handleClickOutside = (event) => {
  if (sortRef.value && !sortRef.value.contains(event.target)) {
    isSortOpen.value = false
  }
}

const activeFilterCount = computed(() => {
  let count = 0
  if (selectedCategory.value !== 'All') count++
  if (selectedStock.value !== 'All') count++
  if (sortBy.value !== 'featured') count++
  if (onlyFavorites.value) count++
  if (searchQuery.value.trim() !== '') count++
  return count
})

const getNumericPrice = (product) => {
  if (typeof product.rawPrice === 'number') return product.rawPrice
  return parseFloat(String(product.price || 0).replace(/[^0-9.]/g, '')) || 0
}

const filteredProducts = computed(() => {
  let list = [...products.value]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(
      p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
    )
  }

  if (selectedCategory.value !== 'All') {
    list = list.filter(p => p.category === selectedCategory.value)
  }

  if (selectedStock.value !== 'All') {
    list = list.filter(p => (p.status || 'In Stock') === selectedStock.value)
  }

  if (onlyFavorites.value) {
    list = list.filter(p => isProductFavorite(p.id))
  }

  if (sortBy.value === 'low') {
    list.sort((a, b) => getNumericPrice(a) - getNumericPrice(b))
  } else if (sortBy.value === 'high') {
    list.sort((a, b) => getNumericPrice(b) - getNumericPrice(a))
  }

  return list
})

const resetAllFilters = () => {
  selectedCategory.value = 'All'
  selectedStock.value = 'All'
  sortBy.value = 'featured'
  onlyFavorites.value = false
  searchQuery.value = ''
}

const handleBuy = (product, qty = 1) => {
  if (product.stock <= 0) {
    toastStore.showToast(`${product.name} is currently out of stock.`, 'warning')
    return
  }
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

const openProductDetail = (product) => {
  router.push({ name: 'product-detail', params: { id: product.id } })
}

onMounted(() => {
  window.scrollTo(0, 0)
  if (route.query.q) {
    searchQuery.value = String(route.query.q)
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.product-page-container {
  background-color: color-mix(in srgb, var(--storefront-bg, #f4f6f9) 76%, transparent);
  min-height: 100vh;
  padding-top: 0;
  padding-bottom: 48px;
}

.product-hero-band {
  padding: 68px 0 16px;
  min-height: clamp(148px, 24vw, 260px);
  background-color: var(--storefront-surface, #ffffff);
  border-color: var(--border-clr, #e2e8f0) !important;
}

.product-hero-row {
  gap: clamp(10px, 2.5vw, 24px);
}

.product-hero-copy {
  flex: 1 1 0;
  min-inline-size: 0;
}

.product-hero-accent {
  color: var(--primary-color, #EA7A38);
  line-height: 1;
}

.product-hero-accent svg {
  inline-size: clamp(22px, 3.2vw, 34px);
  block-size: auto;
  display: block;
}

.product-hero-heading {
  color: var(--primary-color, #EA7A38);
  font-size: clamp(0.95rem, 2.7vw, 2.2rem);
  letter-spacing: -0.025em;
  line-height: 1.25;
  overflow-wrap: break-word;
}

.product-hero-breadcrumb {
  font-size: clamp(0.72rem, 1.15vw, 0.875rem);
}

.breadcrumb-home-link {
  color: var(--secondary-color, #64748b);
  transition: color 0.16s ease;
}

.breadcrumb-home-link:hover {
  color: var(--primary-color, #EA7A38);
}

.product-hero-gallery {
  display: grid;
  grid-template-columns: 136fr 176fr 152fr;
  gap: clamp(5px, 1.25vw, 16px);
  inline-size: clamp(156px, 47%, 496px);
  flex-shrink: 0;
}

.hero-gallery-card {
  inline-size: 100%;
  min-inline-size: 0;
  border-radius: clamp(8px, 1.4vw, 16px);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  background-color: var(--surface-ground, #f1f5f9);
  transition: border-color 0.18s ease, transform 0.18s ease;
}

.hero-gallery-card:hover {
  border-color: var(--primary-color, #EA7A38);
  transform: translateY(-2px);
}

.hero-card-portrait {
  aspect-ratio: 136 / 168;
}

.hero-card-main {
  aspect-ratio: 176 / 168;
}

.hero-card-side {
  aspect-ratio: 152 / 168;
}

.page-title {
  color: var(--text-heading-color, #0f172a);
}

.badge-count {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 9999px;
  background: var(--primary-color-soft);
  border: 1px solid var(--primary-color-border);
  color: var(--primary-color, #EA7A38);
}

/* Left Sidebar Filter Card (Reference Style) */
.sidebar-filter-card {
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  box-shadow: none !important;
  position: sticky;
  top: 76px;
}

.sidebar-filter-icon {
  width: 32px;
  height: 32px;
  background-color: var(--primary-color, #EA7A38);
  color: #ffffff;
}

.dot-ind {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.search-pill-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.sidebar-search-input {
  height: 38px;
  width: 100%;
  padding: 0.35rem 0.85rem 0.35rem 2.2rem;
  background-color: var(--surface-ground, #f1f5f9);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  border-radius: 10px;
  color: var(--text-heading-color, #0f172a);
  font-size: 0.84rem;
}

.sidebar-search-input:focus {
  outline: none;
  border-color: var(--primary-color, #EA7A38);
  background-color: var(--storefront-surface, #ffffff);
}

.sidebar-cat-btn {
  width: 100%;
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  color: var(--text-base, #334155);
  transition: all 0.16s ease;
  cursor: pointer;
}

.sidebar-cat-btn:hover {
  border-color: var(--border-hover-color);
  color: var(--text-heading-color, #0f172a);
}

.sidebar-cat-btn.active {
  background-color: var(--primary-color-soft);
  border-color: var(--primary-color, #EA7A38);
  color: var(--primary-color, #EA7A38);
}

.cat-count-badge {
  font-size: 0.72rem;
  font-weight: 700;
  opacity: 0.75;
}

.mini-filter-chip {
  background-color: var(--surface-ground, #f1f5f9);
  border: 1px solid var(--border-clr, #e2e8f0);
  color: var(--text-base, #334155);
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
}

.mini-filter-chip.active {
  background-color: var(--primary-color, #EA7A38);
  border-color: var(--primary-color, #EA7A38);
  color: #ffffff;
}

.btn-reset-sidebar {
  background-color: rgba(239, 68, 68, 0.08);
  border: var(--border-width, 1.5px) solid rgba(239, 68, 68, 0.28);
  color: var(--danger-color, #ef4444);
  cursor: pointer;
}

.btn-reset-sidebar:hover {
  background-color: var(--danger-color, #ef4444);
  color: #ffffff;
}

.grid-switcher {
  background-color: var(--storefront-surface, #ffffff);
  border-color: var(--border-clr, #e2e8f0) !important;
}

.btn-view-toggle {
  background: transparent;
  border: none;
  color: var(--secondary-color, #64748b);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-view-toggle.active {
  background-color: var(--primary-color-soft);
  color: var(--primary-color, #EA7A38);
}

.empty-state {
  background-color: var(--storefront-surface, #ffffff);
  border-color: var(--border-clr) !important;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0) !important;
  box-shadow: none !important;
  min-width: 190px;
  z-index: 1050;
}

.dropdown-menu-end {
  left: auto;
  right: 0;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  color: var(--text-heading-color, #0f172a);
  font-size: 0.84rem;
  font-weight: 500;
  padding: 0.45rem 0.75rem;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background-color: var(--surface-ground, #f1f5f9);
}

.dropdown-item.active {
  background-color: var(--primary-color, #EA7A38);
  color: #ffffff;
}
</style>
