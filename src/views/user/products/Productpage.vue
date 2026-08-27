<template>
  <div class="product-page-container">
    
    <!-- Top Filter & Navigation Toolbar (Awwwards iconic bar) -->
    <section class="filter-toolbar-section py-3 border-bottom sticky-filter-bar">
      <div class="app-container">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
          
          <!-- Left: Filter Pills -->
          <div class="d-flex flex-wrap align-items-center gap-2 filter-pills-row" ref="filterBarRef">
            
            <!-- Category Filter Dropdown -->
            <div class="dropdown position-relative">
              <button 
                class="awwwards-pill" 
                type="button" 
                :class="{ 'active': selectedCategory !== 'All' }"
                @click.stop="toggleDropdown('category')"
              >
                <span>Category</span>
                <span class="small opacity-75" v-if="selectedCategory !== 'All'">: {{ selectedCategory }}</span>
                <span class="pill-arrow">⌄</span>
              </button>
              <ul class="dropdown-menu shadow-md border rounded-3 p-2" :class="{ 'show': openDropdown === 'category' }">
                <li><button class="dropdown-item rounded-2" :class="{ 'active': selectedCategory === 'All' }" @click="selectCategory('All')">All Categories</button></li>
                <li><button class="dropdown-item rounded-2" :class="{ 'active': selectedCategory === 'Shampoos' }" @click="selectCategory('Shampoos')">Shampoos</button></li>
                <li><button class="dropdown-item rounded-2" :class="{ 'active': selectedCategory === 'Treatments' }" @click="selectCategory('Treatments')">Treatments</button></li>
                <li><button class="dropdown-item rounded-2" :class="{ 'active': selectedCategory === 'Styling' }" @click="selectCategory('Styling')">Styling & Oils</button></li>
              </ul>
            </div>

            <!-- Awards / Badges Filter -->
            <div class="dropdown position-relative">
              <button 
                class="awwwards-pill" 
                type="button" 
                :class="{ 'active': selectedAward !== 'All' }"
                @click.stop="toggleDropdown('awards')"
              >
                <span>Awards</span>
                <span class="small opacity-75" v-if="selectedAward !== 'All'">: {{ selectedAward }}</span>
                <span class="pill-arrow">⌄</span>
              </button>
              <ul class="dropdown-menu shadow-md border rounded-3 p-2" :class="{ 'show': openDropdown === 'awards' }">
                <li><button class="dropdown-item rounded-2" :class="{ 'active': selectedAward === 'All' }" @click="selectAward('All')">All Honors</button></li>
                <li><button class="dropdown-item rounded-2" :class="{ 'active': selectedAward === 'SOTD' }" @click="selectAward('SOTD')">Site of the Day (SOTD)</button></li>
                <li><button class="dropdown-item rounded-2" :class="{ 'active': selectedAward === 'DEV' }" @click="selectAward('DEV')">Developer Award</button></li>
              </ul>
            </div>

            <!-- Hair Type / Tag Filter -->
            <div class="dropdown position-relative">
              <button 
                class="awwwards-pill" 
                type="button" 
                :class="{ 'active': selectedTag !== 'All' }"
                @click.stop="toggleDropdown('tag')"
              >
                <span>Tag</span>
                <span class="small opacity-75" v-if="selectedTag !== 'All'">: {{ selectedTag }}</span>
                <span class="pill-arrow">⌄</span>
              </button>
              <ul class="dropdown-menu shadow-md border rounded-3 p-2" :class="{ 'show': openDropdown === 'tag' }">
                <li><button class="dropdown-item rounded-2" :class="{ 'active': selectedTag === 'All' }" @click="selectTag('All')">All Tags</button></li>
                <li><button class="dropdown-item rounded-2" :class="{ 'active': selectedTag === 'Organic' }" @click="selectTag('Organic')">100% Organic</button></li>
                <li><button class="dropdown-item rounded-2" :class="{ 'active': selectedTag === 'Vegan' }" @click="selectTag('Vegan')">Cruelty-Free</button></li>
                <li><button class="dropdown-item rounded-2" :class="{ 'active': selectedTag === 'Salon Grade' }" @click="selectTag('Salon Grade')">Salon Grade</button></li>
              </ul>
            </div>

            <!-- Price Sort Dropdown -->
            <div class="dropdown position-relative">
              <button 
                class="awwwards-pill" 
                type="button" 
                :class="{ 'active': sortBy !== 'featured' }"
                @click.stop="toggleDropdown('price')"
              >
                <span>Price</span>
                <span class="small opacity-75" v-if="sortBy !== 'featured'">: {{ sortBy === 'low' ? 'Low to High' : 'High to Low' }}</span>
                <span class="pill-arrow">⌄</span>
              </button>
              <ul class="dropdown-menu shadow-md border rounded-3 p-2" :class="{ 'show': openDropdown === 'price' }">
                <li><button class="dropdown-item rounded-2" :class="{ 'active': sortBy === 'featured' }" @click="selectSort('featured')">Featured</button></li>
                <li><button class="dropdown-item rounded-2" :class="{ 'active': sortBy === 'low' }" @click="selectSort('low')">Price: Low to High</button></li>
                <li><button class="dropdown-item rounded-2" :class="{ 'active': sortBy === 'high' }" @click="selectSort('high')">Price: High to Low</button></li>
              </ul>
            </div>

            <!-- Color Swatch Pill -->
            <button class="awwwards-pill" @click="toggleColorFilter" :class="{ 'active': isColorActive }">
              <span>Color</span>
              <span class="color-spectrum-icon d-inline-flex gap-1 ms-1">
                <span style="background: #3b82f6; width: 4px; height: 12px; border-radius: 1px;"></span>
                <span style="background: #10b981; width: 4px; height: 12px; border-radius: 1px;"></span>
                <span style="background: #ec4899; width: 4px; height: 12px; border-radius: 1px;"></span>
              </span>
            </button>

          </div>

          <!-- Right: Active Filters Count & Reset -->
          <div class="d-flex align-items-center gap-2">
            <!-- Count Bubble -->
            <span class="active-filter-badge" :class="{ 'has-filters': activeFilterCount > 0 }">
              {{ activeFilterCount }}
            </span>

            <!-- Reset Button -->
            <button 
              class="btn-reset-filters d-inline-flex align-items-center gap-1"
              @click="resetAllFilters"
              :disabled="activeFilterCount === 0"
            >
              <span>Reset filters</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>

    <!-- Main Content Area -->
    <main class="collection-main py-4">
      <div class="app-container">
        
        <!-- Header Info Row with Count & Grid Switcher -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-2">
          
          <!-- Title & Count Badge -->
          <div class="d-flex align-items-center gap-2">
            <h1 class="page-title fs-5 fw-bold m-0 text-dark">
              Winning products. Salon Care Inspiration
            </h1>
            <span class="badge-count">{{ filteredProducts.length }}</span>
          </div>

          <!-- Description & Grid Controls -->
          <div class="d-flex align-items-center gap-3">
            <p class="small text-muted m-0 d-none d-lg-block">
              Best selection of <strong>Winning salon formulas</strong> for your hair & skin... <a href="#" class="text-dark fw-semibold text-decoration-none">Read more</a>
            </p>

            <!-- Layout Grid View Switcher -->
            <div class="grid-switcher d-flex align-items-center gap-1 bg-surface p-1 rounded-2 border">
              <button 
                class="btn-view-toggle p-1 rounded"
                :class="{ 'active': gridCols === 4 }"
                @click="gridCols = 4"
                title="4 Column Grid"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                </svg>
              </button>
              <button 
                class="btn-view-toggle p-1 rounded"
                :class="{ 'active': gridCols === 2 }"
                @click="gridCols = 2"
                title="2 Column Grid"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="8" height="18" rx="1"></rect>
                  <rect x="13" y="3" width="8" height="18" rx="1"></rect>
                </svg>
              </button>
            </div>

          </div>

        </div>

        <!-- Products Bento / Awwwards Grid -->
        <div 
          class="row g-4"
          :class="gridCols === 4 ? 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4' : 'row-cols-1 row-cols-md-2'"
        >
          <div class="col" v-for="product in filteredProducts" :key="product.id">
            <ProductCard 
              :product="product" 
              @buy="handleBuy" 
              @favorite="handleFavorite" 
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="empty-state text-center py-5 my-5">
          <div class="empty-icon mb-3">🔍</div>
          <h4 class="fw-bold text-dark mb-2">No matching products found</h4>
          <p class="text-muted small mb-4">Try clearing filters or search query to explore the full collection.</p>
          <button class="btn btn-awwwards-primary" @click="resetAllFilters">
            Clear all filters
          </button>
        </div>

      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../../../components/ProductCard.vue'
import { useProducts } from '../../../composables/useProducts'

const route = useRoute()
const { products } = useProducts()

const filterBarRef = ref(null)
const openDropdown = ref(null)

const selectedCategory = ref('All')
const selectedAward = ref('All')
const selectedTag = ref('All')
const sortBy = ref('featured')
const isColorActive = ref(false)
const searchQuery = ref('')
const gridCols = ref(4)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectCategory = (val) => {
  selectedCategory.value = val
  openDropdown.value = null
}

const selectAward = (val) => {
  selectedAward.value = val
  openDropdown.value = null
}

const selectTag = (val) => {
  selectedTag.value = val
  openDropdown.value = null
}

const selectSort = (val) => {
  sortBy.value = val
  openDropdown.value = null
}

const handleClickOutside = (event) => {
  if (filterBarRef.value && !filterBarRef.value.contains(event.target)) {
    openDropdown.value = null
  }
}

const activeFilterCount = computed(() => {
  let count = 0
  if (selectedCategory.value !== 'All') count++
  if (selectedAward.value !== 'All') count++
  if (selectedTag.value !== 'All') count++
  if (sortBy.value !== 'featured') count++
  if (isColorActive.value) count++
  if (searchQuery.value.trim() !== '') count++
  return count
})

const filteredProducts = computed(() => {
  let list = [...products.value]

  // Search query filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }

  // Category filter
  if (selectedCategory.value !== 'All') {
    list = list.filter(p => p.category === selectedCategory.value)
  }

  // Sorting
  if (sortBy.value === 'low') {
    list.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')))
  } else if (sortBy.value === 'high') {
    list.sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')))
  }

  return list
})

const toggleColorFilter = () => {
  openDropdown.value = null
  isColorActive.value = !isColorActive.value
}

const resetAllFilters = () => {
  selectedCategory.value = 'All'
  selectedAward.value = 'All'
  selectedTag.value = 'All'
  sortBy.value = 'featured'
  isColorActive.value = false
  searchQuery.value = ''
  openDropdown.value = null
}

const handleBuy = (product) => {
  console.log('Added to bag:', product.name)
}

const handleFavorite = (product) => {
  console.log('Toggled favorite:', product.name)
}

onMounted(() => {
  window.scrollTo(0, 0)
  if (route.query.q) {
    searchQuery.value = route.query.q
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.product-page-container {
  background-color: var(--color-bg);
  min-height: 100vh;
  padding-top: 72px;
}

/* Sticky Filter Bar */
.sticky-filter-bar {
  background-color: var(--color-surface);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 68px;
  z-index: 1020;
}

/* Filter Pills Styling (Tnak Style) */
.awwwards-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0.35rem 0.85rem;
  background-color: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 8px;
  color: var(--text-heading-color, #0f172a);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.awwwards-pill:hover {
  background-color: var(--surface-ground, #f8fafc);
  border-color: var(--border-hover-color, #94a3b8);
  color: var(--text-heading-color, #0f172a);
}

.awwwards-pill.active {
  background-color: var(--primary-color-soft, rgba(234, 122, 56, 0.12));
  border-color: var(--primary-color, #EA7A38);
  color: var(--primary-color, #EA7A38);
  font-weight: 600;
}

.dropdown-toggle::after {
  display: none !important;
}

.pill-arrow {
  font-size: 0.8rem;
  line-height: 1;
}

/* Active Filter Counter Badge */
.active-filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: var(--color-bg-alt);
  color: var(--color-text-light);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.active-filter-badge.has-filters {
  background-color: var(--color-accent);
  color: #ffffff;
  border-color: var(--color-accent);
}

/* Reset Button */
.btn-reset-filters {
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  transition: color 0.2s ease;
}

.btn-reset-filters:hover:not(:disabled) {
  color: var(--color-heading);
}

.btn-reset-filters:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* View Switcher */
.btn-view-toggle {
  background: transparent;
  border: none;
  color: var(--color-text-lighter);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-view-toggle:hover {
  color: var(--color-heading);
}

.btn-view-toggle.active {
  background-color: var(--color-surface);
  color: var(--color-heading);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* Dropdown styling */
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  background-color: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, rgba(0, 0, 0, 0.08));
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  min-width: 180px;
  z-index: 1050;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  color: var(--color-heading);
  font-size: 0.86rem;
  font-weight: 500;
  padding: 0.45rem 0.75rem;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background-color: var(--color-surface-hover, #f1f5f9);
  color: var(--color-heading);
}

.dropdown-item.active {
  background-color: var(--color-heading, #0f172a);
  color: #ffffff;
}
</style>
