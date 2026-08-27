<template>
  <div class="admin-services-page">
    
    <!-- Top Header & Actions -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
      <div>
        <h3 class="fw-bolder text-dark mb-1" style="letter-spacing: -0.02em;">Services Catalog</h3>
        <p class="text-muted small mb-0">Configure salon treatments, pricing packages, durations, and highlights.</p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button 
          type="button" 
          class="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold small bg-white"
          @click="resetCatalog"
          title="Reset to default services"
        >
          <span>↺ Reset</span>
        </button>

        <button 
          type="button" 
          class="btn btn-orange rounded-pill px-3.5 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-xs"
          @click="openCreateModal"
        >
          <span>+</span>
          <span>Add New Service</span>
        </button>
      </div>
    </div>

    <!-- Filters and Search Bar -->
    <div class="card p-3 rounded-4 border bg-white shadow-xs mb-4">
      <div class="row g-2.5 align-items-center">
        <!-- Search Input -->
        <div class="col-12 col-md-5">
          <BaseInput 
            v-model="searchQuery" 
            placeholder="Search service title, description, or category..." 
            prefixIcon="🔍"
            :clearable="true"
          />
        </div>

        <!-- Category Filter -->
        <div class="col-12 col-md-4">
          <BaseSelect 
            v-model="selectedCategory" 
            :options="categoryOptions"
            placeholder="All Categories"
          />
        </div>

        <!-- Count -->
        <div class="col-12 col-md-3 text-md-end">
          <span class="text-muted small fw-semibold">
            {{ filteredServices.length }} Treatments Active
          </span>
        </div>
      </div>
    </div>

    <!-- Services BaseTable -->
    <BaseTable 
      :columns="tableColumns" 
      :rows="filteredServices"
      :paginated="true"
      :perPage="6"
      :showIndex="true"
    >
      <!-- Service Info Column -->
      <template #service="{ row }">
        <div class="d-flex align-items-center gap-3">
          <img 
            :src="row.image" 
            :alt="row.title" 
            class="rounded-3 object-fit-cover border flex-shrink-0"
            style="width: 52px; height: 52px;"
          />
          <div class="overflow-hidden">
            <div class="d-flex align-items-center gap-1.5 flex-wrap">
              <span class="fs-6">{{ row.icon || '✂️' }}</span>
              <strong class="text-dark small text-truncate">{{ row.title }}</strong>
              <span v-if="row.badge" class="badge bg-orange-soft text-orange fw-bold" style="font-size: 0.65rem;">
                {{ row.badge }}
              </span>
            </div>
            <p class="text-muted mb-0 text-truncate small" style="font-size: 0.75rem; max-width: 320px;">
              {{ row.description }}
            </p>
          </div>
        </div>
      </template>

      <!-- Category Column -->
      <template #category="{ row }">
        <span class="badge bg-light text-dark border rounded-pill px-2.5 py-1 small fw-semibold">
          {{ row.category }}
        </span>
      </template>

      <!-- Price & Duration Column -->
      <template #price="{ row }">
        <div>
          <strong class="text-dark fs-6 d-block">${{ Number(row.price).toFixed(2) }}</strong>
          <span class="text-muted small" style="font-size: 0.74rem;">⏱️ {{ row.duration }}</span>
        </div>
      </template>

      <!-- Status Column -->
      <template #status="{ row }">
        <button 
          type="button" 
          class="btn btn-sm rounded-pill px-2.5 py-0.5 fw-semibold border-0"
          :class="row.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-muted'"
          @click="toggleStatus(row)"
          style="font-size: 0.72rem;"
          title="Click to toggle status"
        >
          ● {{ row.status || 'Active' }}
        </button>
      </template>

      <!-- Actions Column -->
      <template #actions="{ row }">
        <div class="d-flex align-items-center justify-content-end gap-1.5">
          <button 
            type="button" 
            class="btn btn-sm btn-light border rounded-pill px-2.5 py-1 text-muted"
            @click="openEditModal(row)"
            title="Edit Service"
          >
            ✏️ Edit
          </button>
          <button 
            type="button" 
            class="btn btn-sm btn-light border rounded-pill px-2 py-1 text-danger"
            @click="confirmDelete(row)"
            title="Delete Service"
          >
            🗑️
          </button>
        </div>
      </template>
    </BaseTable>

    <!-- Create / Edit Service BaseModal -->
    <BaseModal 
      v-model="isModalOpen" 
      :title="isEditing ? `Edit Service: ${form.title}` : 'Add New Salon Treatment'"
      size="lg"
    >
      <form @submit.prevent="saveServiceForm" class="row g-3">
        <div class="col-12 col-md-8">
          <BaseInput 
            v-model="form.title" 
            label="Service Title" 
            placeholder="e.g. Ultrasonic Dental Scaling & Polish"
            :required="true"
          />
        </div>

        <div class="col-12 col-md-4">
          <BaseSelect 
            v-model="form.category" 
            label="Category" 
            :options="rawCategories"
            :required="true"
          />
        </div>

        <div class="col-12 col-md-4">
          <BaseInput 
            v-model="form.price" 
            type="number"
            label="Price ($)" 
            placeholder="55"
            :required="true"
          />
        </div>

        <div class="col-12 col-md-4">
          <BaseInput 
            v-model="form.duration" 
            label="Duration" 
            placeholder="e.g. 45 mins"
            :required="true"
          />
        </div>

        <div class="col-12 col-md-4">
          <BaseInput 
            v-model="form.badge" 
            label="Badge / Tag (Optional)" 
            placeholder="e.g. POPULAR, VIP, NEW"
          />
        </div>

        <div class="col-12 col-md-4">
          <BaseInput 
            v-model="form.icon" 
            label="Emoji Icon" 
            placeholder="✂️, 🛁, 🐾, 👑"
          />
        </div>

        <div class="col-12 col-md-8">
          <BaseInput 
            v-model="form.image" 
            label="Image URL" 
            placeholder="https://images.unsplash.com/..."
            :required="true"
          />
        </div>

        <div class="col-12">
          <BaseInput 
            v-model="form.description" 
            type="textarea"
            label="Treatment Description" 
            placeholder="Full explanation of steps and pet benefits..."
            :rows="2"
            :required="true"
          />
        </div>

        <div class="col-12">
          <BaseInput 
            v-model="form.highlightsStr" 
            label="Key Highlights (Comma-separated)" 
            placeholder="e.g. Herbal Bath, Paw Balm, Organic Shampoo"
            hint="Separate each highlight with a comma"
          />
        </div>
      </form>

      <template #footer>
        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" @click="isModalOpen = false">
          Cancel
        </button>
        <button type="button" class="btn btn-orange rounded-pill px-4 fw-semibold" @click="saveServiceForm">
          {{ isEditing ? 'Save Changes' : 'Create Treatment' }}
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import BaseTable from '../../components/base/BaseTable.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseModal from '../../components/base/BaseModal.vue'
import { useServices } from '../../composables/useServices'

const { allServices, categories, addService, updateService, deleteService, resetServices } = useServices()

const searchQuery = ref('')
const selectedCategory = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)

const form = reactive({
  id: null,
  title: '',
  category: 'Full Grooming',
  price: 50,
  duration: '45 mins',
  badge: '',
  icon: '✂️',
  image: '',
  description: '',
  highlightsStr: '',
  status: 'Active'
})

const tableColumns = [
  { key: 'service', label: 'Service Details', width: '40%' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Pricing & Time', sortable: true },
  { key: 'status', label: 'Status' }
]

const categoryOptions = computed(() => {
  return categories.map(c => ({ label: c === 'All' ? 'All Categories' : c, value: c === 'All' ? '' : c }))
})

const rawCategories = computed(() => {
  return categories.filter(c => c !== 'All').map(c => ({ label: c, value: c }))
})

const filteredServices = computed(() => {
  return allServices.value.filter(s => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const match = (s.title && s.title.toLowerCase().includes(q)) ||
                    (s.description && s.description.toLowerCase().includes(q)) ||
                    (s.category && s.category.toLowerCase().includes(q))
      if (!match) return false
    }

    if (selectedCategory.value) {
      if (s.category !== selectedCategory.value) return false
    }

    return true
  })
})

const openCreateModal = () => {
  isEditing.value = false
  form.id = null
  form.title = ''
  form.category = 'Full Grooming'
  form.price = 55
  form.duration = '45 mins'
  form.badge = ''
  form.icon = '✂️'
  form.image = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600'
  form.description = ''
  form.highlightsStr = ''
  form.status = 'Active'
  isModalOpen.value = true
}

const openEditModal = (row) => {
  isEditing.value = true
  form.id = row.id
  form.title = row.title
  form.category = row.category
  form.price = row.price
  form.duration = row.duration
  form.badge = row.badge || ''
  form.icon = row.icon || '✂️'
  form.image = row.image || ''
  form.description = row.description || ''
  form.highlightsStr = (row.highlights || []).join(', ')
  form.status = row.status || 'Active'
  isModalOpen.value = true
}

const saveServiceForm = () => {
  if (!form.title || !form.price) return

  const highlights = form.highlightsStr ? form.highlightsStr.split(',').map(h => h.trim()).filter(Boolean) : []

  if (isEditing.value) {
    updateService(form.id, {
      title: form.title,
      category: form.category,
      price: Number(form.price),
      duration: form.duration,
      badge: form.badge,
      icon: form.icon,
      image: form.image,
      description: form.description,
      highlights,
      status: form.status
    })
  } else {
    addService({
      title: form.title,
      category: form.category,
      price: Number(form.price),
      duration: form.duration,
      badge: form.badge,
      icon: form.icon,
      image: form.image,
      description: form.description,
      highlights,
      status: form.status
    })
  }

  isModalOpen.value = false
}

const toggleStatus = (row) => {
  const next = row.status === 'Active' ? 'Inactive' : 'Active'
  updateService(row.id, { status: next })
}

const confirmDelete = (row) => {
  if (confirm(`Are you sure you want to delete service "${row.title}"?`)) {
    deleteService(row.id)
  }
}

const resetCatalog = () => {
  if (confirm('Reset service catalog back to factory defaults?')) {
    resetServices()
  }
}
</script>

<style scoped>
.btn-orange {
  background-color: #EA7A38;
  color: #ffffff;
  border-color: #EA7A38;
}

.btn-orange:hover {
  background-color: #d96928;
  color: #ffffff;
}

.bg-orange-soft {
  background-color: rgba(234, 122, 56, 0.12) !important;
}

.text-orange {
  color: #EA7A38 !important;
}

[data-theme="dark"] .card {
  background-color: var(--card-bg-color, #1e293b);
  border-color: rgba(255, 255, 255, 0.08) !important;
}
</style>
