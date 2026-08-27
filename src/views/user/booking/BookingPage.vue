<template>
  <div class="tnak-booking-page">
    <div class="app-container">
      
      <!-- Main Layout: 4-Col Filters on Left, 8-Col Bookings on Right -->
      <div class="row g-3">
        
        <!-- ==================================================== -->
        <!-- LEFT COLUMN (col-12 col-md-4): Filters & Actions Card -->
        <!-- ==================================================== -->
        <div class="col-12 col-md-4 col-lg-4">
          <div class="card p-3 d-flex flex-column gap-3 tnak-filter-card">
            
            <!-- Header -->
            <div class="d-flex align-items-center justify-content-between">
              <h6 class="fw-semibold mb-0 d-flex align-items-center gap-2 text-dark" style="font-size: 0.95rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span>Filters &amp; Actions</span>
              </h6>
              <span class="badge-count-pill">{{ filteredBookings.length }} Items</span>
            </div>

            <div class="main-divider my-0"></div>

            <!-- Filter by Status (BaseSelect) -->
            <BaseSelect
              v-model="filterStatus"
              label="Status"
              placeholder="All Statuses"
              :options="[
                { label: 'All Statuses', value: '' },
                { label: 'Confirmed', value: 'CONFIRMED' },
                { label: 'Pending', value: 'PENDING' },
                { label: 'Cancelled', value: 'CANCELLED' }
              ]"
            />

            <!-- Filter by Date (BaseDatePicker) -->
            <BaseDatePicker
              v-model="filterDate"
              label="Date"
              placeholder="Select date..."
              clearable
            />

            <div class="main-divider my-0"></div>

            <!-- View Mode Toggler -->
            <div>
              <label class="form-label mb-1.5 small fw-semibold text-dark" style="font-size: 0.8rem;">View Mode</label>
              <div class="view-mode-toggle-group d-flex p-0.5 rounded-2">
                <button 
                  type="button"
                  class="view-toggle-btn flex-fill d-flex align-items-center justify-content-center gap-1.5 py-1 px-2 rounded-1"
                  :class="{ 'active': viewMode === 'detailed' }"
                  @click="viewMode = 'detailed'"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <span class="fw-semibold" style="font-size: 0.76rem;">Detailed</span>
                </button>

                <button 
                  type="button"
                  class="view-toggle-btn flex-fill d-flex align-items-center justify-content-center gap-1.5 py-1 px-2 rounded-1"
                  :class="{ 'active': viewMode === 'minimalist' }"
                  @click="viewMode = 'minimalist'"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  <span class="fw-semibold" style="font-size: 0.76rem;">Minimalist</span>
                </button>
              </div>
            </div>

            <div class="main-divider my-0"></div>

            <!-- Action Button -->
            <div>
              <button 
                class="btn-tnak-primary w-100 d-flex align-items-center justify-content-center gap-2"
                @click="openBookingModal()"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                <span>Book a Service</span>
              </button>

              <router-link 
                to="/services" 
                class="btn-tnak-outline w-100 d-flex align-items-center justify-content-center gap-2 mt-2 text-decoration-none"
              >
                <span>Browse Service Catalog</span>
                <span>→</span>
              </router-link>
            </div>

          </div>
        </div>

        <!-- ==================================================== -->
        <!-- RIGHT COLUMN (col-12 col-md-8): Bookings Cards List  -->
        <!-- ==================================================== -->
        <div class="col-12 col-md-8 col-lg-8 d-flex flex-column">
          
          <!-- Empty State -->
          <div 
            v-if="!filteredBookings.length" 
            class="flex-grow-1 card d-flex flex-column align-items-center justify-content-center text-muted p-5 tnak-card text-center"
            style="min-height: 320px;"
          >
            <div class="empty-book-icon mb-3 opacity-40">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h5 class="fw-bold mb-1 text-dark">No bookings found</h5>
            <p class="mb-3 small text-muted">You don't have any matching appointment items.</p>
            <button class="btn-tnak-primary" @click="openBookingModal()">
              + Book a Service
            </button>
          </div>

          <!-- Cards Grid -->
          <div v-else class="row g-3">
            <div 
              v-for="booking in filteredBookings" 
              :key="booking.id"
              class="col-12"
              :class="{ 'col-md-6': viewMode === 'detailed' }"
            >
              
              <!-- 1. DETAILED CARD STYLE (Exact Tnak-Digital-Frontend Pattern) -->
              <div 
                v-if="viewMode === 'detailed'" 
                class="card p-3 h-100 d-flex flex-column justify-content-between tnak-card detailed-card-item"
              >
                <div>
                  <!-- Card Header: Status on Left, ID & Cancel Button on Right -->
                  <div class="card-header p-0 bg-transparent mb-3 border-0">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center gap-2">
                        <span 
                          class="tnak-status-badge"
                          :class="getStatusClass(booking.status || 'CONFIRMED')"
                        >
                          {{ formatStatus(booking.status || 'CONFIRMED') }}
                        </span>
                        <span class="text-muted small" style="font-size: 0.72rem;">ID: #{{ booking.id }}</span>
                      </div>

                      <button 
                        v-if="booking.status !== 'CANCELLED'"
                        class="btn-tnak-danger-sm d-flex align-items-center gap-1"
                        @click="triggerCancel(booking)"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <span>Cancel Booking</span>
                      </button>
                    </div>
                  </div>

                  <div class="main-divider mb-3"></div>

                  <!-- Card Body: 4 Shaded Rounded Data Blocks -->
                  <div class="card-body p-0 d-flex flex-column gap-2">
                    
                    <!-- Service Block -->
                    <div class="rounded p-2 d-flex flex-column justify-content-center tnak-block">
                      <div class="d-flex align-items-center gap-1 text-muted mb-1" style="font-size: 0.72rem;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="6" cy="6" r="3"></circle>
                          <circle cx="6" cy="18" r="3"></circle>
                          <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
                          <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
                          <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
                        </svg>
                        <span>Service &amp; Price</span>
                      </div>
                      <div class="fw-semibold text-truncate text-dark" style="font-size: 0.85rem;">
                        {{ booking.serviceTitle }}
                      </div>
                      <div class="text-muted text-truncate" style="font-size: 0.74rem;">
                        Estimated Total: <strong style="color: var(--primary-color, #EA7A38);">${{ booking.servicePrice }}</strong> · {{ booking.serviceDuration }}
                      </div>
                    </div>

                    <!-- Specialist Block -->
                    <div class="rounded p-2 d-flex flex-column justify-content-center tnak-block">
                      <div class="d-flex align-items-center gap-1 text-muted mb-1" style="font-size: 0.72rem;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Specialist Artist</span>
                      </div>
                      <div class="fw-semibold text-truncate text-dark" style="font-size: 0.85rem;">
                        {{ booking.specialistName }}
                      </div>
                      <div class="text-muted text-truncate" style="font-size: 0.74rem;">
                        {{ booking.specialistRole }}
                      </div>
                    </div>

                    <!-- Scheduled Date & Time Block -->
                    <div class="rounded p-2 d-flex flex-column justify-content-center tnak-block">
                      <div class="d-flex align-items-center gap-1 text-muted mb-1" style="font-size: 0.72rem;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Scheduled Time</span>
                      </div>
                      <div class="fw-semibold text-truncate text-dark" style="font-size: 0.85rem;">
                        {{ formatDisplayDate(booking.date) }}
                      </div>
                      <div class="text-muted text-truncate" style="font-size: 0.74rem;">
                        ⏰ {{ booking.time }} · Session ({{ booking.serviceDuration }})
                      </div>
                    </div>

                    <!-- Client / Group Block -->
                    <div v-if="booking.customerName" class="rounded p-2 d-flex flex-column justify-content-center tnak-block">
                      <div class="d-flex align-items-center gap-1 text-muted mb-1" style="font-size: 0.72rem;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span>Client Contact</span>
                      </div>
                      <div class="fw-semibold text-truncate text-dark" style="font-size: 0.85rem;">
                        {{ booking.customerName }}
                      </div>
                      <div class="text-muted text-truncate" style="font-size: 0.74rem;">
                        {{ booking.customerPhone }} · {{ booking.customerEmail }}
                      </div>
                    </div>

                  </div>
                </div>

                <!-- Footer Calendar Action -->
                <div class="d-flex align-items-center justify-content-between pt-2 mt-3 border-top">
                  <button 
                    type="button" 
                    class="btn-tnak-link-cal d-flex align-items-center gap-1 small p-0 border-0 bg-transparent"
                    @click="downloadCalendarInvite(booking)"
                  >
                    <span>📅</span>
                    <span>Download .ics Calendar</span>
                  </button>
                  <span class="text-muted" style="font-size: 0.72rem;">Pay at Salon</span>
                </div>

              </div>

              <!-- 2. MINIMALIST CARD STYLE (Exact Tnak-Digital-Frontend Pattern) -->
              <div 
                v-else 
                class="card p-3 h-100 d-flex flex-column justify-content-between tnak-card"
                style="min-height: 180px;"
              >
                <div>
                  <div class="d-flex align-items-center justify-content-between mb-1.5">
                    <span class="fw-bold text-dark" style="font-size: 0.95rem;">
                      {{ booking.serviceTitle }}
                    </span>
                    <div class="d-flex align-items-center gap-2">
                      <span class="text-muted small" style="font-size: 0.72rem;">#{{ booking.id }}</span>
                      <span class="tnak-status-badge" :class="getStatusClass(booking.status || 'CONFIRMED')">
                        {{ formatStatus(booking.status || 'CONFIRMED') }}
                      </span>
                    </div>
                  </div>

                  <div class="text-muted small mb-2 opacity-75" style="font-size: 0.74rem;">
                    Specialist: <strong>{{ booking.specialistName }}</strong> (${{ booking.servicePrice }})
                  </div>

                  <div class="fw-semibold text-truncate text-sm mb-1 text-dark" style="font-size: 0.84rem;">
                    Client: {{ booking.customerName }}
                  </div>
                </div>

                <div>
                  <div class="main-divider my-2"></div>
                  <div class="d-flex align-items-center justify-content-between mt-1 small text-muted" style="font-size: 0.74rem;">
                    <div class="d-flex align-items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="opacity-75">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                      </svg>
                      <span>{{ formatDisplayDate(booking.date) }} · {{ booking.time }}</span>
                    </div>

                    <button 
                      v-if="booking.status !== 'CANCELLED'"
                      class="btn-tnak-danger-sm"
                      @click="triggerCancel(booking)"
                      style="height: 26px !important; padding-inline: 10px; font-size: 0.72rem;"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- ========================================================= -->
    <!-- BOOKING REQUEST MODAL (Using BaseModal, BaseInput, BaseDatePicker, BaseSelect) -->
    <!-- ========================================================= -->
    <BaseModal 
      v-model="showBookingModal" 
      title="Book Salon Service" 
      size="md"
    >
      <form @submit.prevent="submitBookingModalForm">
        
        <!-- Row 1: Service & Specialist (BaseSelect) -->
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <BaseSelect
              v-model="modalForm.serviceId"
              label="Service Treatment"
              required
              :options="allServices.map(s => ({ label: `${s.title} ($${s.price})`, value: s.id }))"
            />
          </div>
          <div class="col-md-6">
            <BaseSelect
              v-model="modalForm.specialistId"
              label="Specialist Stylist"
              required
              :options="specialists.map(spec => ({ label: `${spec.name} (${spec.role})`, value: spec.id }))"
            />
          </div>
        </div>

        <!-- Row 2: Client & Session (BaseInput & BaseSelect) -->
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <BaseInput
              v-model="modalForm.customerName"
              label="Client Full Name"
              placeholder="Enter client name"
              required
            />
          </div>
          <div class="col-md-6">
            <BaseSelect
              v-model="modalForm.session"
              label="Session"
              required
              :options="[
                { label: 'Morning', value: 'MORNING' },
                { label: 'Afternoon', value: 'AFTERNOON' },
                { label: 'Evening', value: 'EVENING' }
              ]"
            />
          </div>
        </div>

        <!-- Row 3: Booking Date (BaseDatePicker) -->
        <div class="mb-3">
          <BaseDatePicker
            v-model="modalForm.date"
            label="Booking Date"
            required
            placeholder="Select appointment date..."
          />
        </div>

        <!-- Row 4: Start Time & Phone (BaseSelect & BaseInput) -->
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <BaseSelect
              v-model="modalForm.time"
              label="Preferred Time"
              required
              :options="activeModalTimeSlots.map(slot => ({ label: slot, value: slot }))"
            />
          </div>
          <div class="col-md-6">
            <BaseInput
              v-model="modalForm.customerPhone"
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        <!-- Row 5: Note (BaseInput textarea) -->
        <div class="mb-4">
          <BaseInput
            type="textarea"
            :rows="3"
            v-model="modalForm.note"
            label="Note"
            placeholder="Enter any additional details (optional)"
          />
        </div>

        <!-- Modal Action Buttons -->
        <div class="d-flex justify-content-end gap-2 pt-3 border-top">
          <button 
            type="button" 
            class="btn-tnak-outline px-4 py-2"
            @click="showBookingModal = false"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn-tnak-primary px-4 py-2"
          >
            Submit Booking Request
          </button>
        </div>

      </form>
    </BaseModal>

    <!-- ========================================================= -->
    <!-- CANCEL CONFIRMATION MODAL (Using BaseModal from tnak)     -->
    <!-- ========================================================= -->
    <BaseModal 
      v-model="showCancelModal" 
      title="Confirm Cancellation" 
      size="sm"
    >
      <div class="text-center p-2">
        <div class="text-danger mb-3">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <p class="mb-4 text-muted small" style="line-height: 1.5;">
          Are you sure you want to cancel this booking request (#{{ bookingToCancel?.id }})? This action cannot be undone.
        </p>
        <div class="d-flex gap-2 justify-content-center w-100">
          <button 
            class="btn-tnak-danger flex-grow-1"
            @click="confirmCancelBooking"
          >
            Yes, Cancel
          </button>
          <button 
            class="btn-tnak-outline flex-grow-1"
            @click="showCancelModal = false"
          >
            No, Keep it !
          </button>
        </div>
      </div>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '../../../components/base/BaseModal.vue'
import BaseInput from '../../../components/base/BaseInput.vue'
import BaseDatePicker from '../../../components/base/BaseDatePicker.vue'
import BaseSelect from '../../../components/base/BaseSelect.vue'
import { useBooking } from '../../../composables/useBooking'
import { useServices } from '../../../composables/useServices'

const route = useRoute()

const { 
  bookings, 
  specialists, 
  timeSlots, 
  createBooking, 
  cancelBooking 
} = useBooking()

const { allServices } = useServices()

// View Mode: 'detailed' | 'minimalist'
const viewMode = ref(localStorage.getItem('my-bookings-view-mode') || 'detailed')

// Filters
const filterStatus = ref('')
const filterDate = ref('')

// Modals
const showBookingModal = ref(false)
const showCancelModal = ref(false)
const bookingToCancel = ref(null)

// Modal Form State (Matching RoomBookingRequestForm)
const modalForm = reactive({
  serviceId: null,
  specialistId: null,
  date: new Date().toISOString().split('T')[0],
  session: 'MORNING',
  time: '10:00 AM',
  customerName: 'Guest Client',
  customerPhone: '+1 (555) 019-2834',
  customerEmail: 'guest@example.com',
  note: ''
})

const filteredBookings = computed(() => {
  let list = bookings.value

  if (filterStatus.value) {
    list = list.filter(b => (b.status || 'CONFIRMED') === filterStatus.value)
  }

  if (filterDate.value) {
    list = list.filter(b => b.date === filterDate.value)
  }

  return list
})

const activeModalTimeSlots = computed(() => {
  if (modalForm.session === 'MORNING') return timeSlots.morning || []
  if (modalForm.session === 'AFTERNOON') return timeSlots.afternoon || []
  if (modalForm.session === 'EVENING') return timeSlots.evening || []
  return timeSlots.morning || []
})

const openBookingModal = (service = null) => {
  const chosenService = service || allServices.value[0]
  if (chosenService) {
    modalForm.serviceId = chosenService.id
  }
  if (specialists.value.length > 0) {
    modalForm.specialistId = specialists.value[0].id
  }
  if (activeModalTimeSlots.value.length > 0) {
    modalForm.time = activeModalTimeSlots.value[0]
  }
  showBookingModal.value = true
}

const submitBookingModalForm = () => {
  const s = allServices.value.find(item => item.id === Number(modalForm.serviceId)) || allServices.value[0]
  const spec = specialists.value.find(item => item.id === Number(modalForm.specialistId)) || specialists.value[0]

  createBooking({
    serviceId: s.id,
    serviceTitle: s.title,
    servicePrice: s.price,
    serviceDuration: s.duration,
    specialistName: spec.name,
    specialistRole: spec.role,
    specialistAvatar: spec.avatar,
    date: modalForm.date,
    time: modalForm.time,
    customerName: modalForm.customerName,
    customerPhone: modalForm.customerPhone,
    customerEmail: modalForm.customerEmail,
    notes: modalForm.note
  })

  showBookingModal.value = false
}

const triggerCancel = (booking) => {
  bookingToCancel.value = booking
  showCancelModal.value = true
}

const confirmCancelBooking = () => {
  if (bookingToCancel.value) {
    cancelBooking(bookingToCancel.value.id)
    showCancelModal.value = false
    bookingToCancel.value = null
  }
}

const formatStatus = (status) => {
  const map = {
    CONFIRMED: 'Confirmed',
    SCHEDULED: 'Scheduled',
    PENDING: 'Pending',
    CANCELLED: 'Cancelled',
    REJECTED: 'Rejected'
  }
  return map[status] || status
}

const getStatusClass = (status) => {
  if (status === 'CONFIRMED' || status === 'SCHEDULED') return 'status-badge-success'
  if (status === 'PENDING') return 'status-badge-warning'
  if (status === 'CANCELLED' || status === 'REJECTED') return 'status-badge-danger'
  return 'status-badge-success'
}

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const parts = dateStr.split('-')
    const d = new Date(parts[0], parts[1] - 1, parts[2])
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const downloadCalendarInvite = (booking) => {
  const title = `Salon Appointment: ${booking.serviceTitle} with ${booking.specialistName}`
  const description = `Your salon booking #${booking.id} is confirmed. Specialist: ${booking.specialistName}. Duration: ${booking.serviceDuration}.`
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Petsmart Salon//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', `appointment-${booking.id}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  window.scrollTo(0, 0)
  
  if (route.query.service) {
    const sId = parseInt(route.query.service)
    const match = allServices.value.find(s => s.id === sId)
    if (match) {
      openBookingModal(match)
    }
  }
})
</script>

<style scoped>
/* ======================================================== */
/* TNAK-DIGITAL-FRONTEND EXACT REPLICA STYLING             */
/* ======================================================== */
:root {
  --primary-color: #EA7A38;
  --surface-ground: #f1f5f9;
  --border-clr: rgba(15, 23, 42, 0.08);
}

.tnak-booking-page {
  background-color: #FAF8F5;
  min-height: 100vh;
  padding-top: 72px !important;
  padding-bottom: 60px;
}

/* Card Styling from Tnak */
.tnak-card {
  background-color: #ffffff;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.08) !important;
  box-shadow: none;
}

.tnak-filter-card {
  background-color: #ffffff;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.08) !important;
  position: sticky;
  top: 76px;
}

.main-divider {
  height: 1px;
  background-color: rgba(15, 23, 42, 0.08);
  width: 100%;
}

.badge-count-pill {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--primary-color, #EA7A38);
  background-color: var(--primary-color-soft, rgba(234, 122, 56, 0.12));
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
}

/* Controls */
.tnak-control {
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  font-size: 0.88rem;
  background-color: #ffffff;
  color: #0f172a;
}

.tnak-control:focus {
  border-color: var(--primary-color, #EA7A38);
  box-shadow: 0 0 0 3px rgba(234, 122, 56, 0.15);
}

/* View Mode Toggle (Compact mini size) */
.view-mode-toggle-group {
  background-color: #f1f5f9;
  border: 1px solid rgba(15, 23, 42, 0.06);
  height: 32px;
}

.view-toggle-btn {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 0.76rem;
  line-height: 1;
  transition: all 0.16s ease;
  cursor: pointer;
}

.view-toggle-btn.active {
  background-color: #ffffff;
  color: var(--primary-color, #EA7A38);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* Buttons from Tnak */
.btn-tnak-primary {
  background-color: var(--primary-color, #EA7A38);
  color: #ffffff;
  border: 1px solid var(--primary-color, #EA7A38);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-tnak-primary:hover {
  background-color: var(--primary-color-dark, #D96928);
  color: #ffffff;
}

.btn-tnak-outline {
  background-color: #ffffff;
  color: #334155;
  border: 1px solid rgba(15, 23, 42, 0.15);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-tnak-outline:hover {
  background-color: #f8fafc;
  border-color: #94a3b8;
  color: #0f172a;
}

.btn-tnak-danger {
  background-color: #ef4444;
  color: #ffffff;
  border: 1px solid #ef4444;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.btn-tnak-danger:hover {
  background-color: #dc2626;
  color: #ffffff;
}

.btn-tnak-danger-sm {
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 0.28rem 0.65rem;
  font-size: 0.76rem;
  font-weight: 600;
  transition: background-color 0.15s ease;
}

.btn-tnak-danger-sm:hover {
  background-color: #dc2626;
}

/* Status Badges */
.tnak-status-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  letter-spacing: 0.02em;
}

.status-badge-success {
  background-color: rgba(13, 148, 103, 0.12);
  color: #0d9467;
  border: 1px solid rgba(13, 148, 103, 0.25);
}

.status-badge-warning {
  background-color: rgba(245, 158, 11, 0.12);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.status-badge-danger {
  background-color: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

/* Data Blocks in Detailed Card */
.tnak-block {
  background-color: #f1f5f9;
}

.btn-tnak-link-cal {
  color: var(--primary-color, #EA7A38);
  font-weight: 600;
}

.btn-tnak-link-cal:hover {
  text-decoration: underline;
}

/* Date Display Card in Modal Form (Tnak RoomBookingRequestForm) */
.date-display-card {
  background: #f1f5f9;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 10px;
  padding: 12px 16px;
  min-height: 52px;
}

.date-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--primary-color-soft, rgba(234, 122, 56, 0.12));
  color: var(--primary-color, #EA7A38);
  flex-shrink: 0;
}

.date-display-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.date-display-item {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 6px;
  padding: 4px 10px;
  letter-spacing: 0.01em;
}

/* Modal Overlay */
.tnak-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  z-index: 1060;
}

.tnak-modal-box {
  max-width: 580px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 12px;
}
</style>
