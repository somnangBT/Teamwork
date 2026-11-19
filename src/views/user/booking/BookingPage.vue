<template>
  <div class="tnak-booking-page">
    <div class="app-container">
      <div class="row g-3">
        <!-- LEFT COLUMN: Filters & Actions -->
        <div class="col-12 col-md-4 col-lg-4">
          <div class="card p-3 d-flex flex-column gap-3 tnak-filter-card">
            <div class="d-flex align-items-center justify-content-between">
              <h1 class="fw-semibold mb-0 d-flex align-items-center gap-2 heading-text" style="font-size: 0.98rem;">
                <Filter :size="16" />
                <span>{{ t('booking.filtersTitle') }}</span>
              </h1>
              <span class="badge-count-pill">{{ filteredBookings.length }} {{ t('booking.items') }}</span>
            </div>

            <div class="main-divider my-0"></div>

            <BaseSelect
              v-model="filterStatus"
              :label="t('booking.status')"
              placeholder="All Statuses"
              :options="[
                { label: 'All Statuses', value: '' },
                { label: 'Confirmed', value: 'Confirmed' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Done', value: 'Done' },
                { label: 'Cancelled', value: 'Cancelled' }
              ]"
            />

            <BaseDatePicker
              v-model="filterDate"
              :label="t('booking.date')"
              placeholder="Select date..."
            />

            <div v-if="filterStatus || filterDate" class="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-link btn-sm text-decoration-none p-0 text-primary fw-semibold"
                @click="filterStatus = ''; filterDate = ''"
              >
                Clear filters
              </button>
            </div>

            <div class="main-divider my-0"></div>

            <!-- View Mode Toggler -->
            <div>
              <label class="form-label mb-1 small fw-semibold heading-text" style="font-size: 0.8rem;">
                {{ t('booking.viewMode') }}
              </label>
              <div class="view-mode-toggle-group d-flex p-1 rounded-2">
                <button
                  type="button"
                  class="view-toggle-btn flex-fill d-flex align-items-center justify-content-center gap-1 py-1 px-2 rounded-1"
                  :class="{ active: viewMode === 'detailed' }"
                  @click="setViewMode('detailed')"
                >
                  <LayoutGrid :size="13" />
                  <span class="fw-semibold" style="font-size: 0.76rem;">{{ t('booking.detailed') }}</span>
                </button>

                <button
                  type="button"
                  class="view-toggle-btn flex-fill d-flex align-items-center justify-content-center gap-1 py-1 px-2 rounded-1"
                  :class="{ active: viewMode === 'minimalist' }"
                  @click="setViewMode('minimalist')"
                >
                  <List :size="13" />
                  <span class="fw-semibold" style="font-size: 0.76rem;">{{ t('booking.minimalist') }}</span>
                </button>
              </div>
            </div>

            <div class="main-divider my-0"></div>

            <!-- Action Buttons -->
            <div>
              <button
                type="button"
                class="btn-tnak-primary w-100 d-flex align-items-center justify-content-center gap-2"
                @click="openBookingModal()"
              >
                <CalendarPlus :size="16" />
                <span>{{ t('booking.bookServiceBtn') }}</span>
              </button>

              <router-link
                to="/services"
                class="btn-tnak-outline w-100 d-flex align-items-center justify-content-center gap-2 mt-2 text-decoration-none"
              >
                <span>{{ t('booking.browseCatalogBtn') }}</span>
                <span>→</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Bookings Cards List -->
        <div class="col-12 col-md-8 col-lg-8 d-flex flex-column">
          <!-- Empty State -->
          <div
            v-if="!filteredBookings.length"
            class="flex-grow-1 card d-flex flex-column align-items-center justify-content-center text-muted p-5 tnak-card text-center"
            style="min-height: 320px;"
          >
            <CalendarX :size="52" class="mb-3 opacity-50" />
            <h5 class="fw-bold mb-1 heading-text">{{ t('booking.noBookingsTitle') }}</h5>
            <p class="mb-3 small text-muted">{{ t('booking.noBookingsDesc') }}</p>
            <button type="button" class="btn-tnak-primary" @click="openBookingModal()">
              + {{ t('booking.bookServiceBtn') }}
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
              <!-- 1. DETAILED CARD -->
              <div
                v-if="viewMode === 'detailed'"
                class="card p-3 h-100 d-flex flex-column justify-content-between tnak-card detailed-card-item"
              >
                <div>
                  <div class="card-header p-0 bg-transparent mb-3 border-0">
                    <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                      <div class="d-flex align-items-center gap-2">
                        <BaseBadge :status="booking.status || 'Confirmed'" size="sm" />
                        <span class="text-muted small" style="font-size: 0.72rem;">#{{ booking.id }}</span>
                      </div>

                      <div v-if="canModifyBooking(booking.status)" class="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          class="btn-tnak-secondary-sm d-flex align-items-center gap-1"
                          @click="openRescheduleModal(booking)"
                        >
                          <Clock :size="12" />
                          <span>{{ t('booking.reschedule') }}</span>
                        </button>
                        <button
                          type="button"
                          class="btn-tnak-danger-sm d-flex align-items-center gap-1"
                          @click="triggerCancel(booking)"
                        >
                          <XCircle :size="12" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="main-divider mb-3"></div>

                  <div class="card-body p-0 d-flex flex-column gap-2">
                    <!-- Service Block -->
                    <div class="rounded p-2 tnak-block">
                      <div class="d-flex align-items-center gap-1 text-muted mb-1" style="font-size: 0.72rem;">
                        <Scissors :size="12" />
                        <span>Service &amp; Price</span>
                      </div>
                      <div class="fw-semibold text-truncate heading-text" style="font-size: 0.85rem;">
                        {{ booking.serviceTitle }}
                      </div>
                      <div class="text-muted text-truncate" style="font-size: 0.74rem;">
                        Estimated Total: <strong class="text-primary">${{ booking.servicePrice }}</strong> · {{ booking.serviceDuration }}
                      </div>
                    </div>

                    <!-- Specialist Block -->
                    <div class="rounded p-2 tnak-block">
                      <div class="d-flex align-items-center gap-1 text-muted mb-1" style="font-size: 0.72rem;">
                        <UserCheck :size="12" />
                        <span>Specialist Artist</span>
                      </div>
                      <div class="fw-semibold text-truncate heading-text" style="font-size: 0.85rem;">
                        {{ booking.specialistName }}
                      </div>
                      <div class="text-muted text-truncate" style="font-size: 0.74rem;">
                        {{ booking.specialistRole }}
                      </div>
                    </div>

                    <!-- Scheduled Date & Time -->
                    <div class="rounded p-2 tnak-block">
                      <div class="d-flex align-items-center gap-1 text-muted mb-1" style="font-size: 0.72rem;">
                        <Calendar :size="12" />
                        <span>Scheduled Time</span>
                      </div>
                      <div class="fw-semibold text-truncate heading-text" style="font-size: 0.85rem;">
                        {{ formatDisplayDate(booking.date) }}
                      </div>
                      <div class="text-muted text-truncate" style="font-size: 0.74rem;">
                        ⏰ {{ booking.time }} · Session ({{ booking.serviceDuration }})
                      </div>
                    </div>

                    <!-- Client & Beauty Focus Block -->
                    <div class="rounded p-2 tnak-block">
                      <div class="d-flex align-items-center gap-1 text-muted mb-1" style="font-size: 0.72rem;">
                        <Sparkles :size="12" />
                        <span>Style &amp; Client Contact</span>
                      </div>
                      <div class="fw-semibold text-truncate heading-text" style="font-size: 0.85rem;">
                        {{ booking.petName ? `${booking.petName} (${booking.petBreed || 'Beauty Care'})` : booking.customerName }}
                      </div>
                      <div class="text-muted text-truncate" style="font-size: 0.74rem;">
                        {{ booking.customerName }} · {{ booking.customerPhone }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div class="d-flex align-items-center justify-content-between pt-2 mt-3 border-top">
                  <button
                    type="button"
                    class="btn-tnak-link-cal d-flex align-items-center gap-1 small p-0 border-0 bg-transparent"
                    @click="downloadCalendarInvite(booking)"
                  >
                    <Download :size="13" />
                    <span>{{ t('booking.downloadIcs') }}</span>
                  </button>
                  <span class="text-muted" style="font-size: 0.72rem;">{{ t('booking.payAtSalon') }}</span>
                </div>
              </div>

              <!-- 2. MINIMALIST CARD -->
              <div
                v-else
                class="card p-3 h-100 d-flex flex-column justify-content-between tnak-card"
                style="min-height: 180px;"
              >
                <div>
                  <div class="d-flex align-items-center justify-content-between mb-1">
                    <span class="fw-bold heading-text" style="font-size: 0.95rem;">
                      {{ booking.serviceTitle }}
                    </span>
                    <div class="d-flex align-items-center gap-2">
                      <span class="text-muted small" style="font-size: 0.72rem;">#{{ booking.id }}</span>
                      <BaseBadge :status="booking.status || 'Confirmed'" size="sm" />
                    </div>
                  </div>

                  <div class="text-muted small mb-2" style="font-size: 0.76rem;">
                    Specialist: <strong>{{ booking.specialistName }}</strong> (<span class="text-primary fw-semibold">${{ booking.servicePrice }}</span>)
                  </div>

                  <div class="fw-semibold text-truncate mb-1 heading-text" style="font-size: 0.84rem;">
                    {{ booking.petName ? `✨ ${booking.petName} — ` : '' }}{{ booking.customerName }}
                  </div>
                </div>

                <div>
                  <div class="main-divider my-2"></div>
                  <div class="d-flex align-items-center justify-content-between mt-1 small text-muted" style="font-size: 0.74rem;">
                    <div class="d-flex align-items-center gap-1">
                      <Calendar :size="12" class="opacity-75" />
                      <span>{{ formatDisplayDate(booking.date) }} · {{ booking.time }}</span>
                    </div>

                    <div v-if="canModifyBooking(booking.status)" class="d-flex align-items-center gap-1">
                      <button
                        type="button"
                        class="btn-tnak-secondary-sm"
                        @click="openRescheduleModal(booking)"
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        class="btn-tnak-danger-sm"
                        @click="triggerCancel(booking)"
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
    </div>

    <!-- BOOKING REQUEST MODAL -->
    <BaseModal v-model="showBookingModal" title="Book Salon Service" size="md">
      <form @submit.prevent="submitBookingModalForm">
        <!-- Service Summary Card (when booked from Services) or Selector -->
        <div class="mb-3">
          <div
            v-if="selectedModalService && !isChangingService"
            class="selected-service-pill rounded-3 p-2 px-3 d-flex align-items-center justify-content-between gap-3"
          >
            <div class="d-flex align-items-center gap-3 min-w-0">
              <img
                :src="selectedModalService.image"
                :alt="selectedModalService.title"
                class="selected-service-thumb rounded-2 object-fit-cover flex-shrink-0"
              />
              <div class="min-w-0">
                <div class="fw-bold small heading-text text-truncate">{{ selectedModalService.title }}</div>
                <div class="text-muted" style="font-size: 0.76rem;">
                  <strong class="text-primary">${{ selectedModalService.price }}</strong> · {{ selectedModalService.duration }}
                </div>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-link btn-sm text-decoration-none p-0 fw-semibold text-primary flex-shrink-0"
              @click="isChangingService = true"
            >
              Change
            </button>
          </div>

          <BaseSelect
            v-else
            v-model="modalForm.serviceId"
            label="Service Treatment"
            required
            :options="allServices.map(s => ({ label: `${s.title} ($${s.price})`, value: s.id }))"
          />
        </div>

        <!-- Specialist -->
        <div class="mb-3">
          <BaseSelect
            v-model="modalForm.specialistId"
            label="Specialist Stylist"
            required
            :options="specialists.map(spec => ({ label: spec.name, value: spec.id }))"
          />
        </div>

        <!-- Booking Date & Preferred Time -->
        <div class="row g-3 mb-3">
          <div class="col-12 col-sm-6">
            <BaseDatePicker
              v-model="modalForm.date"
              label="Booking Date"
              required
              placeholder="Select appointment date..."
            />
          </div>
          <div class="col-12 col-sm-6">
            <BaseSelect
              v-model="modalForm.time"
              label="Preferred Time"
              required
              :options="allTimeSlotsFlat.map(slot => ({ label: slot, value: slot }))"
            />
          </div>
        </div>

        <!-- Optional Notes -->
        <div class="mb-3">
          <BaseInput
            type="textarea"
            :rows="2"
            v-model="modalForm.note"
            label="Notes (Optional)"
            placeholder="Sensitivities or styling preferences..."
          />
        </div>

        <!-- Logged-in Account Auto-fill Chip -->
        <div class="booking-account-chip rounded-3 px-3 py-2 mb-4 d-flex align-items-center justify-content-between gap-2 small">
          <span class="d-flex align-items-center gap-2 min-w-0 text-muted">
            <UserCheck :size="14" class="text-primary flex-shrink-0" />
            <span class="text-truncate">
              Booking as <strong class="heading-text">{{ loggedInClient.name }}</strong>
              <span v-if="loggedInClient.phone"> · {{ loggedInClient.phone }}</span>
            </span>
          </span>
          <span class="text-muted flex-shrink-0" style="font-size: 0.72rem;">{{ t('booking.payAtSalon') }}</span>
        </div>

        <div class="d-flex justify-content-end gap-2 pt-3 border-top">
          <BaseButton type="button" variant="outline-secondary" @click="showBookingModal = false">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary">
            Confirm Booking
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- RESCHEDULE MODAL -->
    <BaseModal v-model="showRescheduleModal" title="Reschedule Appointment" size="sm">
      <form @submit.prevent="confirmReschedule">
        <p class="small text-muted mb-3">
          Select a new date and time for <strong>{{ bookingToReschedule?.serviceTitle }}</strong> (#{{ bookingToReschedule?.id }}).
        </p>
        <div class="mb-3">
          <BaseDatePicker v-model="rescheduleForm.date" label="New Date" required />
        </div>
        <div class="mb-4">
          <BaseSelect
            v-model="rescheduleForm.time"
            label="New Time Slot"
            required
            :options="allTimeSlotsFlat.map(slot => ({ label: slot, value: slot }))"
          />
        </div>
        <div class="d-flex gap-2">
          <BaseButton type="button" variant="outline-secondary" class="flex-grow-1" @click="showRescheduleModal = false">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary" class="flex-grow-1">
            Save Time
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- CANCEL CONFIRMATION MODAL -->
    <BaseModal v-model="showCancelModal" title="Confirm Cancellation" size="sm">
      <div class="text-center p-2">
        <div class="text-danger mb-3">
          <XCircle :size="48" class="mx-auto" />
        </div>
        <p class="mb-4 text-muted small" style="line-height: 1.5;">
          Are you sure you want to cancel booking <strong>#{{ bookingToCancel?.id }}</strong>? This action cannot be undone.
        </p>
        <div class="d-flex gap-2 justify-content-center w-100">
          <BaseButton variant="outline-secondary" class="flex-grow-1" @click="showCancelModal = false">
            Keep Booking
          </BaseButton>
          <BaseButton variant="danger" class="flex-grow-1" @click="confirmCancelBooking">
            Yes, Cancel
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Filter, LayoutGrid, List, CalendarPlus, CalendarX, Clock,
  XCircle, Scissors, UserCheck, Calendar, Sparkles, Download
} from '@lucide/vue'
import { useBooking } from '../../../composables/useBooking'
import { useServices } from '../../../composables/useServices'
import { useProfile } from '../../../composables/useProfile'
import { useI18n } from '../../../composables/useI18n'
import { useAuthStore } from '../../../stores/auth'
import { useToastStore } from '../../../stores/toast'

const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()
const { t } = useI18n()
const { account, pets } = useProfile()

const {
  bookings,
  specialists,
  timeSlots,
  createBooking,
  updateBookingDetails,
  cancelBooking
} = useBooking()

const { allServices } = useServices()

const viewMode = ref(localStorage.getItem('my-bookings-view-mode') || 'detailed')
const setViewMode = (mode) => {
  viewMode.value = mode
  try {
    localStorage.setItem('my-bookings-view-mode', mode)
  } catch {}
}

const filterStatus = ref('')
const filterDate = ref('')

const showBookingModal = ref(false)
const showCancelModal = ref(false)
const showRescheduleModal = ref(false)
const isChangingService = ref(false)
const bookingToCancel = ref(null)
const bookingToReschedule = ref(null)

const modalForm = reactive({
  serviceId: null,
  specialistId: null,
  date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  time: '09:00 AM',
  note: ''
})

const rescheduleForm = reactive({
  date: '',
  time: ''
})

const allTimeSlotsFlat = computed(() => [
  ...(timeSlots.morning || []),
  ...(timeSlots.afternoon || []),
  ...(timeSlots.evening || [])
])

const selectedModalService = computed(() => {
  return allServices.value.find(item => item.id === Number(modalForm.serviceId)) || null
})

const loggedInClient = computed(() => ({
  name: authStore.fullName || account.value.name || 'Guest Client',
  email: authStore.user?.email || account.value.email || 'guest@example.com',
  phone: authStore.user?.phone || account.value.phone || ''
}))

const filteredBookings = computed(() => {
  let list = [...bookings.value]

  if (filterStatus.value) {
    const target = filterStatus.value.toLowerCase()
    list = list.filter(b => (b.status || 'Confirmed').toLowerCase() === target)
  }

  if (filterDate.value) {
    list = list.filter(b => b.date === filterDate.value)
  }

  return list
})

const canModifyBooking = (status) => {
  const s = (status || 'Confirmed').toLowerCase()
  return s !== 'cancelled' && s !== 'done' && s !== 'rejected'
}

const openBookingModal = (service = null, specialistIdParam = null) => {
  const chosenService = service || allServices.value[0]
  if (chosenService) modalForm.serviceId = chosenService.id
  isChangingService.value = !service

  const matchedSpec = specialistIdParam
    ? specialists.value.find(s => String(s.id) === String(specialistIdParam))
    : specialists.value[0]
  modalForm.specialistId = matchedSpec ? matchedSpec.id : specialists.value[0]?.id

  if (allTimeSlotsFlat.value.length > 0 && !allTimeSlotsFlat.value.includes(modalForm.time)) {
    modalForm.time = allTimeSlotsFlat.value[0]
  }
  showBookingModal.value = true
}

const submitBookingModalForm = () => {
  const s = selectedModalService.value || allServices.value[0]
  const spec = specialists.value.find(item => String(item.id) === String(modalForm.specialistId)) || specialists.value[0]
  const primaryProfile = pets.value[0]

  const created = createBooking({
    serviceId: s.id,
    serviceTitle: s.title,
    servicePrice: s.price,
    serviceDuration: s.duration,
    specialistName: spec.name,
    specialistRole: spec.role,
    specialistAvatar: spec.avatar,
    date: modalForm.date,
    time: modalForm.time,
    petName: primaryProfile?.name || '',
    petBreed: primaryProfile?.breed || 'Beauty Care',
    customerName: loggedInClient.value.name,
    customerPhone: loggedInClient.value.phone,
    customerEmail: loggedInClient.value.email,
    notes: modalForm.note,
    status: 'Confirmed'
  })

  showBookingModal.value = false
  modalForm.note = ''
  toastStore.showToast(`Booking #${created.id} confirmed for ${created.date} at ${created.time}!`, 'success')
}

const openRescheduleModal = (booking) => {
  bookingToReschedule.value = booking
  rescheduleForm.date = booking.date
  rescheduleForm.time = booking.time
  showRescheduleModal.value = true
}

const confirmReschedule = () => {
  if (!bookingToReschedule.value) return
  updateBookingDetails(bookingToReschedule.value.id, {
    date: rescheduleForm.date,
    time: rescheduleForm.time
  })
  toastStore.showToast(`Booking #${bookingToReschedule.value.id} rescheduled to ${rescheduleForm.date} · ${rescheduleForm.time}.`, 'success')
  showRescheduleModal.value = false
  bookingToReschedule.value = null
}

const triggerCancel = (booking) => {
  bookingToCancel.value = booking
  showCancelModal.value = true
}

const confirmCancelBooking = () => {
  if (bookingToCancel.value) {
    const id = bookingToCancel.value.id
    cancelBooking(id)
    showCancelModal.value = false
    bookingToCancel.value = null
    toastStore.showToast(`Booking #${id} has been cancelled.`, 'info')
  }
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

const toIcsStamp = (dateStr, timeStr) => {
  try {
    const [y, m, d] = (dateStr || '').split('-').map(Number)
    const match = (timeStr || '09:00 AM').match(/(\d+):(\d+)\s*(AM|PM)/i)
    let hours = match ? parseInt(match[1], 10) : 9
    const mins = match ? parseInt(match[2], 10) : 0
    const period = match ? match[3].toUpperCase() : 'AM'
    if (period === 'PM' && hours < 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    const start = new Date(y, (m || 1) - 1, d || 1, hours, mins, 0)
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    const fmt = (dt) =>
      `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, '0')}${String(dt.getDate()).padStart(2, '0')}T${String(dt.getHours()).padStart(2, '0')}${String(dt.getMinutes()).padStart(2, '0')}00`
    return { dtStart: fmt(start), dtEnd: fmt(end) }
  } catch {
    return { dtStart: '20260101T090000', dtEnd: '20260101T100000' }
  }
}

const downloadCalendarInvite = (booking) => {
  const { dtStart, dtEnd } = toIcsStamp(booking.date, booking.time)
  const title = `Tiki Tiki Salon: ${booking.serviceTitle} (${booking.petName || booking.customerName})`
  const description = `Booking #${booking.id} with ${booking.specialistName}. Duration: ${booking.serviceDuration}.`
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tiki Tiki Beauty Salon//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@tikisalon`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    'LOCATION:42 Orchid Blossom Ave, BKK1, Phnom Penh',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `appointment-${booking.id}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
  toastStore.showToast(`Downloaded calendar invite for #${booking.id}`, 'success')
}

onMounted(() => {
  window.scrollTo(0, 0)
  const hasServiceParam = route.query.service
  const hasSpecParam = route.query.specialist
  if (hasServiceParam || hasSpecParam) {
    const match = hasServiceParam ? allServices.value.find(s => s.id === parseInt(hasServiceParam, 10)) : null
    openBookingModal(match, hasSpecParam || null)
  }
})
</script>

<style scoped>
.tnak-booking-page {
  background-color: color-mix(in srgb, var(--storefront-bg, #FAF8F5) 76%, transparent);
  min-height: 100vh;
  padding-top: 76px;
  padding-bottom: 60px;
}

.heading-text {
  color: var(--text-heading-color, #0f172a);
}

.tnak-card,
.tnak-filter-card {
  background-color: var(--storefront-surface, #ffffff);
  border-radius: 14px;
  border: 1px solid var(--border-clr, rgba(15, 23, 42, 0.08)) !important;
}

.tnak-filter-card {
  position: sticky;
  top: 76px;
}

.badge-count-pill {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--primary-color, #EA7A38);
  background-color: var(--primary-color-soft, rgba(234, 122, 56, 0.12));
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
}

.view-mode-toggle-group {
  background-color: var(--surface-ground, #f1f5f9);
  border: 1px solid var(--border-clr, rgba(15, 23, 42, 0.06));
}

.view-toggle-btn {
  border: none;
  background: transparent;
  color: var(--secondary-color, #64748b);
  cursor: pointer;
}

.view-toggle-btn.active {
  background-color: var(--storefront-surface, #ffffff);
  color: var(--primary-color, #EA7A38);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.tnak-block {
  background-color: var(--surface-ground, #f1f5f9);
  min-inline-size: 0;
  overflow: hidden;
}

.btn-tnak-secondary-sm {
  background-color: var(--surface-ground, #f1f5f9);
  color: var(--text-heading-color, #0f172a);
  border: 1px solid var(--border-clr);
  border-radius: 6px;
  padding: 0.24rem 0.6rem;
  font-size: 0.74rem;
  font-weight: 600;
}

.btn-tnak-link-cal {
  color: var(--primary-color, #EA7A38);
  font-weight: 600;
}

.btn-tnak-link-cal:hover {
  text-decoration: underline;
}

.selected-service-pill {
  background-color: var(--primary-color-soft, rgba(234, 122, 56, 0.1));
  border: 1px solid var(--primary-color-border, rgba(234, 122, 56, 0.3));
}

.selected-service-thumb {
  width: 44px;
  height: 44px;
}

.booking-account-chip {
  background-color: var(--surface-ground, #f1f5f9);
  border: 1px solid var(--border-clr, #e2e8f0);
}
</style>
