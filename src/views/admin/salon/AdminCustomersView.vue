<template>
  <div class="admin-customers-view">
    <DashboardPageTitle
      title="Customers & Beauty Profiles"
      subtitle="Manage client beauty profiles, loyalty tiers, hair/skin notes, and visit history."
    >
      <BaseButton variant="primary" @click="openCreateModal">
        <UserPlus :size="17" />
        <span class="d-none d-sm-inline">Add Customer</span>
      </BaseButton>
    </DashboardPageTitle>

    <div class="card p-3" style="background-color: var(--surface-ground);">
      <div class="mb-3 d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-2">
        <div class="flex-grow-1 overflow-auto pb-1 pb-xl-0" style="min-width: 0;">
          <BaseFilter v-model="selectedTier" :options="tierOptions" style="min-width: max-content;" />
        </div>
        <div style="min-width: 250px;">
          <BaseInput v-model="searchQuery" placeholder="Search client or beauty profile..." :prefixIcon="Search" clearable />
        </div>
      </div>

      <BaseTable
        :columns="colDefs"
        :rows="paginatedCustomers"
        :total-records="filteredCustomers.length"
        v-model:page="page"
        v-model:per-page="perPage"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
      >
        <template #name="{ data }">
          <div class="d-flex align-items-center gap-2">
            <img :src="data.avatar" :alt="data.name" class="rounded-circle object-fit-cover flex-shrink-0" style="width: 34px; height: 34px;" />
            <div>
              <div class="fw-semibold" style="color: var(--text-heading-color);">{{ data.name }}</div>
              <small class="text-muted">{{ data.email }}</small>
            </div>
          </div>
        </template>

        <template #petName="{ data }">
          <div>
            <div class="fw-medium">✨ {{ data.petName }} ({{ data.petType }})</div>
            <small class="text-muted">{{ data.petBreed }} · {{ data.petAge }}</small>
          </div>
        </template>

        <template #loyaltyTier="{ data }">
          <span class="badge rounded-pill px-2 py-1 fw-semibold" style="background: var(--primary-color-soft); color: var(--primary-color);">
            {{ data.loyaltyTier }}
          </span>
        </template>

        <template #totalSpent="{ data }">
          <span class="fw-bold text-primary">${{ Number(data.totalSpent || 0).toFixed(2) }}</span>
        </template>

        <template #action="{ data }">
          <BaseActionMenu :items="getActionItems(data)" />
        </template>
      </BaseTable>
    </div>

    <!-- Customer Modal -->
    <BaseModal v-model="showModal" :title="editingId ? 'Edit Customer' : 'Add Customer'" size="md">
      <form @submit.prevent="saveCustomer">
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <BaseInput v-model="form.name" label="Full Name" required />
          </div>
          <div class="col-md-6">
            <BaseInput v-model="form.email" label="Email" type="email" required />
          </div>
          <div class="col-md-6">
            <BaseInput v-model="form.phone" label="Phone" required />
          </div>
          <div class="col-md-6">
            <BaseSelect
              v-model="form.loyaltyTier"
              label="Loyalty Tier"
              :options="[
                { label: 'New Member', value: 'New Member' },
                { label: 'Silver Member', value: 'Silver Member' },
                { label: 'VIP Gold', value: 'VIP Gold' },
                { label: 'VIP Platinum', value: 'VIP Platinum' }
              ]"
            />
          </div>
          <div class="col-md-4">
            <BaseInput v-model="form.petName" label="Beauty Profile" required />
          </div>
          <div class="col-md-4">
            <BaseSelect
              v-model="form.petType"
              label="Focus Area"
              :options="[
                { label: 'Hair & Skin', value: 'Hair & Skin' },
                { label: 'Facial & Spa', value: 'Facial & Spa' },
                { label: 'Color & Glow', value: 'Color & Glow' },
                { label: 'Nails & Beauty', value: 'Nails & Beauty' }
              ]"
            />
          </div>
          <div class="col-md-4">
            <BaseInput v-model="form.petBreed" label="Hair Texture" required />
          </div>
          <div class="col-12">
            <BaseInput v-model="form.specialNotes" type="textarea" :rows="2" label="Beauty & Sensitivity Notes" />
          </div>
        </div>
        <div class="d-flex justify-content-end gap-2 pt-2 border-top">
          <BaseButton type="button" variant="outline-secondary" @click="showModal = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">{{ editingId ? 'Save Changes' : 'Create Customer' }}</BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { UserPlus, Search, Edit, Trash2 } from '@lucide/vue'
import { useAdmin } from '@/composables/useAdmin'
import { useToastStore } from '@/stores/toast'
import DashboardPageTitle from '@/components/common/DashboardPageTitle.vue'

const toastStore = useToastStore()
const { customers, addCustomer, updateCustomer, deleteCustomer } = useAdmin()

const selectedTier = ref('')
const searchQuery = ref('')
const page = ref(1)
const perPage = ref(10)
const sortBy = ref('name')
const sortOrder = ref('asc')

const tierOptions = computed(() => [
  { label: 'All', value: '', badge: customers.value.length },
  { label: 'VIP Platinum', value: 'VIP Platinum', badge: customers.value.filter(c => c.loyaltyTier === 'VIP Platinum').length },
  { label: 'VIP Gold', value: 'VIP Gold', badge: customers.value.filter(c => c.loyaltyTier === 'VIP Gold').length },
  { label: 'Silver Member', value: 'Silver Member', badge: customers.value.filter(c => c.loyaltyTier === 'Silver Member').length },
  { label: 'New Member', value: 'New Member', badge: customers.value.filter(c => c.loyaltyTier === 'New Member').length }
])

const colDefs = [
  { field: 'name', header: 'Client', sortable: true },
  { field: 'petName', header: 'Beauty Profile', sortable: true },
  { field: 'loyaltyTier', header: 'Tier', sortable: true },
  { field: 'totalVisits', header: 'Visits', sortable: true },
  { field: 'totalSpent', header: 'Total Spent', sortable: true },
  { field: 'lastVisit', header: 'Last Visit', sortable: true },
  { field: 'action', header: 'Actions', sortable: false }
]

const filteredCustomers = computed(() => {
  let list = [...customers.value]
  if (selectedTier.value) {
    list = list.filter(c => c.loyaltyTier === selectedTier.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        (c.petName || '').toLowerCase().includes(q) ||
        (c.petBreed || '').toLowerCase().includes(q)
    )
  }
  return list
})

const paginatedCustomers = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filteredCustomers.value.slice(start, start + perPage.value)
})

const showModal = ref(false)
const editingId = ref(null)
const form = reactive({
  name: '',
  email: '',
  phone: '',
  petName: '',
  petType: 'Hair & Skin',
  petBreed: '',
  petAge: 'Combination Skin',
  loyaltyTier: 'New Member',
  specialNotes: ''
})

const openCreateModal = () => {
  editingId.value = null
  form.name = ''
  form.email = ''
  form.phone = ''
  form.petName = ''
  form.petType = 'Hair & Skin'
  form.petBreed = ''
  form.loyaltyTier = 'New Member'
  form.specialNotes = ''
  showModal.value = true
}

const openEditModal = (c) => {
  editingId.value = c.id
  form.name = c.name
  form.email = c.email
  form.phone = c.phone
  form.petName = c.petName
  form.petType = c.petType
  form.petBreed = c.petBreed
  form.loyaltyTier = c.loyaltyTier
  form.specialNotes = c.specialNotes || ''
  showModal.value = true
}

const saveCustomer = () => {
  if (editingId.value) {
    updateCustomer(editingId.value, { ...form })
    toastStore.showToast(`Customer "${form.name}" updated.`, 'success')
  } else {
    addCustomer({ ...form })
    toastStore.showToast(`Customer "${form.name}" added.`, 'success')
  }
  showModal.value = false
}

const getActionItems = (c) => [
  { label: 'Edit Profile', icon: Edit, command: () => openEditModal(c) },
  {
    label: 'Delete',
    icon: Trash2,
    textClass: 'text-danger',
    iconClass: 'text-danger',
    command: () => {
      deleteCustomer(c.id)
      toastStore.showToast(`Removed ${c.name}.`, 'info')
    }
  }
]
</script>
