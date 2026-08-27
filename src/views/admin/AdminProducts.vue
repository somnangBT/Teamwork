<template>
  <div class="admin-products-page">
    
    <!-- Top Header & Actions -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
      <div>
        <h3 class="fw-bolder text-dark mb-1" style="letter-spacing: -0.02em;">Products & Inventory</h3>
        <p class="text-muted small mb-0">Track retail pet supplies, organic shampoos, food stock levels, and store pricing.</p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button 
          type="button" 
          class="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold small bg-white"
          @click="resetInventory"
          title="Reset inventory to default"
        >
          <span>↺ Reset</span>
        </button>

        <button 
          type="button" 
          class="btn btn-orange rounded-pill px-3.5 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-xs"
          @click="openCreateModal"
        >
          <span>+</span>
          <span>Add New Product</span>
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
            placeholder="Search product name, category, or tag..." 
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
            {{ filteredProducts.length }} Items Listed
          </span>
        </div>
      </div>
    </div>

    <!-- Products BaseTable -->
    <BaseTable 
      :columns="tableColumns" 
      :rows="filteredProducts"
      :paginated="true"
      :perPage="6"
      :showIndex="true"
    >
      <!-- Product Details Column -->
      <template #product="{ row }">
        <div class="d-flex align-items-center gap-3">
          <img 
            :src="row.image" 
            :alt="row.name" 
            class="rounded-3 object-fit-cover border flex-shrink-0"
            style="width: 52px; height: 52px;"
          />
          <div class="overflow-hidden">
            <div class="d-flex align-items-center gap-1.5 flex-wrap">
              <strong class="text-dark small text-truncate">{{ row.name }}</strong>
              <span v-if="row.tag" class="badge bg-orange-soft text-orange fw-bold" style="font-size: 0.65rem;">
                {{ row.tag }}
              </span>
            </div>
            <span class="badge bg-light text-muted border rounded-pill px-2 py-0.5 mt-0.5 small" style="font-size: 0.68rem;">
              {{ row.category }}
            </span>
          </div>
        </div>
      </template>

      <!-- Price Column -->
      <template #price="{ row }">
        <strong class="text-dark fs-6">{{ row.price }}</strong>
      </template>

      <!-- Stock Quantity Column with +/- Adjusters -->
      <template #stock="{ row }">
        <div class="d-flex align-items-center gap-2">
          <button 
            type="button"
            class="btn btn-sm btn-light border rounded-circle p-0 d-flex align-items-center justify-content-center"
            style="width: 24px; height: 24px; font-size: 0.75rem;"
            @click="adjustStock(row, -1)"
            :disabled="row.stock <= 0"
          >
            -
          </button>
          
          <span class="small fw-bold px-1" :class="row.stock < 10 ? 'text-danger' : 'text-dark'">
            {{ row.stock }}
          </span>

          <button 
            type="button"
            class="btn btn-sm btn-light border rounded-circle p-0 d-flex align-items-center justify-content-center"
            style="width: 24px; height: 24px; font-size: 0.75rem;"
            @click="adjustStock(row, 1)"
          >
            +
          </button>
        </div>
      </template>

      <!-- Status Column -->
      <template #status="{ row }">
        <span 
          class="badge rounded-pill fw-bold"
          :class="row.stock <= 0 ? 'bg-danger-subtle text-danger border border-danger-subtle' : (row.stock < 10 ? 'bg-warning-subtle text-warning border border-warning-subtle' : 'bg-success-subtle text-success border border-success-subtle')"
          style="font-size: 0.72rem;"
        >
          {{ row.status || (row.stock <= 0 ? 'Out of Stock' : (row.stock < 10 ? 'Low Stock' : 'In Stock')) }}
        </span>
      </template>

      <!-- Actions Column -->
      <template #actions="{ row }">
        <div class="d-flex align-items-center justify-content-end gap-1.5">
          <button 
            type="button" 
            class="btn btn-sm btn-light border rounded-pill px-2.5 py-1 text-muted"
            @click="openEditModal(row)"
            title="Edit Product"
          >
            ✏️ Edit
          </button>
          <button 
            type="button" 
            class="btn btn-sm btn-light border rounded-pill px-2 py-1 text-danger"
            @click="confirmDelete(row)"
            title="Delete Product"
          >
            🗑️
          </button>
        </div>
      </template>
    </BaseTable>

    <!-- Create / Edit Product BaseModal -->
    <BaseModal 
      v-model="isModalOpen" 
      :title="isEditing ? `Edit Product: ${form.name}` : 'Add New Retail Product'"
      size="lg"
    >
      <form @submit.prevent="saveProductForm" class="row g-3">
        <div class="col-12 col-md-8">
          <BaseInput 
            v-model="form.name" 
            label="Product Name" 
            placeholder="e.g. Royal Canin Hypoallergenic (10kg)"
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
            v-model="form.rawPrice" 
            type="number"
            label="Price ($)" 
            placeholder="24.90"
            :required="true"
          />
        </div>

        <div class="col-12 col-md-4">
          <BaseInput 
            v-model="form.stock" 
            type="number"
            label="Initial Stock Quantity" 
            placeholder="25"
            :required="true"
          />
        </div>

        <div class="col-12 col-md-4">
          <BaseInput 
            v-model="form.tag" 
            label="Badge / Tag (Optional)" 
            placeholder="e.g. Best Seller, Top Rated"
          />
        </div>

        <div class="col-12">
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
            label="Product Description" 
            placeholder="Details on nutritional value, sizing, material, or application..."
            :rows="3"
          />
        </div>
      </form>

      <template #footer>
        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" @click="isModalOpen = false">
          Cancel
        </button>
        <button type="button" class="btn btn-orange rounded-pill px-4 fw-semibold" @click="saveProductForm">
          {{ isEditing ? 'Save Changes' : 'Create Product' }}
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
import { useProducts } from '../../composables/useProducts'

const { products, categories, addProduct, updateProduct, deleteProduct, resetProducts } = useProducts()

const searchQuery = ref('')
const selectedCategory = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)

const form = reactive({
  id: null,
  name: '',
  category: 'Food & Nutrition',
  rawPrice: 24.99,
  stock: 20,
  tag: '',
  image: '',
  description: ''
})

const tableColumns = [
  { key: 'product', label: 'Product & Category', width: '45%' },
  { key: 'price', label: 'Unit Price', sortable: true },
  { key: 'stock', label: 'Stock Level', sortable: true },
  { key: 'status', label: 'Inventory Status' }
]

const categoryOptions = computed(() => {
  return categories.map(c => ({ label: c === 'All' ? 'All Categories' : c, value: c === 'All' ? '' : c }))
})

const rawCategories = computed(() => {
  return categories.filter(c => c !== 'All').map(c => ({ label: c, value: c }))
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const match = (p.name && p.name.toLowerCase().includes(q)) ||
                    (p.category && p.category.toLowerCase().includes(q)) ||
                    (p.tag && p.tag.toLowerCase().includes(q)) ||
                    (p.description && p.description.toLowerCase().includes(q))
      if (!match) return false
    }

    if (selectedCategory.value) {
      if (p.category !== selectedCategory.value) return false
    }

    return true
  })
})

const openCreateModal = () => {
  isEditing.value = false
  form.id = null
  form.name = ''
  form.category = 'Food & Nutrition'
  form.rawPrice = 24.99
  form.stock = 30
  form.tag = ''
  form.image = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=600'
  form.description = ''
  isModalOpen.value = true
}

const openEditModal = (row) => {
  isEditing.value = true
  form.id = row.id
  form.name = row.name
  form.category = row.category
  form.rawPrice = row.rawPrice || parseFloat(row.price.replace(/[^0-9.]/g, '')) || 0
  form.stock = row.stock || 0
  form.tag = row.tag || ''
  form.image = row.image || ''
  form.description = row.description || ''
  isModalOpen.value = true
}

const saveProductForm = () => {
  if (!form.name || form.rawPrice === undefined) return

  if (isEditing.value) {
    updateProduct(form.id, {
      name: form.name,
      category: form.category,
      rawPrice: Number(form.rawPrice),
      stock: Number(form.stock),
      tag: form.tag,
      image: form.image,
      description: form.description
    })
  } else {
    addProduct({
      name: form.name,
      category: form.category,
      rawPrice: Number(form.rawPrice),
      stock: Number(form.stock),
      tag: form.tag,
      image: form.image,
      description: form.description
    })
  }

  isModalOpen.value = false
}

const adjustStock = (row, delta) => {
  const current = row.stock || 0
  const next = Math.max(0, current + delta)
  updateProduct(row.id, { stock: next })
}

const confirmDelete = (row) => {
  if (confirm(`Are you sure you want to remove "${row.name}" from inventory?`)) {
    deleteProduct(row.id)
  }
}

const resetInventory = () => {
  if (confirm('Reset product inventory back to default catalog?')) {
    resetProducts()
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

[data-theme="dark"] .btn-light {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}
</style>
