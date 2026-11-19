<template>
  <div class="admin-services-view">
    <DashboardPageTitle
      title="Services Catalog"
      subtitle="Configure women's hair, spa, facial, and nail treatments, pricing, durations, and highlights."
    >
      <BaseButton variant="outline-secondary" @click="handleReset">
        <RotateCcw :size="15" />
        <span class="d-none d-sm-inline">Reset</span>
      </BaseButton>
      <BaseButton variant="primary" @click="openCreateModal">
        <Plus :size="17" />
        <span class="d-none d-sm-inline">Add Service</span>
      </BaseButton>
    </DashboardPageTitle>

    <div class="card p-3" style="background-color: var(--surface-ground);">
      <div class="mb-3 d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-2">
        <div class="flex-grow-1 overflow-auto pb-1 pb-xl-0" style="min-width: 0;">
          <BaseFilter v-model="selectedCategory" :options="filterOptions" style="min-width: max-content;" />
        </div>
        <div style="min-width: 250px;">
          <BaseInput v-model="searchQuery" placeholder="Search services..." :prefixIcon="Search" clearable />
        </div>
      </div>

      <BaseTable
        :columns="colDefs"
        :rows="paginatedServices"
        :total-records="filteredServices.length"
        v-model:page="page"
        v-model:per-page="perPage"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
      >
        <template #title="{ data }">
          <div class="d-flex align-items-center gap-2">
            <span class="fs-5">{{ data.icon || '✂️' }}</span>
            <div>
              <div class="fw-semibold" style="color: var(--text-heading-color);">{{ data.title }}</div>
              <small class="text-muted">{{ data.category }}</small>
            </div>
          </div>
        </template>

        <template #price="{ data }">
          <span class="fw-bold text-primary">${{ Number(data.price).toFixed(2) }}</span>
        </template>

        <template #status="{ data }">
          <BaseBadge :status="data.status || 'Active'" size="sm" />
        </template>

        <template #action="{ data }">
          <BaseActionMenu :items="getActionItems(data)" />
        </template>
      </BaseTable>
    </div>

    <!-- Create / Edit Service Modal -->
    <BaseModal v-model="showModal" :title="editingId ? 'Edit Service' : 'Add New Service'" size="md">
      <form @submit.prevent="saveService">
        <div class="row g-3 mb-3">
          <div class="col-md-8">
            <BaseInput v-model="form.title" label="Service Title" required />
          </div>
          <div class="col-md-4">
            <BaseInput v-model="form.icon" label="Icon Emoji" placeholder="✂️" />
          </div>
          <div class="col-md-4">
            <BaseSelect
              v-model="form.category"
              label="Category"
              required
              :options="categories.filter(c => c !== 'All').map(c => ({ label: c, value: c }))"
            />
          </div>
          <div class="col-md-4">
            <BaseInput v-model="form.price" type="number" label="Price ($)" required />
          </div>
          <div class="col-md-4">
            <BaseInput v-model="form.duration" label="Duration" placeholder="45 mins" required />
          </div>
          <div class="col-md-6">
            <BaseInput v-model="form.badge" label="Tag Badge" placeholder="POPULAR, LUXURY" />
          </div>
          <div class="col-md-6">
            <BaseSelect
              v-model="form.status"
              label="Status"
              :options="[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' }
              ]"
            />
          </div>
          <div class="col-12">
            <BaseInput v-model="form.image" label="Cover Image URL" placeholder="https://..." />
          </div>
          <div class="col-12">
            <BaseInput v-model="form.description" type="textarea" :rows="3" label="Description" required />
          </div>
        </div>
        <div class="d-flex justify-content-end gap-2 pt-2 border-top">
          <BaseButton type="button" variant="outline-secondary" @click="showModal = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">{{ editingId ? 'Save Changes' : 'Create Service' }}</BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus, Search, RotateCcw, Edit, Power, Trash2 } from '@lucide/vue'
import { useServices } from '@/composables/useServices'
import { useToastStore } from '@/stores/toast'
import DashboardPageTitle from '@/components/common/DashboardPageTitle.vue'

const toastStore = useToastStore()
const { allServices, categories, addService, updateService, deleteService, resetServices } = useServices()

const selectedCategory = ref('All')
const searchQuery = ref('')
const page = ref(1)
const perPage = ref(10)
const sortBy = ref('id')
const sortOrder = ref('asc')

const filterOptions = computed(() =>
  categories.map(cat => ({
    label: cat,
    value: cat,
    badge: cat === 'All' ? allServices.value.length : allServices.value.filter(s => s.category === cat).length
  }))
)

const colDefs = [
  { field: 'title', header: 'Treatment', sortable: true },
  { field: 'price', header: 'Price', sortable: true },
  { field: 'duration', header: 'Duration', sortable: true },
  { field: 'badge', header: 'Badge', sortable: true },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'action', header: 'Actions', sortable: false }
]

const filteredServices = computed(() => {
  let list = [...allServices.value]
  if (selectedCategory.value !== 'All') {
    list = list.filter(s => s.category === selectedCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
  }
  return list
})

const paginatedServices = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filteredServices.value.slice(start, start + perPage.value)
})

const showModal = ref(false)
const editingId = ref(null)
const form = reactive({
  title: '',
  category: 'Hair Styling',
  price: 45,
  duration: '45 mins',
  icon: '✂️',
  badge: '',
  status: 'Active',
  image: '/images/svc_salon_blowout.jpg',
  description: ''
})

const openCreateModal = () => {
  editingId.value = null
  form.title = ''
  form.category = 'Hair Styling'
  form.price = 45
  form.duration = '45 mins'
  form.icon = '✂️'
  form.badge = ''
  form.status = 'Active'
  form.image = '/images/svc_salon_blowout.jpg'
  form.description = ''
  showModal.value = true
}

const openEditModal = (svc) => {
  editingId.value = svc.id
  form.title = svc.title
  form.category = svc.category
  form.price = svc.price
  form.duration = svc.duration
  form.icon = svc.icon || '✂️'
  form.badge = svc.badge || ''
  form.status = svc.status || 'Active'
  form.image = svc.image || ''
  form.description = svc.description || ''
  showModal.value = true
}

const saveService = () => {
  if (editingId.value) {
    updateService(editingId.value, { ...form })
    toastStore.showToast(`Service "${form.title}" updated.`, 'success')
  } else {
    addService({ ...form })
    toastStore.showToast(`Service "${form.title}" added to catalog.`, 'success')
  }
  showModal.value = false
}

const handleReset = () => {
  resetServices()
  toastStore.showToast('Service catalog restored to defaults.', 'info')
}

const getActionItems = (svc) => [
  { label: 'Edit Service', icon: Edit, command: () => openEditModal(svc) },
  {
    label: svc.status === 'Inactive' ? 'Activate' : 'Set Inactive',
    icon: Power,
    command: () => {
      const next = svc.status === 'Inactive' ? 'Active' : 'Inactive'
      updateService(svc.id, { status: next })
      toastStore.showToast(`Service marked ${next}.`, 'info')
    }
  },
  {
    label: 'Delete',
    icon: Trash2,
    textClass: 'text-danger',
    iconClass: 'text-danger',
    command: () => {
      deleteService(svc.id)
      toastStore.showToast(`Deleted "${svc.title}".`, 'info')
    }
  }
]
</script>
