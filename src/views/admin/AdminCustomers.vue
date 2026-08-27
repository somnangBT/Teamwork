<template>
    <div style="background-color: var(--surface-ground);">
        <div class="mb-2 d-flex flex-column flex-xl-row align-items-xl-center gap-2 w-100">
            <div class="flex-grow-1 overflow-auto pb-1 pb-xl-0 d-flex align-items-center gap-2" style="min-width: 0;">
                <BaseButton v-if="hasActiveFilters" @click="resetFilters" variant="outline-danger" v-tooltip.top="'Reset Filters'" class="flex-shrink-0">
                    <FilterX :size="16" />
                </BaseButton>
                <BaseFilter v-model="selectedTier" :options="tierFilterOptions" style="min-width: max-content;" />
            </div>
            
            <div class="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 flex-shrink-0">
                <div class="search-input">
                    <BaseInput 
                        v-model="searchQuery" 
                        placeholder="Search users..." 
                        :prefixIcon="Search"
                        clearable
                    />
                </div>

                <div class="status-select">
                    <BaseSelect 
                        v-model="selectedStatus" 
                        :options="statusOptions"
                        placeholder="Status"
                    >
                        <template #value="slotProps">
                            <BaseBadge v-if="slotProps.value === true" status="ACTIVE" pill size="sm" />
                            <BaseBadge v-else-if="slotProps.value === false" status="INACTIVE" pill size="sm" />
                            <span v-else class="text-muted">Status</span>
                        </template>
                        <template #option="slotProps">
                            <BaseBadge v-if="slotProps.option.value === true" status="ACTIVE" pill size="sm" />
                            <BaseBadge v-else-if="slotProps.option.value === false" status="INACTIVE" pill size="sm" />
                            <span v-else>{{ slotProps.option.label }}</span>
                        </template>
                    </BaseSelect>
                </div>
                
                <input type="file" accept=".csv" ref="csvInputRef" style="display: none;" />
                <BaseButton @click="triggerFileInput" variant="outline-primary"
                    class="btn d-flex align-items-center gap-2 text-nowrap" v-tooltip="'Import CSV'">
                    <FileDown class="text-success" :size="16" />
                </BaseButton>
                <BaseButton @click="openCreateModal"
                    class="btn btn-primary text-nowrap">
                    Add New User
                </BaseButton>
            </div>
        </div>
        <BaseTable 
            :columns="colDefs" 
            :rows="filteredCustomers"
            :paginated="true"
            :perPage="6"
            :rowClass="getUserRowClass"
        >
            <template #username="{ row }">
                <div class="d-flex align-items-center gap-3">
                    <div>
                        <div class="user-profile-avatar d-flex align-items-center justify-content-center text-muted"
                            style="border-radius: 50%;">
                            <img v-if="row.avatar" :src="row.avatar" class="img-fluid" style="border-radius: 50%;">
                            <User v-else :size="20" />
                        </div>
                    </div>
                    <div class="d-flex flex-column align-items-start" style="min-width: 0;">
                        <span class="fw-medium truncate-1-line" :title="row.name">{{ row.name }}</span>
                    </div>
                </div>
            </template>

            <template #email="{ row }">
                <span :class="[`text-${getRoleVariant(row.loyaltyTier)}`]" class="truncate-1-line" :title="row.email">
                    {{ row.email || `${row.name.toLowerCase().replace(/\s+/g, '.')}@sample.com` }}
                </span>
            </template>

            <template #role="{ row }">
                <BaseBadge 
                    v-if="row.loyaltyTier"
                    :variant="getRoleVariant(row.loyaltyTier)" 
                    :label="row.loyaltyTier" 
                    :icon="getRoleIcon(row.loyaltyTier)" 
                    pill 
                    size="sm" 
                />
            </template>

            <template #createdAt="{ row }">
                <span>{{ row.joinDate || 'Oct 15, 2023' }}</span>
            </template>

            <template #isActive="{ row }">
                <BaseBadge 
                    :status="(row.totalSpent || 0) > 0 ? 'ACTIVE' : 'INACTIVE'" 
                    pill 
                    size="sm" 
                />
            </template>

            <template #action="{ row }">
                <BaseActionMenu :items="getActionItems(row)" />
            </template>
        </BaseTable>
    </div>

    <!-- Modals -->
    <BaseModal v-model="isModalOpen" :title="isEditing ? `Edit User: ${form.name}` : 'Add New User'" size="md">
        <form @submit.prevent="saveCustomerForm" class="row g-3">
            <div class="col-12 col-md-6">
                <BaseInput v-model="form.name" label="First & Last Name" :required="true" />
            </div>
            <div class="col-12 col-md-6">
                <BaseInput v-model="form.email" label="Email Address" />
            </div>
            <div class="col-12 col-md-6">
                <BaseInput v-model="form.phone" label="Phone Number" :required="true" />
            </div>
            <div class="col-12 col-md-6">
                <BaseSelect v-model="form.loyaltyTier" label="Role / Tier" :options="tierListOptions" />
            </div>
        </form>
        <template #footer>
            <div class="d-flex gap-2 w-100 justify-content-end">
                <BaseButton variant="outline-secondary" @click="isModalOpen = false">Cancel</BaseButton>
                <BaseButton variant="primary" @click="saveCustomerForm">
                    {{ isEditing ? 'Save Changes' : 'Create User' }}
                </BaseButton>
            </div>
        </template>
    </BaseModal>

    <BaseModal v-model="showStatusModal" :title="targetStatusUser && targetStatusUser.totalSpent > 0 ? 'Deactivate User' : 'Activate User'" size="sm">
        <div class="text-center">
            <div class="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle" 
                 :class="targetStatusUser && targetStatusUser.totalSpent > 0 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'" 
                 style="width: 60px; height: 60px;">
                <X v-if="targetStatusUser && targetStatusUser.totalSpent > 0" :size="28" />
                <Check v-else :size="28" />
            </div>
            <p class="mb-4 fw-medium text-muted">
                Are you sure you want to {{ targetStatusUser && targetStatusUser.totalSpent > 0 ? 'deactivate' : 'activate' }}
                <strong class="text-base">{{ targetStatusUser?.name }}</strong>?
            </p>
            <div class="d-flex gap-2">
                <BaseButton :variant="targetStatusUser && targetStatusUser.totalSpent > 0 ? 'outline-danger' : 'outline-success'" type="button" class="flex-grow-1"
                    @click="showStatusModal = false">
                    Cancel
                </BaseButton>
                <BaseButton :variant="targetStatusUser && targetStatusUser.totalSpent > 0 ? 'danger' : 'success'" type="button" class="flex-grow-1" 
                    @click="confirmStatusChange()">
                    {{ targetStatusUser && targetStatusUser.totalSpent > 0 ? 'Deactivate Now' : 'Activate Now' }}
                </BaseButton>
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import BaseTable from '../../components/base/BaseTable.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseModal from '../../components/base/BaseModal.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseFilter from '../../components/base/BaseFilter.vue'
import BaseBadge from '../../components/base/BaseBadge.vue'
import BaseActionMenu from '../../components/base/BaseActionMenu.vue'
import { BadgeCheck, Info, User, KeyRound, Search, FileDown, Check, X, BookOpen, FilterX } from '@lucide/vue'
import { useAdmin } from '../../composables/useAdmin'

const { customers, addCustomer, updateCustomer, deleteCustomer } = useAdmin()

const searchQuery = ref('')
const selectedTier = ref(null)
const selectedStatus = ref(null)

const isModalOpen = ref(false)
const isEditing = ref(false)
const showStatusModal = ref(false)
const targetStatusUser = ref(null)

const form = reactive({
  id: null,
  name: '',
  phone: '',
  email: '',
  loyaltyTier: 'New Member',
  totalSpent: 0
})

const colDefs = [
    { key: 'username', label: 'User', width: '25%' },
    { key: 'email', label: 'Email Address' },
    { key: 'role', label: 'Role', sortable: false },
    { key: 'isActive', label: 'Status' },
    { key: 'createdAt', label: 'Joined On' },
    { key: 'action', label: '', sortable: false, width: '50px' },
];

const tierFilterOptions = computed(() => [
    { label: 'All Users', value: null, badge: customers.value.length, variant: 'primary' },
    { label: 'VIP Platinum', value: 'VIP Platinum', variant: 'success' },
    { label: 'VIP Gold', value: 'VIP Gold', variant: 'info' },
    { label: 'Silver Member', value: 'Silver Member', variant: 'secondary' },
    { label: 'New Member', value: 'New Member', variant: 'secondary' }
]);

const statusOptions = ref([
    { label: 'All Status', value: null },
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
]);

const tierListOptions = [
  { label: 'VIP Platinum', value: 'VIP Platinum' },
  { label: 'VIP Gold', value: 'VIP Gold' },
  { label: 'Silver Member', value: 'Silver Member' },
  { label: 'New Member', value: 'New Member' }
]

const hasActiveFilters = computed(() => {
    return !!searchQuery.value || selectedTier.value !== null || selectedStatus.value !== null;
});

const resetFilters = () => {
    searchQuery.value = '';
    selectedTier.value = null;
    selectedStatus.value = null;
};

const getRoleVariant = (tier) => {
    switch(tier) {
        case 'VIP Platinum': return 'success';
        case 'VIP Gold': return 'warning';
        case 'Silver Member': return 'info';
        default: return 'secondary';
    }
};

const getRoleIcon = (tier) => {
    switch(tier) {
        case 'VIP Platinum': return BadgeCheck;
        case 'VIP Gold': return BookOpen;
        default: return User;
    }
};

const getUserRowClass = (data) => {
    return (data && (data.totalSpent || 0) === 0) ? 'row-border-secondary opacity-75' : '';
};

const getActionItems = (data) => [
    {
        label: 'Edit User',
        icon: Info,
        command: () => openEditModal(data),
    },
    {
        label: (data.totalSpent || 0) > 0 ? 'Deactivate User' : 'Activate User',
        icon: (data.totalSpent || 0) > 0 ? X : Check,
        command: () => promptToggleStatus(data),
        iconClass: (data.totalSpent || 0) > 0 ? 'text-danger' : 'text-success'
    },
    {
        label: 'Delete User',
        icon: KeyRound,
        command: () => confirmDelete(data),
        iconClass: 'text-warning'
    }
];

const filteredCustomers = computed(() => {
  return customers.value.filter(c => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const match = (c.name && c.name.toLowerCase().includes(q)) ||
                    (c.email && c.email.toLowerCase().includes(q)) ||
                    (c.phone && c.phone.toLowerCase().includes(q))
      if (!match) return false
    }

    if (selectedTier.value) {
      if (c.loyaltyTier !== selectedTier.value) return false
    }
    
    if (selectedStatus.value !== null) {
      const isActive = (c.totalSpent || 0) > 0
      if (isActive !== selectedStatus.value) return false
    }

    return true
  })
})

const csvInputRef = ref(null);
const triggerFileInput = () => {
    if (csvInputRef.value) csvInputRef.value.click();
};

const openCreateModal = () => {
  isEditing.value = false
  form.id = null
  form.name = ''
  form.phone = ''
  form.email = ''
  form.loyaltyTier = 'New Member'
  form.totalSpent = 1
  isModalOpen.value = true
}

const openEditModal = (row) => {
  isEditing.value = true
  form.id = row.id
  form.name = row.name
  form.phone = row.phone
  form.email = row.email
  form.loyaltyTier = row.loyaltyTier || 'VIP Gold'
  form.totalSpent = row.totalSpent || 1
  isModalOpen.value = true
}

const saveCustomerForm = () => {
  if (!form.name) return

  if (isEditing.value) {
    updateCustomer(form.id, {
      name: form.name,
      phone: form.phone,
      email: form.email,
      loyaltyTier: form.loyaltyTier,
      totalSpent: Number(form.totalSpent),
    })
  } else {
    addCustomer({
      name: form.name,
      phone: form.phone,
      email: form.email || `${form.name.toLowerCase().replace(/\s+/g, '.')}@sample.com`,
      loyaltyTier: form.loyaltyTier,
      totalSpent: Number(form.totalSpent),
    })
  }

  isModalOpen.value = false
}

const promptToggleStatus = (data) => {
    targetStatusUser.value = data;
    showStatusModal.value = true;
};

const confirmStatusChange = () => {
    if (!targetStatusUser.value) return;
    const data = targetStatusUser.value;
    
    // Simulate toggling activation via spend (since this is CRM)
    const originalStatus = (data.totalSpent || 0) > 0;
    const newStatus = !originalStatus;

    updateCustomer(data.id, {
        ...data,
        totalSpent: newStatus ? 1 : 0
    });

    showStatusModal.value = false;
    targetStatusUser.value = null;
};

const confirmDelete = (row) => {
  if (confirm(`Are you sure you want to delete ${row.name}?`)) {
    deleteCustomer(row.id)
  }
}
</script>

<style scoped>
.user-profile-avatar {
    width: 35px;
    height: 35px;
    background-color: var(--surface-ground);
    border-radius: 50px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: var(--border-width) solid var(--border-clr);
}

.user-profile-avatar img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.status-select,
.search-input {
    width: 100%;
}

@media (min-width: 576px) {
    .status-select {
        width: 150px;
    }
    .search-input {
        width: 300px;
    }
}
</style>
