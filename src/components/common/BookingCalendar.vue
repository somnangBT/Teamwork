<template>
  <div class="booking-calendar-wrapper bg-white rounded-4 border shadow-sm p-4">
    <!-- Header -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div class="d-flex align-items-center gap-3">
        <h4 class="fw-bold text-dark mb-0 m-0">{{ monthYearDisplay }}</h4>
        <div class="d-flex gap-1 bg-light rounded-pill p-1 border">
          <button class="btn btn-sm btn-light border-0 rounded-circle text-muted" @click="prevMonth" title="Previous Month">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button class="btn btn-sm btn-light border-0 rounded-circle text-muted" @click="nextMonth" title="Next Month">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
      <button class="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-medium" @click="goToToday">
        Today
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-grid border rounded-3 overflow-hidden">
      <!-- Weekday Headers -->
      <div class="calendar-row header-row bg-light border-bottom">
        <div v-for="day in weekDays" :key="day" class="calendar-cell text-center py-2 fw-semibold text-muted" style="font-size: 0.8rem;">
          {{ day }}
        </div>
      </div>

      <!-- Days -->
      <div v-for="(week, wIndex) in calendarWeeks" :key="wIndex" class="calendar-row">
        <div 
          v-for="(dayObj, dIndex) in week" 
          :key="dIndex" 
          class="calendar-cell border-end border-bottom p-2 position-relative"
          :class="[
            !dayObj.isCurrentMonth ? 'bg-light text-muted opacity-50' : '',
            dayObj.isToday ? 'bg-orange-soft-light' : ''
          ]"
        >
          <!-- Date Number -->
          <div class="d-flex justify-content-between align-items-start mb-1">
            <span 
              class="date-number fw-medium d-inline-flex align-items-center justify-content-center"
              :class="{ 'bg-orange text-white rounded-circle': dayObj.isToday }"
            >
              {{ dayObj.date.getDate() }}
            </span>
          </div>

          <!-- Events Container -->
          <div class="events-container d-flex flex-column gap-1 overflow-auto custom-scrollbar">
            <div 
              v-for="booking in dayObj.events" 
              :key="booking.id"
              class="event-badge rounded-2 p-1.5 px-2 text-truncate cursor-pointer"
              :class="getStatusColorClass(booking.status)"
              @click="$emit('select-booking', booking)"
              :title="`${booking.time} - ${booking.customerName}`"
            >
              <div class="d-flex align-items-center gap-1">
                <span class="event-time flex-shrink-0">{{ formatShortTime(booking.time) }}</span>
                <span class="event-title fw-semibold text-truncate">{{ booking.customerName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  bookings: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['select-booking'])

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const currentDate = ref(new Date())

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

const monthYearDisplay = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
}

// Generate a strict 6-week calendar grid (42 cells)
const calendarWeeks = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - startDate.getDay()) // Back to Sunday
  
  const weeks = []
  let current = new Date(startDate)
  
  const todayStr = new Date().toISOString().split('T')[0]

  for (let i = 0; i < 6; i++) {
    const week = []
    for (let j = 0; j < 7; j++) {
      // Local ISO string hack to prevent timezone shifts
      const offset = current.getTimezoneOffset()
      const localDate = new Date(current.getTime() - (offset*60*1000))
      const dateStr = localDate.toISOString().split('T')[0]
      
      // Get events for this day
      const dayEvents = props.bookings.filter(b => b.date === dateStr).sort((a, b) => {
        return a.time.localeCompare(b.time)
      })

      week.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: dateStr === todayStr,
        events: dayEvents
      })
      current.setDate(current.getDate() + 1)
    }
    weeks.push(week)
  }
  
  return weeks
})

const formatShortTime = (timeStr) => {
  if (!timeStr) return ''
  return timeStr.replace(':00', '').replace(' AM', 'a').replace(' PM', 'p').toLowerCase()
}

const getStatusColorClass = (status) => {
  switch (status) {
    case 'Confirmed': return 'bg-success-subtle text-success border border-success-subtle'
    case 'In Progress': return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
    case 'Done': return 'bg-primary-subtle text-primary border border-primary-subtle'
    case 'Cancelled': return 'bg-danger-subtle text-danger border border-danger-subtle'
    default: return 'bg-light text-muted border border-light'
  }
}
</script>

<style scoped>
.calendar-row {
  display: flex;
  width: 100%;
}
.calendar-cell {
  flex: 1;
  width: calc(100% / 7);
  min-height: 120px;
  display: flex;
  flex-direction: column;
}
.header-row .calendar-cell {
  min-height: auto;
}
.calendar-cell:last-child {
  border-right: none !important;
}
.calendar-row:last-child .calendar-cell {
  border-bottom: none !important;
}
.date-number {
  width: 24px;
  height: 24px;
  font-size: 0.85rem;
}
.bg-orange {
  background-color: #EA7A38 !important;
}
.bg-orange-soft-light {
  background-color: rgba(234, 122, 56, 0.03) !important;
}
.event-badge {
  font-size: 0.72rem;
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.event-badge:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}
.event-time {
  font-size: 0.65rem;
  opacity: 0.8;
}
.cursor-pointer {
  cursor: pointer;
}
.events-container {
  max-height: 90px;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
}
/* Extended Bootstrap Subtles */
.bg-success-subtle { background-color: #d1e7dd !important; }
.text-success { color: #0f5132 !important; }
.border-success-subtle { border-color: #badbcc !important; }

.bg-warning-subtle { background-color: #fff3cd !important; }
.text-warning-emphasis { color: #664d03 !important; }
.border-warning-subtle { border-color: #ffe69c !important; }

.bg-primary-subtle { background-color: #cff4fc !important; } /* Using info colors for done as primary is blue */
.text-primary { color: #055160 !important; }
.border-primary-subtle { border-color: #b6effb !important; }

.bg-danger-subtle { background-color: #f8d7da !important; }
.text-danger { color: #842029 !important; }
.border-danger-subtle { border-color: #f5c2c7 !important; }
</style>
