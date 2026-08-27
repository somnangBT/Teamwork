<template>
  <div class="services-page-container">
    
    <!-- Main Services & Templates Content -->
    <div class="services-content-section pt-2 pb-5">
      <div class="app-container">
        
        <!-- 1. SECTION: RECENTLY USED -->
        <div class="template-section mb-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="section-title fw-bold text-dark m-0">Recently Used</h5>
            
            <!-- Prev / Next Navigation Arrows -->
            <div class="d-flex align-items-center gap-2">
              <button 
                class="btn-nav-arrow rounded-circle border d-flex align-items-center justify-content-center"
                @click="scrollRecentlyUsed(-1)"
                title="Previous"
              >
                ‹
              </button>
              <button 
                class="btn-nav-arrow rounded-circle border d-flex align-items-center justify-content-center"
                @click="scrollRecentlyUsed(1)"
                title="Next"
              >
                ›
              </button>
            </div>
          </div>

          <!-- Recently Used 4-Column Row -->
          <div class="row g-3 g-xl-4 recent-row-scroll" ref="recentRowRef">
            <div 
              v-for="service in popularServices" 
              :key="'recent-' + service.id" 
              class="col-12 col-sm-6 col-lg-3"
            >
              <ServiceCard 
                :service="service" 
                :isSelected="selectedService?.id === service.id"
                @select="handleSelectService"
              />
            </div>
          </div>
        </div>

        <!-- 2. SECTION: ALL TEMPLATES -->
        <div class="template-section">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
            <h5 class="section-title fw-bold text-dark m-0">All Templates</h5>
            
            <!-- Search & Action Bar -->
            <div class="d-flex align-items-center gap-3">
              <div class="search-input-pill position-relative">
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Search templates..." 
                  class="form-control form-control-sm rounded-pill ps-4 pe-3 border"
                />
                <span class="search-icon position-absolute start-0 top-50 translate-middle-y ms-2 small text-muted">🔍</span>
              </div>

              <!-- View All Link -->
              <button class="btn btn-link text-decoration-none p-0 small fw-semibold text-muted" @click="resetFilters">
                View All
              </button>
            </div>
          </div>

          <!-- Category Filter Tags Row -->
          <div class="d-flex flex-wrap gap-2 mb-4">
            <button 
              v-for="cat in categories" 
              :key="cat"
              class="btn-cat-filter"
              :class="{ 'active': selectedCategory === cat }"
              @click="selectedCategory = cat"
            >
              {{ cat }}
            </button>
          </div>

          <!-- All Templates 4-Column Full-Width Grid -->
          <div class="row g-3 g-xl-4">
            <div 
              v-for="service in filteredServices" 
              :key="'template-' + service.id" 
              class="col-12 col-sm-6 col-lg-3"
            >
              <ServiceCard 
                :service="service" 
                :isSelected="selectedService?.id === service.id"
                @select="handleSelectService"
              />
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredServices.length === 0" class="p-5 text-center bg-white rounded-4 border my-4">
            <div class="fs-1 mb-2">🔍</div>
            <h6 class="fw-bold text-dark mb-1">No services found</h6>
            <p class="text-muted small mb-3">Try adjusting your search query or choosing another category.</p>
            <button class="btn btn-outline-dark btn-sm rounded-pill px-4 py-2" @click="resetFilters">
              Show All Services
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useServices } from '../../../composables/useServices'
import ServiceCard from '../../../components/ServiceCard.vue'

const router = useRouter()
const { allServices, categories } = useServices()

const selectedCategory = ref('All')
const searchQuery = ref('')
const selectedService = ref(null)
const recentRowRef = ref(null)

const popularServices = computed(() => {
  return allServices.value.slice(0, 4)
})

const filteredServices = computed(() => {
  let list = allServices.value

  if (selectedCategory.value && selectedCategory.value !== 'All') {
    list = list.filter(s => s.category.toLowerCase() === selectedCategory.value.toLowerCase())
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    )
  }

  return list
})

const handleSelectService = (service) => {
  router.push({ path: '/booking', query: { service: service.id } })
}

const resetFilters = () => {
  selectedCategory.value = 'All'
  searchQuery.value = ''
}

const scrollRecentlyUsed = (direction) => {
  if (recentRowRef.value) {
    recentRowRef.value.scrollBy({ left: direction * 300, behavior: 'smooth' })
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.services-page-container {
  background-color: #FAF8F5;
  min-height: 100vh;
  padding-top: 72px;
}

.section-title {
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  color: #0f172a;
}

.recent-row-scroll {
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  padding-bottom: 8px;
}

.btn-nav-arrow {
  width: 32px;
  height: 32px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 1.15rem;
  line-height: 1;
  transition: all 0.15s ease;
  cursor: pointer;
}

.btn-nav-arrow:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.search-input-pill input {
  font-size: 0.82rem;
  width: 190px;
  background-color: #ffffff;
  border-color: #e2e8f0;
}

.search-input-pill input:focus {
  border-color: #EA7A38;
  box-shadow: 0 0 0 3px rgba(234, 122, 56, 0.15);
}

.btn-cat-filter {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  padding: 0.3rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #475569;
  transition: all 0.18s ease;
  cursor: pointer;
}

.btn-cat-filter:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.btn-cat-filter.active {
  background-color: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}

</style>
