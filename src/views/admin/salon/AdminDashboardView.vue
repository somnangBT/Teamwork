<template>
  <div class="salon-overview-view">
    <!-- Top KPI Stat Row -->
    <div class="row g-3 mb-3">
      <div class="col-lg-3 col-6">
        <BaseStat
          label="Active Appointments"
          :value="activeBookingsCount"
          trendValue="+12%"
          trendLabel="this month"
          trendType="up"
        />
      </div>
      <div class="col-lg-3 col-6">
        <BaseStat
          label="Total Bookings"
          :value="bookings.length"
          trendValue="+8%"
          trendLabel="this month"
          trendType="up"
        />
      </div>
      <div class="col-lg-3 col-6">
        <BaseStat
          label="Pending Orders"
          :value="pendingOrdersCount"
          :trendValue="`${orders.length} total`"
          trendLabel="store orders"
          trendType="up"
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

    <!-- Charts Row -->
    <div class="row g-3 mb-3">
      <div class="col-xl-8 col-lg-7">
        <BarChart
          class="h-100"
          title="Monthly Appointments & Orders"
          subtitle="Salon activity comparison over the year"
          :labels="barChartLabels"
          :datasets="barChartDatasets"
        />
      </div>

      <div class="col-xl-4 col-lg-5">
        <PieChart
          class="h-100"
          title="Bookings by Status"
          subtitle="Live appointment breakdown"
          :labels="pieChartLabels"
          :dataValues="pieChartData"
        />
      </div>
    </div>

    <!-- Quick Operational Panels -->
    <div class="row g-3">
      <!-- Upcoming Appointments -->
      <div class="col-lg-7">
        <div class="card p-2 border-0 h-100" style="background-color: var(--surface-ground);">
          <div class="card-header border-0 p-3 d-flex justify-content-between align-items-center mb-2"
            style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
            <div>
              <h6 class="fw-bold mb-0" style="color: var(--text-heading-color);">Recent Appointments</h6>
              <small class="text-muted">Latest client salon &amp; spa reservations</small>
            </div>
            <router-link to="/admin/bookings" class="small fw-semibold text-primary text-decoration-none">
              View All →
            </router-link>
          </div>
          <div class="card-body p-3" style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
            <div v-if="bookings.length" class="d-flex flex-column gap-2">
              <div
                v-for="b in bookings.slice(0, 4)"
                :key="b.id"
                class="d-flex align-items-center justify-content-between gap-2 p-2 rounded-3 border"
              >
                <div class="min-w-0">
                  <div class="fw-semibold small text-truncate" style="color: var(--text-heading-color);">
                    {{ b.customerName }} <span v-if="b.petName" class="text-muted">({{ b.petName }})</span>
                  </div>
                  <div class="text-muted" style="font-size: 0.76rem;">
                    {{ b.serviceTitle }} · {{ b.date }} {{ b.time }}
                  </div>
                </div>
                <BaseBadge :status="b.status || 'Confirmed'" size="sm" />
              </div>
            </div>
            <div v-else class="text-center py-4 text-muted small">No appointments scheduled.</div>
          </div>
        </div>
      </div>

      <!-- Low Stock & Specialist Duty Summary -->
      <div class="col-lg-5">
        <div class="card p-2 border-0 h-100" style="background-color: var(--surface-ground);">
          <div class="card-header border-0 p-3 d-flex justify-content-between align-items-center mb-2"
            style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
            <div>
              <h6 class="fw-bold mb-0" style="color: var(--text-heading-color);">Inventory Alerts</h6>
              <small class="text-muted">{{ lowStockCount }} products below 10 units</small>
            </div>
            <router-link to="/admin/products" class="small fw-semibold text-primary text-decoration-none">
              Manage Stock →
            </router-link>
          </div>
          <div class="card-body p-3" style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
            <div v-if="lowStockProducts.length" class="d-flex flex-column gap-2">
              <div
                v-for="prod in lowStockProducts"
                :key="prod.id"
                class="d-flex align-items-center justify-content-between gap-2 p-2 rounded-3 border"
              >
                <div class="d-flex align-items-center gap-2 min-w-0">
                  <img :src="prod.image" :alt="prod.name" class="rounded object-fit-cover flex-shrink-0" style="width: 34px; height: 34px;" />
                  <div class="min-w-0">
                    <div class="fw-semibold small text-truncate" style="color: var(--text-heading-color);">{{ prod.name }}</div>
                    <div class="text-muted" style="font-size: 0.75rem;">{{ prod.stock }} left · {{ prod.price }}</div>
                  </div>
                </div>
                <BaseBadge :status="prod.status" size="sm" />
              </div>
            </div>
            <div v-else class="text-center py-4 text-success small fw-medium">
              All retail products are well stocked!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useBooking } from '@/composables/useBooking'
import { useAdmin } from '@/composables/useAdmin'
import { useProducts } from '@/composables/useProducts'

const BarChart = defineAsyncComponent(() => import('@/components/charts/BarChart.vue'))
const PieChart = defineAsyncComponent(() => import('@/components/charts/PieChart.vue'))

const { bookings, activeBookingsCount } = useBooking()
const { orders, totalRevenue, lowStockCount, pendingOrdersCount } = useAdmin()
const { products } = useProducts()

const lowStockProducts = computed(() => products.value.filter(p => (Number(p.stock) || 0) < 15).slice(0, 4))

const barChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const barChartDatasets = computed(() => [
  {
    label: 'Salon Appointments',
    type: 'bar',
    data: [42, 48, 55, 62, 58, 70, 68, 74, 65, 78, 82, 85 + bookings.value.length]
  },
  {
    label: 'Store Orders',
    type: 'bar',
    data: [25, 29, 34, 38, 41, 45, 44, 52, 49, 55, 58, 60 + orders.value.length]
  }
])

const statusBreakdown = computed(() => {
  const counts = { Confirmed: 0, 'In Progress': 0, Done: 0, Pending: 0, Cancelled: 0 }
  bookings.value.forEach(b => {
    const key = b.status || 'Confirmed'
    counts[key] = (counts[key] || 0) + 1
  })
  return Object.entries(counts).filter(([, val]) => val > 0)
})

const pieChartLabels = computed(() => statusBreakdown.value.map(([k]) => k))
const pieChartData = computed(() => statusBreakdown.value.map(([, v]) => v))
</script>
