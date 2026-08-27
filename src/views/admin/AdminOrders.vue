<template>
  <div class="admin-orders-page">
    
    <!-- Top Header & Actions -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
      <div>
        <h3 class="fw-bolder text-dark mb-1" style="letter-spacing: -0.02em;">Orders & Fulfillment</h3>
        <p class="text-muted small mb-0">Track retail store customer orders, payment status, and delivery fulfillment.</p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button 
          type="button" 
          class="btn btn-orange rounded-pill px-3.5 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-xs"
          @click="openCreateModal"
        >
          <span>+</span>
          <span>Create Manual Order</span>
        </button>
      </div>
    </div>

    <!-- Filters and Search Bar -->
    <div class="card p-3 rounded-4 border bg-white shadow-xs mb-4">
      <div class="row g-2.5 align-items-center">
        <!-- Search Input -->
        <div class="col-12 col-md-5">
          <BaseInput 
            v-model="searchQuery" 
            placeholder="Search order #, customer, email, or address..." 
            prefixIcon="🔍"
            :clearable="true"
          />
        </div>

        <!-- Status Filter -->
        <div class="col-12 col-md-4">
          <BaseSelect 
            v-model="selectedStatus" 
            :options="statusFilterOptions"
            placeholder="All Fulfillment Statuses"
          />
        </div>

        <!-- Count -->
        <div class="col-12 col-md-3 text-md-end">
          <span class="text-muted small fw-semibold">
            {{ filteredOrders.length }} Orders Found
          </span>
        </div>
      </div>
    </div>

    <!-- Orders BaseTable -->
    <BaseTable 
      :columns="tableColumns" 
      :rows="filteredOrders"
      :paginated="true"
      :perPage="6"
      :showIndex="true"
    >
      <!-- Order Info Column -->
      <template #order="{ row }">
        <div>
          <strong class="text-dark small d-block">{{ row.orderNumber }}</strong>
          <span class="text-muted" style="font-size: 0.74rem;">
            {{ new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
          </span>
        </div>
      </template>

      <!-- Customer Column -->
      <template #customer="{ row }">
        <div>
          <strong class="text-dark small d-block">{{ row.customerName }}</strong>
          <span class="text-muted" style="font-size: 0.74rem;">{{ row.customerPhone }} • {{ row.petName }}</span>
        </div>
      </template>

      <!-- Items Column -->
      <template #items="{ row }">
        <div>
          <span class="small fw-semibold text-dark d-block">
            {{ (row.items || []).length }} item(s)
          </span>
          <span class="text-muted text-truncate d-block small" style="max-width: 220px; font-size: 0.74rem;">
            {{ (row.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ') }}
          </span>
        </div>
      </template>

      <!-- Total Column -->
      <template #total="{ row }">
        <div>
          <strong class="text-dark fs-6 d-block">${{ row.total.toFixed(2) }}</strong>
          <span 
            class="badge rounded-pill fw-bold"
            :class="row.paymentStatus === 'Paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'"
            style="font-size: 0.65rem;"
          >
            {{ row.paymentStatus }} ({{ row.paymentMethod || 'Card' }})
          </span>
        </div>
      </template>

      <!-- Status Column -->
      <template #status="{ row }">
        <div class="dropdown">
          <button 
            class="btn btn-sm p-0 border-0 dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <span 
              class="badge rounded-pill fw-bold"
              :class="getStatusBadgeClass(row.status)"
              style="font-size: 0.72rem;"
            >
              ● {{ row.status }}
            </span>
          </button>
          <ul class="dropdown-menu shadow-sm border rounded-3 p-1">
            <li><a class="dropdown-item small rounded-2 py-1" href="#" @click.prevent="updateOrderStatus(row.id, 'Pending')">🟡 Pending</a></li>
            <li><a class="dropdown-item small rounded-2 py-1" href="#" @click.prevent="updateOrderStatus(row.id, 'Processing')">🔵 Processing</a></li>
            <li><a class="dropdown-item small rounded-2 py-1" href="#" @click.prevent="updateOrderStatus(row.id, 'Shipped')">🚚 Shipped</a></li>
            <li><a class="dropdown-item small rounded-2 py-1" href="#" @click.prevent="updateOrderStatus(row.id, 'Delivered')">🟢 Delivered</a></li>
            <li><hr class="dropdown-divider my-1"></li>
            <li><a class="dropdown-item small text-danger rounded-2 py-1" href="#" @click.prevent="updateOrderStatus(row.id, 'Cancelled')">🔴 Cancelled</a></li>
          </ul>
        </div>
      </template>

      <!-- Actions Column -->
      <template #actions="{ row }">
        <div class="d-flex align-items-center justify-content-end gap-1.5">
          <button 
            type="button" 
            class="btn btn-sm btn-light border rounded-pill px-2.5 py-1 text-muted"
            @click="viewOrderDetails(row)"
            title="View Receipt"
          >
            👁️ Invoice
          </button>
          <button 
            type="button" 
            class="btn btn-sm btn-light border rounded-pill px-2 py-1 text-danger"
            @click="confirmDelete(row)"
            title="Delete Order"
          >
            🗑️
          </button>
        </div>
      </template>
    </BaseTable>

    <!-- 1. View Order Invoice / Details Modal -->
    <BaseModal 
      v-model="isDetailModalOpen" 
      :title="`Order Details: ${selectedOrder?.orderNumber || ''}`"
      size="lg"
    >
      <div v-if="selectedOrder" class="d-flex flex-column gap-3">
        <!-- Order Header Overview -->
        <div class="p-3 bg-light rounded-3 border d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div>
            <span class="text-muted small d-block">Placed on</span>
            <strong class="text-dark small">{{ new Date(selectedOrder.createdAt).toLocaleString() }}</strong>
          </div>
          <div>
            <span class="text-muted small d-block">Payment Method</span>
            <strong class="text-dark small">{{ selectedOrder.paymentMethod }} ({{ selectedOrder.paymentStatus }})</strong>
          </div>
          <div>
            <span class="text-muted small d-block">Fulfillment Status</span>
            <span class="badge rounded-pill fw-bold" :class="getStatusBadgeClass(selectedOrder.status)">
              {{ selectedOrder.status }}
            </span>
          </div>
        </div>

        <!-- Customer & Delivery Address -->
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <div class="p-3 bg-white border rounded-3 h-100">
              <span class="text-muted small fw-bold text-uppercase d-block mb-1">Customer Info</span>
              <strong class="text-dark d-block">{{ selectedOrder.customerName }}</strong>
              <span class="text-muted small d-block">{{ selectedOrder.customerEmail }}</span>
              <span class="text-muted small d-block">{{ selectedOrder.customerPhone }}</span>
              <span class="text-orange small fw-semibold d-block mt-1">🐾 {{ selectedOrder.petName }}</span>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="p-3 bg-white border rounded-3 h-100">
              <span class="text-muted small fw-bold text-uppercase d-block mb-1">Delivery Destination</span>
              <p class="text-dark small mb-0">{{ selectedOrder.address }}</p>
            </div>
          </div>
        </div>

        <!-- Order Items Breakdown -->
        <div class="border rounded-3 overflow-hidden">
          <table class="table mb-0 align-middle">
            <thead class="table-light border-bottom">
              <tr>
                <th class="small fw-bold text-muted ps-3 py-2">Item Description</th>
                <th class="small fw-bold text-muted text-center py-2">Qty</th>
                <th class="small fw-bold text-muted text-end pe-3 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in selectedOrder.items" :key="idx">
                <td class="ps-3 py-2">
                  <strong class="text-dark small d-block">{{ item.name }}</strong>
                </td>
                <td class="text-center py-2 small fw-semibold">{{ item.quantity }}</td>
                <td class="text-end pe-3 py-2 small fw-bold text-dark">${{ (item.price * item.quantity).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total Calculation Box -->
        <div class="p-3 bg-light rounded-3 border ms-auto" style="max-width: 300px; width: 100%;">
          <div class="d-flex justify-content-between mb-1 small">
            <span class="text-muted">Subtotal:</span>
            <span class="fw-semibold text-dark">${{ (selectedOrder.subtotal || selectedOrder.total).toFixed(2) }}</span>
          </div>
          <div v-if="selectedOrder.discount" class="d-flex justify-content-between mb-1 small text-success">
            <span>Promo Discount:</span>
            <span>-${{ selectedOrder.discount.toFixed(2) }}</span>
          </div>
          <div class="d-flex justify-content-between mb-1 small">
            <span class="text-muted">Delivery Fee:</span>
            <span class="fw-semibold text-dark">${{ (selectedOrder.shippingFee || 0).toFixed(2) }}</span>
          </div>
          <hr class="my-1.5 opacity-10" />
          <div class="d-flex justify-content-between fs-6">
            <strong class="text-dark">Total Paid:</strong>
            <strong class="text-orange">${{ selectedOrder.total.toFixed(2) }}</strong>
          </div>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" @click="isDetailModalOpen = false">
          Close
        </button>
      </template>
    </BaseModal>

    <!-- 2. Manual Order Modal -->
    <BaseModal 
      v-model="isCreateModalOpen" 
      title="Create Manual Order"
      size="md"
    >
      <form @submit.prevent="saveNewOrder" class="row g-3">
        <div class="col-12 col-md-6">
          <BaseInput 
            v-model="manualForm.customerName" 
            label="Customer Name" 
            placeholder="e.g. Alisa Gitten"
            :required="true"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput 
            v-model="manualForm.customerPhone" 
            label="Phone" 
            placeholder="+4 079..."
            :required="true"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput 
            v-model="manualForm.petName" 
            label="Pet Information" 
            placeholder="e.g. Bella (Dog)"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput 
            v-model="manualForm.total" 
            type="number"
            label="Total Amount ($)" 
            placeholder="45.00"
            :required="true"
          />
        </div>
        <div class="col-12">
          <BaseInput 
            v-model="manualForm.address" 
            label="Delivery Address" 
            placeholder="Street address..."
            :required="true"
          />
        </div>
        <div class="col-12">
          <BaseInput 
            v-model="manualForm.itemName" 
            label="Items Summary" 
            placeholder="e.g. 1x Pet Shampoo, 2x Dog Toy"
            :required="true"
          />
        </div>
      </form>

      <template #footer>
        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" @click="isCreateModalOpen = false">
          Cancel
        </button>
        <button type="button" class="btn btn-orange rounded-pill px-4 fw-semibold" @click="saveNewOrder">
          Create Order
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import BaseTable from '../../components/base/BaseTable.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseModal from '../../components/base/BaseModal.vue'
import { useAdmin } from '../../composables/useAdmin'

const { orders, updateOrderStatus, addOrder, deleteOrder } = useAdmin()

const searchQuery = ref('')
const selectedStatus = ref('')
const isDetailModalOpen = ref(false)
const isCreateModalOpen = ref(false)
const selectedOrder = ref(null)

const manualForm = reactive({
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  petName: '',
  total: 45.00,
  address: '',
  itemName: '1x Tiki Organic Shampoo (500ml)'
})

const tableColumns = [
  { key: 'order', label: 'Order # & Date' },
  { key: 'customer', label: 'Customer' },
  { key: 'items', label: 'Purchased Items' },
  { key: 'total', label: 'Total Amount', sortable: true },
  { key: 'status', label: 'Fulfillment' }
]

const statusFilterOptions = [
  { label: 'All Fulfillment Statuses', value: '' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Cancelled', value: 'Cancelled' }
]

const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const match = (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
                    (o.customerName && o.customerName.toLowerCase().includes(q)) ||
                    (o.customerPhone && o.customerPhone.toLowerCase().includes(q)) ||
                    (o.address && o.address.toLowerCase().includes(q))
      if (!match) return false
    }

    if (selectedStatus.value) {
      if (o.status.toLowerCase() !== selectedStatus.value.toLowerCase()) return false
    }

    return true
  })
})

const getStatusBadgeClass = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'delivered':
      return 'bg-success-subtle text-success border border-success-subtle'
    case 'shipped':
      return 'bg-info-subtle text-info border border-info-subtle'
    case 'processing':
      return 'bg-primary-subtle text-primary border border-primary-subtle'
    case 'pending':
      return 'bg-warning-subtle text-warning border border-warning-subtle'
    case 'cancelled':
      return 'bg-danger-subtle text-danger border border-danger-subtle'
    default:
      return 'bg-secondary-subtle text-secondary'
  }
}

const viewOrderDetails = (row) => {
  selectedOrder.value = row
  isDetailModalOpen.value = true
}

const openCreateModal = () => {
  manualForm.customerName = ''
  manualForm.customerPhone = ''
  manualForm.customerEmail = ''
  manualForm.petName = ''
  manualForm.total = 45.00
  manualForm.address = 'Phnom Penh, Cambodia'
  manualForm.itemName = '1x Tiki Organic Shampoo (500ml)'
  isCreateModalOpen.value = true
}

const saveNewOrder = () => {
  if (!manualForm.customerName || !manualForm.total) return

  addOrder({
    customerName: manualForm.customerName,
    customerPhone: manualForm.customerPhone,
    customerEmail: manualForm.customerEmail || `${manualForm.customerName.toLowerCase().replace(/\s+/g, '.')}@sample.com`,
    petName: manualForm.petName || 'Dog / Cat',
    items: [
      { name: manualForm.itemName, quantity: 1, price: Number(manualForm.total) }
    ],
    subtotal: Number(manualForm.total),
    discount: 0,
    shippingFee: 0,
    total: Number(manualForm.total),
    status: 'Processing',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash on Delivery',
    address: manualForm.address
  })

  isCreateModalOpen.value = false
}

const confirmDelete = (row) => {
  if (confirm(`Are you sure you want to delete order ${row.orderNumber}?`)) {
    deleteOrder(row.id)
  }
}
</script>

<style scoped>
.btn-orange {
  background-color: #EA7A38;
  color: #ffffff;
  border-color: #EA7A38;
}

.btn-orange:hover {
  background-color: #d96928;
  color: #ffffff;
}

.text-orange {
  color: #EA7A38 !important;
}

[data-theme="dark"] .card {
  background-color: var(--card-bg-color, #1e293b);
  border-color: rgba(255, 255, 255, 0.08) !important;
}

[data-theme="dark"] .bg-light {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
