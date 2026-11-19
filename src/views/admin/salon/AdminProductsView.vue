<template>
  <div class="admin-products-view">
    <DashboardPageTitle
      title="Products & Inventory"
      subtitle="Manage women's haircare, botanical serums, skincare, retail pricing, and stock levels."
    >
      <BaseButton variant="outline-secondary" @click="handleReset">
        <RotateCcw :size="15" />
        <span class="d-none d-sm-inline">Reset</span>
      </BaseButton>
      <BaseButton variant="primary" @click="openCreateModal">
        <Plus :size="17" />
        <span class="d-none d-sm-inline">Add Product</span>
      </BaseButton>
    </DashboardPageTitle>

    <div class="card p-3" style="background-color: var(--surface-ground);">
      <!-- Category Tabs using BaseFilter / BaseButton -->
      <div class="mb-2 overflow-auto pb-1" style="min-width: 0;">
        <BaseFilter v-model="selectedCategory" :options="categoryTabOptions" style="min-width: max-content;" />
      </div>

      <div class="mb-3 d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-2">
        <div class="flex-grow-1 overflow-auto pb-1 pb-xl-0" style="min-width: 0;">
          <BaseFilter v-model="selectedStatus" :options="statusFilterOptions" style="min-width: max-content;" />
        </div>
        <div class="flex-shrink-0" style="min-width: 240px;">
          <BaseInput v-model="searchQuery" placeholder="Search products..." :prefixIcon="Search" clearable />
        </div>
      </div>

      <BaseTable
        :columns="colDefs"
        :rows="paginatedProducts"
        :total-records="filteredProducts.length"
        v-model:page="page"
        v-model:per-page="perPage"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
      >
        <template #name="{ data }">
          <div class="d-flex align-items-center gap-2">
            <img :src="data.image" :alt="data.name" class="rounded-3 object-fit-cover flex-shrink-0" style="width: 38px; height: 38px;" />
            <div class="min-w-0">
              <div class="fw-semibold text-truncate" style="max-width: 240px; color: var(--text-heading-color);">{{ data.name }}</div>
              <small v-if="data.tag" class="text-primary fw-semibold">{{ data.tag }}</small>
            </div>
          </div>
        </template>

        <template #price="{ data }">
          <span class="fw-bold text-primary">{{ data.price }}</span>
        </template>

        <template #stock="{ data }">
          <span class="fw-semibold">{{ data.stock }} units</span>
        </template>

        <template #status="{ data }">
          <BaseBadge :status="data.status || 'In Stock'" size="sm" />
        </template>

        <template #action="{ data }">
          <BaseActionMenu :items="getActionItems(data)" />
        </template>
      </BaseTable>
    </div>

    <!-- Product Modal -->
    <BaseModal v-model="showModal" :title="editingId ? 'Edit Product' : 'Add New Product'" size="md">
      <form @submit.prevent="saveProduct">
        <div class="row g-3 mb-3">
          <div class="col-12">
            <BaseInput v-model="form.name" label="Product Name" required />
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
            <BaseInput v-model="form.rawPrice" type="number" label="Price ($)" required />
          </div>
          <div class="col-md-4">
            <BaseInput v-model="form.stock" type="number" label="Stock Quantity" required />
          </div>
          <div class="col-md-6">
            <BaseInput v-model="form.tag" label="Highlight Tag" placeholder="Best Seller, Top Rated" />
          </div>
          <div class="col-md-6">
            <BaseInput v-model="form.image" label="Image URL" placeholder="https://..." />
          </div>
          <div class="col-12">
            <BaseInput v-model="form.description" type="textarea" :rows="3" label="Description" required />
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 pt-2 border-top">
          <BaseButton type="button" variant="outline-secondary" @click="showModal = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">{{ editingId ? 'Save Changes' : 'Add Product' }}</BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { Plus, Search, RotateCcw, Edit, PackagePlus, Trash2 } from '@lucide/vue'
import { useProducts } from '@/composables/useProducts'
import { useToastStore } from '@/stores/toast'
import DashboardPageTitle from '@/components/common/DashboardPageTitle.vue'

const toastStore = useToastStore()
const { products, categories, addProduct, updateProduct, deleteProduct, resetProducts } = useProducts()

const selectedStatus = ref('All')
const selectedCategory = ref('All')
const searchQuery = ref('')
const page = ref(1)
const perPage = ref(10)
const sortBy = ref('id')
const sortOrder = ref('asc')

watch([selectedStatus, selectedCategory, searchQuery], () => {
  page.value = 1
})

const categoryTabOptions = computed(() => {
  const list = Array.isArray(categories) ? categories : (categories?.value || [])
  return list.map(c => ({
    label: c === 'All' ? 'All Categories' : c,
    value: c,
    badge: c === 'All'
      ? products.value.length
      : products.value.filter(p => p.category === c).length
  }))
})

const statusFilterOptions = computed(() => [
  { label: 'All', value: 'All', badge: products.value.length },
  { label: 'In Stock', value: 'In Stock', variant: 'success', badge: products.value.filter(p => p.status === 'In Stock').length },
  { label: 'Low Stock', value: 'Low Stock', variant: 'warning', badge: products.value.filter(p => p.status === 'Low Stock').length },
  { label: 'Out of Stock', value: 'Out of Stock', variant: 'danger', badge: products.value.filter(p => p.status === 'Out of Stock').length }
])

const colDefs = [
  { field: 'name', header: 'Product', sortable: true },
  { field: 'category', header: 'Category', sortable: true },
  { field: 'price', header: 'Price', sortable: true },
  { field: 'stock', header: 'Stock', sortable: true },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'action', header: 'Actions', sortable: false }
]

const filteredProducts = computed(() => {
  let list = [...products.value]
  if (selectedStatus.value !== 'All') {
    list = list.filter(p => p.status === selectedStatus.value)
  }
  if (selectedCategory.value !== 'All') {
    list = list.filter(p => p.category === selectedCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  }
  return list
})

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filteredProducts.value.slice(start, start + perPage.value)
})

const showModal = ref(false)
const editingId = ref(null)
const form = reactive({
  name: '',
  category: 'Hair Care',
  rawPrice: 28.00,
  stock: 20,
  tag: '',
  image: '/images/shampoo.jpg',
  description: ''
})

const openCreateModal = () => {
  editingId.value = null
  form.name = ''
  form.category = 'Hair Care'
  form.rawPrice = 28.00
  form.stock = 20
  form.tag = ''
  form.image = '/images/shampoo.jpg'
  form.description = ''
  showModal.value = true
}

const openEditModal = (prod) => {
  editingId.value = prod.id
  form.name = prod.name
  form.category = prod.category
  form.rawPrice = prod.rawPrice
  form.stock = prod.stock
  form.tag = prod.tag || ''
  form.image = prod.image
  form.description = prod.description || ''
  showModal.value = true
}

const saveProduct = () => {
  if (editingId.value) {
    updateProduct(editingId.value, { ...form })
    toastStore.showToast(`Product "${form.name}" updated.`, 'success')
  } else {
    addProduct({ ...form })
    toastStore.showToast(`Product "${form.name}" added.`, 'success')
  }
  showModal.value = false
}

const handleReset = () => {
  resetProducts()
  toastStore.showToast('Inventory reset to defaults.', 'info')
}

const getActionItems = (prod) => [
  { label: 'Edit Product', icon: Edit, command: () => openEditModal(prod) },
  {
    label: 'Restock +10',
    icon: PackagePlus,
    command: () => {
      updateProduct(prod.id, { stock: (Number(prod.stock) || 0) + 10 })
      toastStore.showToast(`Restocked ${prod.name} (+10 units).`, 'success')
    }
  },
  {
    label: 'Delete',
    icon: Trash2,
    textClass: 'text-danger',
    iconClass: 'text-danger',
    command: () => {
      deleteProduct(prod.id)
      toastStore.showToast(`Deleted "${prod.name}".`, 'info')
    }
  }
]
</script>
