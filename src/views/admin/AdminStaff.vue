<template>
  <div class="admin-staff-page">
    
    <!-- Top Header & Actions -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
      <div>
        <h3 class="fw-bold text-dark mb-1" style="font-size: 1.35rem; letter-spacing: -0.01em;">Staff &amp; Specialists</h3>
        <p class="text-muted small mb-0">Certified pet groomers, veterinarians, spa specialists, and duty schedules.</p>
      </div>

      <button 
        type="button" 
        class="btn btn-sm btn-session-gradient text-white rounded-pill px-3.5 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-xs border-0"
        @click="isModalOpen = true"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add Specialist</span>
      </button>
    </div>

    <!-- Staff Cards Grid (Matching Reference Aesthetics) -->
    <div class="row g-3 mb-4">
      <div 
        v-for="member in staffList" 
        :key="member.id"
        class="col-12 col-md-6 col-xl-3"
      >
        <div class="staff-card bg-white rounded-3 p-3.5 border shadow-xs d-flex flex-column justify-content-between h-100">
          <div>
            <!-- Top Row: Status badge & Rating -->
            <div class="d-flex align-items-center justify-content-between mb-3">
              <button 
                type="button"
                class="btn btn-sm rounded-pill px-2.5 py-0.5 fw-semibold border-0"
                :class="member.status === 'On Duty' ? 'badge-checked-in' : (member.status === 'Break' ? 'badge-in-break' : 'badge-off-duty')"
                @click="toggleDutyStatus(member)"
                title="Click to toggle status"
                style="font-size: 0.72rem;"
              >
                ● {{ member.status }}
              </button>

              <span class="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-2 py-0.5 small fw-bold">
                ★ {{ member.rating }} ({{ member.reviewsCount }})
              </span>
            </div>

            <!-- Avatar & Info -->
            <div class="text-center mb-3">
              <img 
                :src="member.avatar" 
                :alt="member.name"
                class="rounded-circle object-fit-cover border shadow-xs mb-2"
                style="width: 68px; height: 68px;"
              />
              <h5 class="fw-bold text-dark mb-0 fs-6">{{ member.name }}</h5>
              <span class="text-muted small d-block" style="font-size: 0.74rem;">{{ member.role }}</span>
            </div>

            <!-- Specialties Tags -->
            <div class="d-flex flex-wrap gap-1 justify-content-center mb-3">
              <span 
                v-for="spec in (member.specialties || ['General Grooming'])" 
                :key="spec"
                class="badge bg-light text-muted border rounded-pill px-2 py-0.5"
                style="font-size: 0.68rem;"
              >
                {{ spec }}
              </span>
            </div>
          </div>

          <!-- Bottom Workload & Phone -->
          <div class="pt-3 border-top d-flex align-items-center justify-content-between">
            <span class="text-muted small" style="font-size: 0.74rem;">
              <strong class="text-dark">{{ member.activeAppointments }}</strong> active tasks
            </span>
            <span class="text-muted small fw-medium" style="font-size: 0.72rem;">
              {{ member.phone || '+4 079...' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Specialist BaseModal -->
    <BaseModal 
      v-model="isModalOpen" 
      title="Add Certified Specialist"
      size="md"
    >
      <form @submit.prevent="saveStaffForm" class="row g-3">
        <div class="col-12">
          <BaseInput 
            v-model="form.name" 
            label="Specialist Full Name" 
            placeholder="e.g. Elena Rostova"
            :required="true"
          />
        </div>

        <div class="col-12">
          <BaseInput 
            v-model="form.role" 
            label="Specialty / Professional Title" 
            placeholder="e.g. Master Dog Groomer & Breed Stylist"
            :required="true"
          />
        </div>

        <div class="col-12 col-md-6">
          <BaseInput 
            v-model="form.phone" 
            label="Phone Number" 
            placeholder="+4 079 100 20 05"
            :required="true"
          />
        </div>

        <div class="col-12 col-md-6">
          <BaseSelect 
            v-model="form.status" 
            label="Schedule Status" 
            :options="['On Duty', 'Break', 'Off Duty']"
          />
        </div>

        <div class="col-12">
          <BaseInput 
            v-model="form.avatar" 
            label="Avatar Photo URL" 
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div class="col-12">
          <BaseInput 
            v-model="form.specialtiesStr" 
            label="Specialties (Comma-separated)" 
            placeholder="e.g. Breed Styling, Show Cuts, Hydrotherapy"
          />
        </div>
      </form>

      <template #footer>
        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" @click="isModalOpen = false">
          Cancel
        </button>
        <button type="button" class="btn btn-session-gradient text-white rounded-pill px-4 fw-semibold border-0" @click="saveStaffForm">
          Add Specialist
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseModal from '../../components/base/BaseModal.vue'
import { useAdmin } from '../../composables/useAdmin'

const { staffList, updateStaffStatus, addStaffMember } = useAdmin()

const isModalOpen = ref(false)

const form = reactive({
  name: '',
  role: 'Pet Grooming Specialist',
  phone: '',
  status: 'On Duty',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  specialtiesStr: 'Breed Styling, Gentle Wash'
})

const toggleDutyStatus = (member) => {
  const next = member.status === 'On Duty' ? 'Break' : (member.status === 'Break' ? 'Off Duty' : 'On Duty')
  updateStaffStatus(member.id, next)
}

const saveStaffForm = () => {
  if (!form.name || !form.role) return

  const specs = form.specialtiesStr ? form.specialtiesStr.split(',').map(s => s.trim()).filter(Boolean) : []

  addStaffMember({
    name: form.name,
    role: form.role,
    phone: form.phone || '+4 079 100 20 99',
    email: `${form.name.toLowerCase().replace(/\s+/g, '.')}@tikisalon.com`,
    status: form.status,
    avatar: form.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    specialties: specs
  })

  isModalOpen.value = false
}
</script>

<style scoped>
.staff-card {
  border-color: #e5eaf0 !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.staff-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.08);
}

.btn-session-gradient {
  background: linear-gradient(135deg, #375368 0%, #203848 100%);
  transition: all 0.2s ease;
}

.btn-session-gradient:hover {
  background: linear-gradient(135deg, #2b4355 0%, #152733 100%);
  transform: translateY(-1px);
}

/* Status Badges */
.badge-checked-in {
  background-color: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.badge-in-break {
  background-color: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
}

.badge-off-duty {
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

[data-theme="dark"] .staff-card,
[data-theme="dark"] .card {
  background-color: #1a2c38 !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

[data-theme="dark"] .bg-light {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
