<template>
  <div class="admin-dashboard-view">
    <div class="mb-3">
        <div class="row g-3">
            <div class="col-lg-3 col-6">
                <BaseStat 
                  label="Upcoming Today"
                  :value="activeBookingsCount"
                  trendValue="+12%"
                  trendLabel="this month"
                  trendType="up"
                />
            </div>
            <div class="col-lg-3 col-6">
                <BaseStat 
                  label="Total Appointments"
                  :value="bookings.length * 4 + 8"
                  trendValue="+5%"
                  trendLabel="this month"
                  trendType="up"
                />
            </div>
            <div class="col-lg-3 col-6">
                <BaseStat 
                  label="Store Deliveries"
                  :value="orders.length"
                  trendValue="-2%"
                  trendLabel="this month"
                  trendType="down"
                />
            </div>
            <div class="col-lg-3 col-6">
                <BaseStat 
                  label="Revenue Generated"
                  :value="`$${totalRevenue.toFixed(0)}`"
                  trendValue="+18%"
                  trendLabel="this month"
                  trendType="up"
                />
            </div>
        </div>
    </div>
    
    <div class="row g-3">
      <div class="col-xl-8 col-lg-7">
        <BarChart 
            class="h-100" 
            title="Monthly Activity" 
            subtitle="Activity over the last year"
            :labels="barChartLabels"
            :datasets="barChartDatasets"
        />
      </div>

      <div class="col-xl-4 col-lg-5" >
        <PieChart 
            class="h-100" 
            title="Treatment Distribution" 
            subtitle="Current status distribution"
            :labels="pieChartLabels" 
            :dataValues="pieChartData" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseModal from '../../components/base/BaseModal.vue'
import BaseStat from '../../components/base/BaseStat.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BarChart from '../../components/charts/BarChart.vue'
import PieChart from '../../components/charts/PieChart.vue'
import { useBooking } from '../../composables/useBooking'
import { useAdmin } from '../../composables/useAdmin'

import UserView from './modules/users/UserView.vue'
import SurveyView from './modules/surveys/SurveyView.vue'
import RoomView from './modules/rooms/RoomView.vue'
import ReportView from './modules/reports/ReportView.vue'

const { bookings, activeBookingsCount, updateBookingStatus } = useBooking()
const { orders, totalRevenue, staffList } = useAdmin()

const showStats = ref(true)
const activeTab = ref('users')
const statusFilter = ref('')
const onlyToday = ref(false)

const dashboardTabs = [
  { id: 'users', name: 'Users Management', component: UserView },
  { id: 'surveys', name: 'Surveys', component: SurveyView },
  { id: 'rooms', name: 'Room Scheduling', component: RoomView },
  { id: 'reports', name: 'Reports & Analytics', component: ReportView }
]

const activeTabComponent = computed(() => {
  return dashboardTabs.find(t => t.id === activeTab.value)?.component || UserView
})

const isSessionModalOpen = ref(false)
const selectedBooking = ref(null)
const sessionNotes = ref('')



const toggleOnlyToday = () => {
  onlyToday.value = !onlyToday.value
}

const resetFilters = () => {
  statusFilter.value = ''
  onlyToday.value = false
}

const treatmentDistribution = computed(() => [
  { label: 'Grooming', color: '#10b981', percentage: 45 },
  { label: 'Spa & Wellness', color: '#0ea5e9', percentage: 30 },
  { label: 'Consultations', color: '#f59e0b', percentage: 25 },
])

const pieChartLabels = computed(() => treatmentDistribution.value.map(t => t.label))
const pieChartData = computed(() => treatmentDistribution.value.map(t => t.percentage))

const barChartLabels = computed(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
const barChartDatasets = computed(() => [
  {
    label: 'Appointments',
    type: 'bar',
    data: [65, 59, 80, 81, 56, 55, 40, 60, 45, 70, 75, 80]
  }
])

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Confirmed':
      return 'badge-checked-in'
    case 'In Progress':
      return 'badge-in-progress'
    case 'Done':
      return 'badge-done'
    case 'Cancelled':
      return 'badge-no-show'
    default:
      return 'badge-checked-in'
  }
}


const openSessionModal = (booking) => {
  selectedBooking.value = { ...booking }
  sessionNotes.value = ''
  isSessionModalOpen.value = true
}

const openHistoryModal = (booking) => {
  openSessionModal(booking)
}

const completeSessionUpdate = () => {
  if (selectedBooking.value) {
    updateBookingStatus(selectedBooking.value.id, selectedBooking.value.status)
  }
  isSessionModalOpen.value = false
}
</script>

<style scoped>
</style>
