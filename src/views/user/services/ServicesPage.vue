<template>
  <div class="services-page-container">
    <div class="services-content-section pt-3 pb-5">
      <div class="app-container">
        <!-- 1. SECTION: POPULAR TREATMENTS -->
        <div class="template-section mb-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="section-title fw-bold m-0">{{ t('services.popularTitle') }}</h2>

            <div class="d-flex align-items-center gap-2">
              <button
                type="button"
                class="btn-nav-arrow rounded-circle border d-flex align-items-center justify-content-center"
                @click="scrollRecentlyUsed(-1)"
                aria-label="Scroll left"
              >
                <ChevronLeft :size="16" />
              </button>
              <button
                type="button"
                class="btn-nav-arrow rounded-circle border d-flex align-items-center justify-content-center"
                @click="scrollRecentlyUsed(1)"
                aria-label="Scroll right"
              >
                <ChevronRight :size="16" />
              </button>
            </div>
          </div>

          <div class="row g-3 g-xl-4 flex-nowrap overflow-auto pb-2" ref="recentRowRef">
            <div
              v-for="service in popularServices"
              :key="'recent-' + service.id"
              class="col-10 col-sm-6 col-lg-3 flex-shrink-0"
            >
              <ServiceCard
                :service="service"
                :isSelected="selectedService?.id === service.id"
                @select="handleSelectService"
                @preview="openPreviewModal"
              />
            </div>
          </div>
        </div>

        <!-- 2. SECTION: ALL SALON SERVICES -->
        <div class="template-section">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
            <h1 class="section-title fw-bold m-0">{{ t('services.allTitle') }}</h1>

            <div class="d-flex align-items-center gap-3">
              <div class="search-input-pill position-relative">
                <Search :size="14" class="search-icon text-muted" />
                <input
                  type="search"
                  v-model="searchQuery"
                  :placeholder="t('services.searchPlaceholder')"
                  :aria-label="t('services.searchPlaceholder')"
                  class="form-control form-control-sm rounded-pill ps-4 pe-3 border"
                />
              </div>

              <button type="button" class="btn btn-link text-decoration-none p-0 small fw-semibold text-muted" @click="resetFilters">
                {{ t('services.viewAll') }}
              </button>
            </div>
          </div>

          <!-- Category Filter Pills -->
          <div class="d-flex flex-wrap gap-2 mb-4">
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              class="btn-cat-filter"
              :class="{ active: selectedCategory === cat }"
              @click="selectedCategory = cat"
            >
              {{ cat }}
            </button>
          </div>

          <!-- All Services 4-Column Grid -->
          <div class="row g-3 g-xl-4">
            <div
              v-for="service in filteredServices"
              :key="'service-' + service.id"
              class="col-12 col-sm-6 col-lg-3"
            >
              <ServiceCard
                :service="service"
                :isSelected="selectedService?.id === service.id"
                @select="handleSelectService"
                @preview="openPreviewModal"
              />
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredServices.length === 0" class="p-5 text-center rounded-4 border my-4 empty-services-box">
            <div class="fs-1 mb-2">🔍</div>
            <h6 class="fw-bold mb-1 section-title">{{ t('services.emptyTitle') }}</h6>
            <p class="text-muted small mb-3">{{ t('services.emptyDesc') }}</p>
            <button type="button" class="btn-tnak-outline px-4 py-2" @click="resetFilters">
              {{ t('services.viewAll') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Service Detail Modal -->
    <BaseModal v-model="isPreviewOpen" :title="previewService?.title || 'Service Details'" size="md">
      <div v-if="previewService" class="d-flex flex-column gap-3">
        <div class="service-preview-media rounded-4 overflow-hidden border">
          <img :src="previewService.image" :alt="previewService.title" class="w-100 h-100 object-fit-cover d-block" />
        </div>

        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="badge bg-light text-muted border rounded-pill px-3 py-1">
            {{ previewService.icon }} {{ previewService.category }}
          </span>
          <div class="d-flex align-items-center gap-2">
            <span class="fw-bolder fs-4 text-primary">${{ previewService.price }}</span>
            <span class="text-muted small">· {{ previewService.duration }}</span>
          </div>
        </div>

        <p class="text-muted small mb-0" style="line-height: 1.65;">
          {{ previewService.description }}
        </p>

        <div v-if="previewService.highlights?.length" class="p-3 rounded-3" style="background: var(--surface-ground);">
          <div class="fw-semibold small mb-2">Included in this treatment:</div>
          <ul class="list-unstyled d-flex flex-column gap-1 mb-0 small text-muted">
            <li v-for="hl in previewService.highlights" :key="hl" class="d-flex align-items-center gap-2">
              <CheckCircle2 :size="14" class="text-success flex-shrink-0" />
              <span>{{ hl }}</span>
            </li>
          </ul>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="outline-secondary" @click="isPreviewOpen = false">Close</BaseButton>
        <BaseButton variant="primary" @click="bookFromPreview">
          <CalendarPlus :size="16" />
          <span>Book This Treatment</span>
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, Search, CheckCircle2, CalendarPlus } from '@lucide/vue'
import { useServices } from '../../../composables/useServices'
import { useI18n } from '../../../composables/useI18n'
import ServiceCard from '../../../components/ServiceCard.vue'

const router = useRouter()
const { allServices, categories } = useServices()
const { t } = useI18n()

const selectedCategory = ref('All')
const searchQuery = ref('')
const selectedService = ref(null)
const recentRowRef = ref(null)

const isPreviewOpen = ref(false)
const previewService = ref(null)

const popularServices = computed(() => {
  return allServices.value.filter(s => s.status !== 'Inactive').slice(0, 4)
})

const filteredServices = computed(() => {
  let list = allServices.value.filter(s => s.status !== 'Inactive')

  if (selectedCategory.value && selectedCategory.value !== 'All') {
    list = list.filter(s => s.category.toLowerCase() === selectedCategory.value.toLowerCase())
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      s =>
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

const openPreviewModal = (service) => {
  previewService.value = service
  isPreviewOpen.value = true
}

const bookFromPreview = () => {
  if (!previewService.value) return
  isPreviewOpen.value = false
  router.push({ path: '/booking', query: { service: previewService.value.id } })
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
  background-color: color-mix(in srgb, var(--storefront-bg, #FAF8F5) 76%, transparent);
  min-height: 100vh;
  padding-top: 72px;
}

.section-title {
  font-size: 1.2rem;
  letter-spacing: -0.02em;
  color: var(--text-heading-color, #0f172a);
}

.btn-nav-arrow {
  width: 32px;
  height: 32px;
  background-color: var(--storefront-surface, #ffffff);
  border-color: var(--border-clr, #e2e8f0) !important;
  color: var(--secondary-color, #64748b);
  cursor: pointer;
}

.search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input-pill input {
  font-size: 0.82rem;
  width: 220px;
  background-color: var(--storefront-surface, #ffffff);
  border-color: var(--border-clr, #e2e8f0);
  color: var(--text-heading-color, #0f172a);
}

.btn-cat-filter {
  background-color: var(--storefront-surface, #ffffff);
  border: 1px solid var(--border-clr, #e2e8f0);
  border-radius: 9999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-base, #475569);
  transition: all 0.18s ease;
  cursor: pointer;
}

.btn-cat-filter:hover {
  border-color: var(--primary-color, #EA7A38);
}

.btn-cat-filter.active {
  background-color: var(--primary-color, #EA7A38);
  color: #ffffff;
  border-color: var(--primary-color, #EA7A38);
}

.empty-services-box {
  background-color: var(--storefront-surface, #ffffff);
  border-color: var(--border-clr) !important;
}

.service-preview-media {
  inline-size: 100%;
  aspect-ratio: 16 / 10;
  background-color: var(--surface-ground, #f1f5f9);
}
</style>
