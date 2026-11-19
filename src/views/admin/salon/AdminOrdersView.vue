<template>
  <div class="admin-orders-view">
    <DashboardPageTitle
      title="Orders & Sales"
      subtitle="Track storefront product orders, payment status, and fulfillment progress."
    />

    <div class="card p-3" style="background-color: var(--surface-ground);">
      <div class="mb-3 d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-2">
        <div class="flex-grow-1 overflow-auto pb-1 pb-xl-0" style="min-width: 0;">
          <BaseFilter v-model="activeStatus" :options="filterOptions" style="min-width: max-content;" />
        </div>
        <div style="min-width: 250px;">
          <BaseInput v-model="searchQuery" placeholder="Search order #, customer, or style..." :prefixIcon="Search" clearable />
        </div>
      </div>

      <BaseTable
        :columns="colDefs"
        :rows="paginatedOrders"
        :total-records="filteredOrders.length"
        v-model:page="page"
        v-model:per-page="perPage"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
      >
        <template #orderNumber="{ data }">
          <span class="fw-bold text-primary">{{ data.orderNumber }}</span>
        </template>

        <template #customerName="{ data }">
          <div>
            <div class="fw-semibold" style="color: var(--text-heading-color);">{{ data.customerName }}</div>
            <small class="text-muted">{{ data.petName }}</small>
          </div>
        </template>

        <template #items="{ data }">
          <span class="small text-muted">{{ data.items?.length || 0 }} item(s)</span>
        </template>

        <template #total="{ data }">
          <span class="fw-bold" style="color: var(--text-heading-color);">${{ Number(data.total).toFixed(2) }}</span>
        </template>

        <template #paymentStatus="{ data }">
          <div>
            <BaseBadge :status="data.paymentStatus" size="sm" />
            <div class="text-muted" style="font-size: 0.72rem;">{{ data.paymentMethod }}</div>
          </div>
        </template>

        <template #status="{ data }">
          <BaseBadge :status="data.status" size="sm" />
        </template>

        <template #action="{ data }">
          <BaseActionMenu :items="getActionItems(data)" />
        </template>
      </BaseTable>
    </div>

    <!-- Order Details Modal -->
    <BaseModal v-model="showDetailModal" :title="`Order ${selectedOrder?.orderNumber || ''}`" size="md">
      <div v-if="selectedOrder" class="d-flex flex-column gap-3">
        <div class="p-3 rounded-3 border" style="background: var(--surface-ground);">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong>{{ selectedOrder.customerName }}</strong>
            <BaseBadge :status="selectedOrder.status" size="sm" />
          </div>
          <div class="small text-muted">{{ selectedOrder.customerPhone }} · {{ selectedOrder.address }}</div>
        </div>

        <div>
          <h6 class="fw-bold small mb-2">Purchased Items</h6>
          <ul class="list-group">
            <li v-for="item in selectedOrder.items" :key="item.name" class="list-group-item d-flex justify-content-between small">
              <span>{{ item.quantity }}× {{ item.name }}</span>
              <strong>${{ (item.price * item.quantity).toFixed(2) }}</strong>
            </li>
          </ul>
        </div>

        <div class="d-flex justify-content-between border-top pt-2 fw-bold">
          <span>Total ({{ selectedOrder.paymentMethod }})</span>
          <span class="text-primary fs-5">${{ Number(selectedOrder.total).toFixed(2) }}</span>
        </div>

        <div class="pt-2 border-top d-flex flex-wrap gap-2 justify-content-end">
          <BaseButton variant="outline-secondary" @click="setStatus(selectedOrder.id, 'Processing')">Mark Processing</BaseButton>
          <BaseButton variant="outline-primary" @click="setStatus(selectedOrder.id, 'Shipped')">Mark Shipped</BaseButton>
          <BaseButton variant="success" @click="setStatus(selectedOrder.id, 'Delivered')">Mark Delivered</BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Eye, PackageCheck, Truck, CheckCircle2, XCircle, Trash2 } from '@lucide/vue'
import { useAdmin } from '@/composables/useAdmin'
import { useToastStore } from '@/stores/toast'
import DashboardPageTitle from '@/components/common/DashboardPageTitle.vue'

const toastStore = useToastStore()
const { orders, updateOrderStatus, deleteOrder } = useAdmin()

const activeStatus = ref('')
const searchQuery = ref('')
const page = ref(1)
const perPage = ref(10)
const sortBy = ref('createdAt')
const sortOrder = ref('desc')

const filterOptions = computed(() => {
  const count = (s) => orders.value.filter(o => o.status === s).length
  return [
    { label: 'All', value: '', badge: orders.value.length },
    { label: 'Pending', value: 'Pending', variant: 'warning', badge: count('Pending') },
    { label: 'Processing', value: 'Processing', variant: 'info', badge: count('Processing') },
    { label: 'Shipped', value: 'Shipped', variant: 'info', badge: count('Shipped') },
    { label: 'Delivered', value: 'Delivered', variant: 'success', badge: count('Delivered') },
    { label: 'Cancelled', value: 'Cancelled', variant: 'danger', badge: count('Cancelled') }
  ]
})

const colDefs = [
  { field: 'orderNumber', header: 'Order #', sortable: true },
  { field: 'customerName', header: 'Customer & Care', sortable: true },
  { field: 'items', header: 'Items', sortable: false },
  { field: 'total', header: 'Total', sortable: true },
  { field: 'paymentStatus', header: 'Payment', sortable: true },
  { field: 'status', header: 'Fulfillment', sortable: true },
  { field: 'action', header: 'Actions', sortable: false }
]

const filteredOrders = computed(() => {
  let list = [...orders.value]
  if (activeStatus.value) {
    list = list.filter(o => o.status === activeStatus.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      o =>
        (o.orderNumber || '').toLowerCase().includes(q) ||
        (o.customerName || '').toLowerCase().includes(q) ||
        (o.petName || '').toLowerCase().includes(q)
    )
  }
  return list
})

const paginatedOrders = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filteredOrders.value.slice(start, start + perPage.value)
})

const showDetailModal = ref(false)
const selectedOrder = ref(null)

const openOrderDetails = (order) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

const setStatus = (orderId, status) => {
  updateOrderStatus(orderId, status)
  toastStore.showToast(`Order ${orderId} updated to ${status}.`, 'success')
}

const getActionItems = (order) => [
  { label: 'View Order Details', icon: Eye, command: () => openOrderDetails(order) },
  { label: 'Mark Processing', icon: PackageCheck, command: () => setStatus(order.id, 'Processing') },
  { label: 'Mark Shipped', icon: Truck, command: () => setStatus(order.id, 'Shipped') },
  { label: 'Mark Delivered', icon: CheckCircle2, command: () => setStatus(order.id, 'Delivered') },
  { label: 'Cancel Order', icon: XCircle, command: () => setStatus(order.id, 'Cancelled') },
  {
    label: 'Delete',
    icon: Trash2,
    textClass: 'text-danger',
    iconClass: 'text-danger',
    command: () => {
      deleteOrder(order.id)
      toastStore.showToast(`Order ${order.orderNumber} removed.`, 'info')
    }
  }
]
</script>
