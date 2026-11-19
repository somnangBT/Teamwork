<template>
  <div class="admin-bookings-view">
    <DashboardPageTitle
      title="Appointments & Bookings"
      subtitle="Manage beauty salon reservations, specialist assignments, and studio schedule."
    >
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <BaseButton
          :variant="viewMode === 'picker' ? 'primary' : 'outline-primary'"
          @click="viewMode = 'picker'"
        >
          <Clock :size="16" />
          <span>Date Time Picker</span>
        </BaseButton>

        <BaseButton
          :variant="viewMode === 'calendar' ? 'primary' : 'outline-primary'"
          @click="viewMode = 'calendar'"
        >
          <CalendarDays :size="16" />
          <span>Calendar</span>
        </BaseButton>

        <BaseButton variant="primary" @click="openCreateModal">
          <Plus :size="17" />
          <span class="d-none d-sm-inline">New Appointment</span>
        </BaseButton>
      </div>
    </DashboardPageTitle>

    <div class="card border-0 p-3" style="background-color: var(--surface-ground);">
      <!-- Filters & Search -->
      <div class="mb-3 d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-2">
        <div class="flex-grow-1 overflow-auto pb-1 pb-xl-0" style="min-width: 0;">
          <BaseFilter v-model="activeStatus" :options="filterOptions" style="min-width: max-content;" />
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2 flex-shrink-0">
          <div class="d-flex align-items-center gap-1" style="width: 190px;">
            <BaseDatePicker
              v-model="filterDate"
              placeholder="Filter date..."
              class="w-100"
            />
            <BaseButton
              v-if="filterDate"
              type="button"
              variant="outline-primary"
              class="px-3 flex-shrink-0"
              title="Clear date filter"
              aria-label="Clear date filter"
              @click="filterDate = ''"
            >
              <X :size="15" />
            </BaseButton>
          </div>

          <div style="min-width: 240px;">
            <BaseInput
              v-model="searchQuery"
              placeholder="Search customer, style, or service..."
              :prefixIcon="Search"
              clearable
              class="w-100"
            />
          </div>
        </div>
      </div>

      <!-- Date Time Picker Planner View -->
      <div v-if="viewMode === 'picker'" class="planner-layout">
        <!-- Left Column: Inline Date Picker with Dot Indicators -->
        <div class="planner-sidebar-col">
          <div class="card border-0 p-3 h-100 planner-sidebar">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="d-flex align-items-center gap-2">
                <CalendarDays class="text-primary" :size="20" />
                <h5 class="fw-bold m-0 text-heading">Select Date</h5>
              </div>
              <BaseButton type="button" variant="outline-primary" class="btn-compact" @click="selectTodayPlanner">
                Today
              </BaseButton>
            </div>

            <div class="calendar-wrapper overflow-hidden">
              <BaseDatePicker inline v-model="selectedPlannerDate" @update:modelValue="showAllPlannerDates = false">
                <template #date="slotProps">
                  <div class="position-relative d-flex align-items-center justify-content-center w-100 h-100">
                    <span>{{ slotProps.date.day }}</span>
                    <span v-if="hasBookingOnDate(slotProps.date)" class="calendar-dot"></span>
                  </div>
                </template>
              </BaseDatePicker>
            </div>

            <!-- Mobile quick jump button: visible on screens < 768px -->
            <div class="d-block d-md-none mt-2">
              <BaseButton
                type="button"
                variant="primary"
                class="w-100 justify-content-center btn-compact"
                @click="scrollToBookings"
              >
                <span>View {{ plannerBookings.length }} Appointment{{ plannerBookings.length === 1 ? '' : 's' }}</span>
                <ArrowDown :size="15" />
              </BaseButton>
            </div>

            <!-- Collapsible schedule overview -->
            <div class="mt-3 info-panel p-2.5 p-sm-3 rounded-3">
              <div
                class="d-flex align-items-center justify-content-between cursor-pointer"
                @click="isShiftInfoOpen = !isShiftInfoOpen"
                role="button"
                tabindex="0"
              >
                <div class="d-flex align-items-center gap-2 text-primary">
                  <Info :size="15" />
                  <span class="fw-bold small">Schedule Overview</span>
                </div>
                <ChevronDown :size="15" class="text-muted transition-transform" :class="{ 'rotate-180': isShiftInfoOpen }" />
              </div>

              <div v-show="isShiftInfoOpen" class="pt-2 mt-2 border-top d-flex flex-column gap-1">
                <p class="text-muted text-xs mb-2">
                  Select any highlighted date dot to inspect appointments, or switch to All Dates.
                </p>
                <div class="d-flex align-items-center justify-content-between text-xs">
                  <span class="text-muted">Morning Shift:</span>
                  <span class="fw-semibold text-heading">09:00 AM – 11:30 AM</span>
                </div>
                <div class="d-flex align-items-center justify-content-between text-xs">
                  <span class="text-muted">Afternoon Shift:</span>
                  <span class="fw-semibold text-heading">01:00 PM – 04:00 PM</span>
                </div>
                <div class="d-flex align-items-center justify-content-between text-xs">
                  <span class="text-muted">Evening Shift:</span>
                  <span class="fw-semibold text-heading">05:00 PM – 07:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Selected Date Details & Cards -->
        <div class="planner-details-col" id="planner-bookings-section">
          <div class="card border-0 p-3 p-md-4 h-100 planner-details">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3 pb-1">
              <div class="d-flex align-items-center gap-3">
                <div
                  class="date-badge text-center p-2 rounded-3 bg-primary-soft text-primary"
                  style="width: 52px; flex-shrink: 0;"
                >
                  <span class="d-block fw-bold fs-5 lh-1">{{ getDayOfMonth(selectedPlannerDate) }}</span>
                  <span class="d-block text-uppercase mt-1" style="font-size: 0.68rem; font-weight: 700;">
                    {{ getMonthName(selectedPlannerDate) }}
                  </span>
                </div>
                <div>
                  <div class="d-flex align-items-center gap-2">
                    <h5 class="fw-bold mb-0 text-heading">
                      {{ showAllPlannerDates ? 'All Scheduled Appointments' : 'Daily Appointments' }}
                    </h5>
                    <span class="badge bg-primary-soft text-primary rounded-pill px-2">
                      {{ plannerBookings.length }}
                    </span>
                  </div>
                  <p class="text-muted small mb-0 mt-0.5">
                    {{ showAllPlannerDates ? 'Showing appointments across all dates' : formatFriendlyDate(selectedPlannerDate) }}
                  </p>
                </div>
              </div>

              <div class="d-flex align-items-center gap-2 flex-wrap ms-auto">
                <BaseButton
                  type="button"
                  variant="outline-primary"
                  class="btn-compact"
                  @click="showAllPlannerDates = !showAllPlannerDates"
                >
                  {{ showAllPlannerDates ? 'Filter Selected Date' : `Show All Dates (${filteredBookings.length})` }}
                </BaseButton>
                <BaseButton variant="primary" class="btn-compact" @click="openCreateModalForDate(selectedPlannerDate)">
                  <Plus :size="15" />
                  <span>Book This Date</span>
                </BaseButton>
              </div>
            </div>

            <div v-if="plannerBookings.length > 0" class="row g-3">
              <div v-for="b in plannerBookings" :key="b.id" class="col-12 col-xl-6">
                <BookingSideCard
                  :booking="b"
                  @edit="openEditModal"
                  @update-status="handleStatusUpdate"
                />
              </div>
            </div>

            <div v-else class="text-center py-5 my-auto">
              <CalendarDays :size="36" class="text-muted mb-2" />
              <h6 class="fw-bold mb-1 text-heading">No appointments on {{ selectedPlannerDate }}</h6>
              <p class="text-muted small mb-3">
                Pick a dotted date on the calendar, view all dates, or schedule a new client now.
              </p>
              <div class="d-flex justify-content-center gap-2 flex-wrap">
                <BaseButton type="button" variant="outline-primary" class="btn-compact" @click="showAllPlannerDates = true">
                  View All ({{ filteredBookings.length }})
                </BaseButton>
                <BaseButton variant="primary" class="btn-compact" @click="openCreateModalForDate(selectedPlannerDate)">
                  <Plus :size="15" />
                  <span>New Appointment</span>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Full-Month Calendar View -->
      <div v-else class="row g-3 align-items-start">
        <div class="col-12 col-lg-7 col-xl-8">
          <BookingCalendar :bookings="filteredBookings" @select-booking="openEditModal" />
        </div>
        <div class="col-12 col-lg-5 col-xl-4">
          <div class="planner-details p-3 p-md-4 d-flex flex-column gap-3">
            <div class="d-flex align-items-center justify-content-between">
              <h5 class="fw-bold m-0 text-heading">Upcoming Appointments</h5>
              <span class="badge bg-primary-soft text-primary rounded-pill px-2">
                {{ filteredBookings.length }}
              </span>
            </div>
            <BookingSideCard
              v-for="b in filteredBookings.slice(0, 6)"
              :key="b.id"
              :booking="b"
              @edit="openEditModal"
              @update-status="handleStatusUpdate"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Create / Edit Appointment Modal -->
    <BaseModal v-model="showFormModal" :title="editingBookingId ? 'Edit Appointment' : 'New Appointment'" size="md">
      <form @submit.prevent="saveBooking">
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <BaseInput v-model="form.customerName" label="Client Name" required />
          </div>
          <div class="col-md-6">
            <BaseInput v-model="form.customerPhone" label="Phone" required />
          </div>
          <div class="col-md-6">
            <BaseInput v-model="form.petName" label="Style / Care Focus" required />
          </div>
          <div class="col-md-6">
            <BaseInput v-model="form.petBreed" label="Finish Preference" placeholder="e.g. Soft Waves / Gloss" />
          </div>
          <div class="col-md-6">
            <BaseSelect
              v-model="form.serviceId"
              label="Service"
              required
              :options="allServices.map(s => ({ label: `${s.title} ($${s.price})`, value: s.id }))"
            />
          </div>
          <div class="col-md-6">
            <BaseSelect
              v-model="form.specialistName"
              label="Specialist"
              required
              :options="specialists.map(sp => ({ label: sp.name, value: sp.name }))"
            />
          </div>
          <div class="col-md-8">
            <BaseDatePicker
              v-model="formDateTimeIso"
              label="Appointment Date & Time"
              placeholder="Select date and time..."
              :showTime="true"
              hourFormat="12"
              required
            />
          </div>
          <div class="col-md-4">
            <BaseSelect
              v-model="form.status"
              label="Status"
              required
              :options="[
                { label: 'Confirmed', value: 'Confirmed' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Done', value: 'Done' },
                { label: 'Cancelled', value: 'Cancelled' }
              ]"
            />
          </div>
          <div class="col-12">
            <BaseInput v-model="form.notes" type="textarea" :rows="2" label="Notes" />
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center gap-2 pt-2 border-top">
          <BaseButton
            v-if="editingBookingId"
            type="button"
            variant="outline-danger"
            @click="deleteEditingBooking"
          >
            <Trash2 :size="15" /> Delete
          </BaseButton>
          <span v-else></span>
          <div class="d-flex gap-2">
            <BaseButton type="button" variant="outline-secondary" @click="showFormModal = false">Cancel</BaseButton>
            <BaseButton type="submit" variant="primary">{{ editingBookingId ? 'Save Changes' : 'Create Appointment' }}</BaseButton>
          </div>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus, Search, Clock, CalendarDays, Info, X, Trash2, ChevronDown, ArrowDown } from '@lucide/vue'
import { useBooking } from '@/composables/useBooking'
import { useServices } from '@/composables/useServices'
import { useToastStore } from '@/stores/toast'
import DashboardPageTitle from '@/components/common/DashboardPageTitle.vue'
import BookingCalendar from '@/components/common/BookingCalendar.vue'
import BookingSideCard from '@/components/common/BookingSideCard.vue'

const toastStore = useToastStore()
const { bookings, specialists, createBooking, updateBookingStatus, updateBookingDetails, deleteBookingPermanent } = useBooking()
const { allServices } = useServices()

const getLocalTodayStr = () => {
  const today = new Date()
  const offset = today.getTimezoneOffset()
  return new Date(today.getTime() - offset * 60000).toISOString().split('T')[0]
}

const viewMode = ref('picker')
const activeStatus = ref('')
const searchQuery = ref('')
const filterDate = ref('')
const selectedPlannerDate = ref(getLocalTodayStr())
const showAllPlannerDates = ref(false)
const isShiftInfoOpen = ref(true)

const scrollToBookings = () => {
  document.getElementById('planner-bookings-section')?.scrollIntoView({ behavior: 'smooth' })
}

const filterOptions = computed(() => {
  const count = (status) => bookings.value.filter(b => (b.status || 'Confirmed') === status).length
  return [
    { label: 'All', value: '', badge: bookings.value.length },
    { label: 'Confirmed', value: 'Confirmed', variant: 'success', badge: count('Confirmed') },
    { label: 'In Progress', value: 'In Progress', variant: 'info', badge: count('In Progress') },
    { label: 'Pending', value: 'Pending', variant: 'warning', badge: count('Pending') },
    { label: 'Done', value: 'Done', variant: 'primary', badge: count('Done') },
    { label: 'Cancelled', value: 'Cancelled', variant: 'danger', badge: count('Cancelled') }
  ]
})

const filteredBookings = computed(() => {
  let list = [...bookings.value]
  if (activeStatus.value) {
    list = list.filter(b => (b.status || 'Confirmed') === activeStatus.value)
  }
  if (filterDate.value) {
    list = list.filter(b => b.date === filterDate.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      b =>
        (b.customerName || '').toLowerCase().includes(q) ||
        (b.petName || '').toLowerCase().includes(q) ||
        (b.serviceTitle || '').toLowerCase().includes(q) ||
        (b.id || '').toLowerCase().includes(q)
    )
  }
  list.sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
  return list
})

const bookedDatesSet = computed(() => new Set(bookings.value.map(b => b.date).filter(Boolean)))

const hasBookingOnDate = (dateObj) => {
  if (!dateObj) return false
  const y = dateObj.year
  const m = String(dateObj.month + 1).padStart(2, '0')
  const d = String(dateObj.day).padStart(2, '0')
  return bookedDatesSet.value.has(`${y}-${m}-${d}`)
}

const plannerBookings = computed(() => {
  if (showAllPlannerDates.value || !selectedPlannerDate.value) {
    return filteredBookings.value
  }
  return filteredBookings.value.filter(b => b.date === selectedPlannerDate.value)
})

const selectTodayPlanner = () => {
  selectedPlannerDate.value = getLocalTodayStr()
  showAllPlannerDates.value = false
}

const getDayOfMonth = (dateStr) => {
  const parts = String(dateStr || '').split('-')
  return parts[2] || new Date().getDate()
}

const getMonthName = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T00:00:00`)
  return isNaN(d) ? '' : d.toLocaleDateString('en-US', { month: 'short' })
}

const formatFriendlyDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T00:00:00`)
  return isNaN(d)
    ? dateStr
    : d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const parseTimeParts = (timeStr) => {
  const match = String(timeStr || '09:00 AM').trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i)
  if (!match) return { hours: 9, minutes: 0 }
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const meridiem = (match[3] || '').toUpperCase()
  if (meridiem === 'PM' && hours < 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0
  return { hours, minutes }
}

const formatTime12h = (hours, minutes) => {
  const meridiem = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 || 12
  return `${String(h12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${meridiem}`
}

const paginatedBookings = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filteredBookings.value.slice(start, start + perPage.value)
})

const handleStatusUpdate = (id, status) => {
  updateBookingStatus(id, status)
  toastStore.showToast(`Booking #${id} marked as ${status}.`, 'success')
}

const showFormModal = ref(false)
const editingBookingId = ref(null)
const form = reactive({
  customerName: '',
  customerPhone: '',
  petName: '',
  petBreed: '',
  serviceId: null,
  specialistName: '',
  date: getLocalTodayStr(),
  time: '09:00 AM',
  status: 'Confirmed',
  notes: ''
})

const formDateTimeIso = computed({
  get: () => {
    const [y, m, d] = (form.date || getLocalTodayStr()).split('-').map(Number)
    const { hours, minutes } = parseTimeParts(form.time)
    const dt = new Date(y, (m || 1) - 1, d || 1, hours, minutes, 0, 0)
    return isNaN(dt) ? null : dt.toISOString()
  },
  set: (val) => {
    if (!val) return
    const dt = new Date(val)
    if (isNaN(dt)) return
    const y = dt.getFullYear()
    const m = String(dt.getMonth() + 1).padStart(2, '0')
    const d = String(dt.getDate()).padStart(2, '0')
    form.date = `${y}-${m}-${d}`
    form.time = formatTime12h(dt.getHours(), dt.getMinutes())
  }
})

const openCreateModalForDate = (targetDate) => {
  editingBookingId.value = null
  form.customerName = ''
  form.customerPhone = ''
  form.petName = ''
  form.petBreed = ''
  form.serviceId = allServices.value[0]?.id || null
  form.specialistName = specialists.value[1]?.name || specialists.value[0]?.name
  form.date = targetDate || getLocalTodayStr()
  form.time = '09:00 AM'
  form.status = 'Confirmed'
  form.notes = ''
  showFormModal.value = true
}

const openCreateModal = () => openCreateModalForDate(getLocalTodayStr())

const openEditModal = (booking) => {
  editingBookingId.value = booking.id
  form.customerName = booking.customerName
  form.customerPhone = booking.customerPhone
  form.petName = booking.petName || ''
  form.petBreed = booking.petBreed || ''
  form.serviceId = booking.serviceId || allServices.value[0]?.id
  form.specialistName = booking.specialistName
  form.date = booking.date
  form.time = booking.time
  form.status = booking.status || 'Confirmed'
  form.notes = booking.notes || ''
  showFormModal.value = true
}

const saveBooking = () => {
  const svc = allServices.value.find(s => s.id === Number(form.serviceId)) || allServices.value[0]
  const spec = specialists.value.find(sp => sp.name === form.specialistName) || specialists.value[0]

  const payload = {
    customerName: form.customerName,
    customerPhone: form.customerPhone,
    petName: form.petName,
    petBreed: form.petBreed,
    serviceId: svc.id,
    serviceTitle: svc.title,
    servicePrice: svc.price,
    serviceDuration: svc.duration,
    specialistName: spec.name,
    specialistRole: spec.role,
    specialistAvatar: spec.avatar,
    date: form.date,
    time: form.time,
    status: form.status,
    notes: form.notes
  }

  if (editingBookingId.value) {
    updateBookingDetails(editingBookingId.value, payload)
    toastStore.showToast(`Appointment #${editingBookingId.value} updated.`, 'success')
  } else {
    const created = createBooking(payload)
    toastStore.showToast(`Created appointment #${created.id}.`, 'success')
  }
  showFormModal.value = false
}

const deleteEditingBooking = () => {
  if (!editingBookingId.value) return
  const id = editingBookingId.value
  deleteBookingPermanent(id)
  showFormModal.value = false
  toastStore.showToast(`Booking #${id} removed.`, 'info')
}
</script>

<style scoped>
.planner-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .planner-layout {
    flex-direction: row;
    align-items: stretch;
    gap: 1.25rem;
  }

  .planner-sidebar-col {
    width: 320px;
    flex-shrink: 0;
  }

  .planner-details-col {
    flex: 1;
    min-width: 0;
  }
}

@media (min-width: 1200px) {
  .planner-sidebar-col {
    width: 350px;
  }
}

.btn-compact {
  height: 36px !important;
  padding-inline: 14px !important;
  font-size: 13.5px !important;
  gap: 6px !important;
}

.transition-transform {
  transition: transform 0.2s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.cursor-pointer {
  cursor: pointer;
}

.planner-sidebar,
.planner-details {
  background-color: var(--body-bg-color);
  border-radius: var(--border-inner-radius);
  border: none !important;
}

.calendar-wrapper :deep(.p-datepicker-panel),
.calendar-wrapper :deep(.p-datepicker-header) {
  border: none !important;
}

.info-panel {
  background-color: var(--surface-ground);
  border: none !important;
}

.bg-primary-soft {
  background-color: var(--primary-color-soft);
}

.text-heading {
  color: var(--text-heading-color);
}

.text-xs {
  font-size: 0.75rem;
}

.calendar-dot {
  position: absolute;
  bottom: 2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--primary-color);
  left: 50%;
  transform: translateX(-50%);
}

:deep(.p-datepicker-day-selected) .calendar-dot,
:deep(.p-datepicker-today) .calendar-dot {
  background-color: #ffffff !important;
}
</style>
