<template>
  <div class="card border-0 rounded-4 bg-white shadow-sm hover-elevate overflow-hidden position-relative">
    <div class="d-flex w-100 h-100">
      <!-- Status Color Bar -->
      <div 
        class="status-bar flex-shrink-0" 
        :class="[
          booking.status === 'Confirmed' ? 'bg-success' : 
          booking.status === 'In Progress' ? 'bg-warning' : 
          booking.status === 'Done' ? 'bg-primary' : 
          booking.status === 'Cancelled' ? 'bg-danger' : 'bg-secondary'
        ]"
        style="width: 4px;"
      ></div>
      
      <div class="card-body p-3 flex-grow-1 d-flex flex-column gap-3">
        <!-- Top row: Time & Status -->
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <div class="fw-bold text-dark fs-5 lh-1">{{ booking.time }}</div>
            <div class="small text-muted mt-1">{{ booking.date }}</div>
          </div>
          <BaseBadge :status="booking.status" />
        </div>

        <!-- Customer & Pet -->
        <div class="d-flex align-items-center gap-3 bg-light rounded-3 p-2">
          <div class="pet-icon-circle rounded-circle d-flex align-items-center justify-content-center bg-white text-orange fw-bold flex-shrink-0 shadow-sm" style="width: 40px; height: 40px; font-size: 1.1rem;">
            🐾
          </div>
          <div class="min-w-0">
            <div class="fw-bold text-dark fs-6 text-truncate">{{ booking.customerName }}</div>
            <div class="text-muted small text-truncate">
              {{ booking.petName ? `${booking.petName} (${booking.petBreed || 'Pet'})` : booking.customerPhone }}
            </div>
          </div>
        </div>

        <!-- Service & Specialist -->
        <div>
          <div class="fw-semibold text-dark small text-truncate mb-1">{{ booking.serviceTitle }}</div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-muted small">
              ${{ booking.servicePrice }} • {{ booking.serviceDuration || '45m' }}
            </div>
            <div class="d-flex align-items-center gap-1.5">
              <img :src="booking.specialistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80'" class="rounded-circle object-fit-cover border" style="width: 20px; height: 20px;">
              <span class="small fw-semibold text-dark" style="font-size: 0.75rem;">{{ specialistFirstName }}</span>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="d-flex align-items-center justify-content-between mt-auto pt-2 border-top">
          <button type="button" class="btn btn-link btn-sm text-decoration-none p-0 text-muted d-flex align-items-center gap-1 hover-orange" @click="$emit('edit', booking)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit
          </button>
          <div class="dropdown">
            <button class="btn btn-link btn-sm text-decoration-none p-0 text-muted d-flex align-items-center gap-1 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Status
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm border rounded-3 p-1">
              <li><a class="dropdown-item small rounded-2 py-1" href="#" @click.prevent="$emit('update-status', booking.id, 'Confirmed')">🟢 Confirmed</a></li>
              <li><a class="dropdown-item small rounded-2 py-1" href="#" @click.prevent="$emit('update-status', booking.id, 'In Progress')">🟡 In Progress</a></li>
              <li><a class="dropdown-item small rounded-2 py-1" href="#" @click.prevent="$emit('update-status', booking.id, 'Done')">🔵 Done</a></li>
              <li><hr class="dropdown-divider my-1"></li>
              <li><a class="dropdown-item small text-danger rounded-2 py-1" href="#" @click.prevent="$emit('update-status', booking.id, 'Cancelled')">🔴 Cancelled</a></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseBadge from '../base/BaseBadge.vue'

const props = defineProps({
  booking: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'update-status'])

const specialistFirstName = computed(() => {
  if (!props.booking.specialistName) return 'Elena'
  return props.booking.specialistName.split(' ')[0]
})
</script>

<style scoped>
.hover-elevate {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-elevate:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.06) !important;
}
.hover-orange:hover {
  color: #EA7A38 !important;
}
.min-w-0 {
  min-width: 0;
}
[data-theme="dark"] .card {
  background-color: var(--card-bg-color, #1e293b);
  border-color: rgba(255, 255, 255, 0.08) !important;
}
[data-theme="dark"] .bg-light {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
