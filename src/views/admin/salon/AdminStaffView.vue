<template>
  <div class="admin-staff-view">
    <DashboardPageTitle
      title="Specialists & Staff"
      subtitle="Manage certified stylists, facialists, duty shifts, specialties, and appointment capacity."
    >
      <BaseButton variant="primary" @click="openCreateModal">
        <UserPlus :size="17" />
        <span class="d-none d-sm-inline">Add Specialist</span>
      </BaseButton>
    </DashboardPageTitle>

    <div class="card p-3" style="background-color: var(--surface-ground);">
      <div class="mb-3 d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-2">
        <div class="flex-grow-1 overflow-auto pb-1 pb-xl-0" style="min-width: 0;">
          <BaseFilter v-model="selectedStatus" :options="statusOptions" style="min-width: max-content;" />
        </div>
        <div style="min-width: 240px;">
          <BaseInput v-model="searchQuery" placeholder="Search specialist or skill..." :prefixIcon="Search" clearable />
        </div>
      </div>

      <div class="row g-3">
        <div v-for="member in filteredStaff" :key="member.id" class="col-12 col-md-6 col-xl-4">
          <div class="card p-3 h-100 border" style="background-color: var(--body-bg-color);">
            <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
              <div class="d-flex align-items-center gap-3 min-w-0">
                <img
                  :src="member.avatar"
                  :alt="member.name"
                  class="rounded-circle object-fit-cover border flex-shrink-0"
                  style="width: 54px; height: 54px;"
                />
                <div class="min-w-0">
                  <h6 class="fw-bold mb-0 text-truncate" style="color: var(--text-heading-color);">{{ member.name }}</h6>
                  <small class="text-muted d-block text-truncate">{{ member.role }}</small>
                  <div class="small mt-1 d-flex align-items-center gap-1">
                    <Star :size="13" class="text-warning" fill="currentColor" />
                    <span class="fw-semibold">{{ member.rating }}</span>
                    <span class="text-muted">({{ member.reviewsCount }} reviews)</span>
                  </div>
                </div>
              </div>
              <BaseActionMenu :items="getActionItems(member)" />
            </div>

            <div class="d-flex flex-wrap gap-1 mb-3">
              <span
                v-for="sp in member.specialties"
                :key="sp"
                class="badge rounded-pill px-2 py-1 fw-medium"
                style="background: var(--surface-ground); color: var(--text-base);"
              >
                {{ sp }}
              </span>
            </div>

            <div class="mt-auto pt-2 border-top d-flex align-items-center justify-content-between">
              <BaseBadge :status="member.status" size="sm" />
              <span class="small text-muted">{{ member.activeAppointments || 0 }} active today</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Staff Modal -->
    <BaseModal v-model="showModal" :title="editingId ? 'Edit Specialist' : 'Add Specialist'" size="sm">
      <form @submit.prevent="saveStaff">
        <div class="d-flex flex-column gap-3 mb-4">
          <BaseInput v-model="form.name" label="Full Name" required />
          <BaseInput v-model="form.role" label="Role / Title" required />
          <BaseInput v-model="form.email" label="Email" type="email" required />
          <BaseInput v-model="form.phone" label="Phone" required />
          <BaseSelect
            v-model="form.status"
            label="Duty Status"
            :options="[
              { label: 'On Duty', value: 'On Duty' },
              { label: 'Break', value: 'Break' },
              { label: 'Off Duty', value: 'Off Duty' }
            ]"
          />
          <BaseInput v-model="specialtiesText" label="Specialties (comma-separated)" placeholder="Silk Blowout, Head Spa" />
        </div>
        <div class="d-flex justify-content-end gap-2">
          <BaseButton type="button" variant="outline-secondary" @click="showModal = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">{{ editingId ? 'Save Changes' : 'Add Specialist' }}</BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { UserPlus, Search, Star, Edit, CheckCircle2, Coffee, Moon, Trash2 } from '@lucide/vue'
import { useAdmin } from '@/composables/useAdmin'
import { useToastStore } from '@/stores/toast'
import DashboardPageTitle from '@/components/common/DashboardPageTitle.vue'

const toastStore = useToastStore()
const { staffList, addStaffMember, updateStaffMember, updateStaffStatus, deleteStaffMember } = useAdmin()

const selectedStatus = ref('')
const searchQuery = ref('')

const statusOptions = computed(() => [
  { label: 'All', value: '', badge: staffList.value.length },
  { label: 'On Duty', value: 'On Duty', variant: 'success', badge: staffList.value.filter(s => s.status === 'On Duty').length },
  { label: 'Break', value: 'Break', variant: 'warning', badge: staffList.value.filter(s => s.status === 'Break').length },
  { label: 'Off Duty', value: 'Off Duty', variant: 'secondary', badge: staffList.value.filter(s => s.status === 'Off Duty').length }
])

const filteredStaff = computed(() => {
  let list = [...staffList.value]
  if (selectedStatus.value) {
    list = list.filter(s => s.status === selectedStatus.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        (s.specialties || []).some(sp => sp.toLowerCase().includes(q))
    )
  }
  return list
})

const showModal = ref(false)
const editingId = ref(null)
const specialtiesText = ref('')
const form = reactive({
  name: '',
  role: '',
  email: '',
  phone: '',
  status: 'On Duty'
})

const openCreateModal = () => {
  editingId.value = null
  form.name = ''
  form.role = 'Hair & Beauty Stylist'
  form.email = ''
  form.phone = ''
  form.status = 'On Duty'
  specialtiesText.value = 'Silk Blowout, Botanical Spa'
  showModal.value = true
}

const openEditModal = (member) => {
  editingId.value = member.id
  form.name = member.name
  form.role = member.role
  form.email = member.email
  form.phone = member.phone
  form.status = member.status
  specialtiesText.value = (member.specialties || []).join(', ')
  showModal.value = true
}

const saveStaff = () => {
  const specialties = specialtiesText.value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  if (editingId.value) {
    updateStaffMember(editingId.value, { ...form, specialties })
    toastStore.showToast(`Updated ${form.name}.`, 'success')
  } else {
    addStaffMember({ ...form, specialties })
    toastStore.showToast(`Added specialist ${form.name}.`, 'success')
  }
  showModal.value = false
}

const setDuty = (member, status) => {
  updateStaffStatus(member.id, status)
  toastStore.showToast(`${member.name} is now ${status}.`, 'info')
}

const getActionItems = (member) => [
  { label: 'Edit Profile', icon: Edit, command: () => openEditModal(member) },
  { label: 'Set On Duty', icon: CheckCircle2, command: () => setDuty(member, 'On Duty') },
  { label: 'Set On Break', icon: Coffee, command: () => setDuty(member, 'Break') },
  { label: 'Set Off Duty', icon: Moon, command: () => setDuty(member, 'Off Duty') },
  {
    label: 'Remove',
    icon: Trash2,
    textClass: 'text-danger',
    iconClass: 'text-danger',
    command: () => {
      deleteStaffMember(member.id)
      toastStore.showToast(`Removed ${member.name}.`, 'info')
    }
  }
]
</script>
