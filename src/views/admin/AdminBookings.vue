<template>
  <div class="admin-bookings-page">
    <!-- Top Header & Actions -->
    <DashboardPageTitle 
      title="Appointments & Bookings" 
      subtitle="Manage customer grooming reservations, specialist assignments, and schedules."
    >
      <BaseButton variant="primary" @click="openCreateModal">
        <Plus :size="18" />
        <span class="d-none d-sm-inline">New Appointment</span>
      </BaseButton>
    </DashboardPageTitle>

    <div class="card" style="background-color: var(--surface-ground);">
        <!-- Filters Bar -->
        <div class="mb-2 d-flex flex-column flex-xl-row align-items-xl-center gap-2 w-100 mt-2">
            <div class="flex-grow-1 overflow-auto pb-1 pb-xl-0 d-flex align-items-center gap-2" style="min-width: 0;">
                <BaseFilter v-model="activeStatus" :options="filterOptions" style="min-width: max-content;" />
            </div>

            <div class="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 flex-shrink-0">
                <div class="search-input">
                    <BaseInput 
                        v-model="searchQuery" 
                        placeholder="Search customer or pet..." 
                        :prefixIcon="Search"
                        clearable
                    />
                </div>
            </div>
        </div>

        <!-- Table -->
        <BaseTable :columns="colDefs" :rows="filteredBookings">
            <template #customer="{ data }">
                <div class="d-flex align-items-center gap-2">
                    <div class="avatar-circle d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 overflow-hidden"
                        style="width: 32px; height: 32px; background: color-mix(in srgb, var(--primary-color) 15%, transparent);">
                        <User :size="14" style="color: var(--primary-color);" />
                    </div>
                    <div class="min-w-0">
                        <div class="fw-medium" style="color: var(--text-heading-color);">
                            {{ data?.customerName }}
                        </div>
                        <div class="text-muted small">{{ data?.customerPhone }}</div>
                    </div>
                </div>
            </template>

            <template #pet="{ data }">
                <div class="d-flex flex-column">
                    <span class="fw-medium" style="color: var(--text-heading-color);">🐾 {{ data?.petName || 'Pet' }}</span>
                    <span class="text-muted small">{{ data?.petBreed || 'Standard' }}</span>
                </div>
            </template>

            <template #service="{ data }">
                <div class="d-flex flex-column">
                    <span class="fw-medium" style="color: var(--text-heading-color);">{{ data?.serviceTitle }}</span>
                    <span class="text-muted small">${{ data?.servicePrice }} · {{ data?.serviceDuration }}</span>
                </div>
            </template>

            <template #specialist="{ data }">
                <div class="d-flex align-items-center gap-2">
                    <img v-if="data?.specialistAvatar" :src="data.specialistAvatar" class="rounded-circle object-fit-cover border" style="width: 24px; height: 24px;" />
                    <span class="fw-medium text-dark small">{{ data?.specialistName }}</span>
                </div>
            </template>

            <template #date="{ data }">
                <div class="d-flex flex-column">
                    <span class="fw-medium">{{ data?.date }}</span>
                    <span class="text-muted small">{{ data?.time }}</span>
                </div>
            </template>

            <template #status="{ data }">
                <BaseBadge v-if="data?.status" :status="data.status" />
                <span v-else>—</span>
            </template>

            <template #action="{ data }">
                <BaseActionMenu :items="getBookingActionItems(data)" />
            </template>
        </BaseTable>

        <!-- Reject Reason Modal (Cancel Booking) -->
        <BaseModal v-model="showRejectModal" title="Cancel Booking Request" size="sm">
            <div class="d-flex flex-column gap-3">
                <div class="p-3 rounded-3 d-flex align-items-center gap-3"
                    style="background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.15);">
                    <XCircle :size="20" class="text-danger flex-shrink-0" />
                    <div>
                        <p class="fw-semibold m-0 small" style="color: var(--text-heading-color);">
                            {{ rejectTarget?.customerName }}
                        </p>
                        <p class="text-muted m-0 small">
                            {{ rejectTarget?.petName }} · {{ rejectTarget?.serviceTitle }} · {{ rejectTarget?.date }}
                        </p>
                    </div>
                </div>
                <BaseInput
                    v-model="rejectReason"
                    label="Cancellation Reason (optional)"
                    type="textarea"
                    placeholder="e.g. Customer requested cancellation..."
                />
            </div>
            <template #footer>
                <div class="d-flex justify-content-end gap-2 w-100">
                    <BaseButton variant="outline-primary" @click="showRejectModal = false">Keep Booking</BaseButton>
                    <BaseButton variant="danger" @click="handleReject" :disabled="isRejecting">
                        <span v-if="isRejecting" class="spinner-border spinner-border-sm me-1" role="status" />
                        Confirm Cancel
                    </BaseButton>
                </div>
            </template>
        </BaseModal>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBooking } from '../../composables/useBooking';
import { CheckCircle, XCircle, User, Search, Plus, Trash2 } from '@lucide/vue';
import BaseTable from '../../components/base/BaseTable.vue';
import BaseFilter from '../../components/base/BaseFilter.vue';
import BaseModal from '../../components/base/BaseModal.vue';
import BaseButton from '../../components/base/BaseButton.vue';
import BaseInput from '../../components/base/BaseInput.vue';
import BaseActionMenu from '../../components/base/BaseActionMenu.vue';
import BaseBadge from '../../components/base/BaseBadge.vue';
import DashboardPageTitle from '../../components/common/DashboardPageTitle.vue';

const { bookings, updateBookingStatus, cancelBooking, deleteBookingPermanent } = useBooking();

const activeStatus = ref('Confirmed');
const searchQuery = ref('');

const getBookingActionItems = (booking) => {
    const items = [];
    
    if (booking.status !== 'Confirmed' && booking.status !== 'Done') {
        items.push({
            label: 'Confirm',
            icon: CheckCircle,
            iconClass: 'text-success',
            command: () => updateBookingStatus(booking.id, 'Confirmed')
        });
    }

    if (booking.status === 'Confirmed') {
        items.push({
            label: 'Mark In Progress',
            icon: CheckCircle,
            iconClass: 'text-warning',
            command: () => updateBookingStatus(booking.id, 'In Progress')
        });
    }

    if (booking.status === 'In Progress') {
        items.push({
            label: 'Mark Done',
            icon: CheckCircle,
            iconClass: 'text-primary',
            command: () => updateBookingStatus(booking.id, 'Done')
        });
    }
    
    if (booking.status !== 'Cancelled') {
        items.push({
            label: 'Cancel',
            icon: XCircle,
            iconClass: 'text-danger',
            command: () => openRejectModal(booking)
        });
    }

    items.push({
        label: 'Delete Permanent',
        icon: Trash2,
        iconClass: 'text-danger',
        command: () => {
            if (confirm('Are you sure you want to permanently delete this booking?')) {
                deleteBookingPermanent(booking.id);
            }
        }
    });

    return items;
};

// Reject modal state
const showRejectModal = ref(false);
const rejectTarget = ref(null);
const rejectReason = ref('');
const isRejecting = ref(false);

const filterOptions = computed(() => [
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Done', value: 'Done' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'All Bookings', value: '' },
]);

const filteredBookings = computed(() => {
    return bookings.value.filter(b => {
        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase();
            const match = (b.id && b.id.toLowerCase().includes(q)) ||
                          (b.customerName && b.customerName.toLowerCase().includes(q)) ||
                          (b.customerPhone && b.customerPhone.toLowerCase().includes(q)) ||
                          (b.petName && b.petName.toLowerCase().includes(q));
            if (!match) return false;
        }
        if (activeStatus.value) {
            if ((b.status || '').toLowerCase() !== activeStatus.value.toLowerCase()) return false;
        }
        return true;
    });
});

const openRejectModal = (booking) => {
    rejectTarget.value = booking;
    rejectReason.value = '';
    showRejectModal.value = true;
};

const handleReject = () => {
    if (!rejectTarget.value) return;
    isRejecting.value = true;
    setTimeout(() => {
        cancelBooking(rejectTarget.value.id);
        showRejectModal.value = false;
        rejectTarget.value = null;
        isRejecting.value = false;
    }, 400);
};

const openCreateModal = () => {
    alert('Create flow placeholder');
};

const colDefs = [
    { field: 'customer', header: 'Customer', sortable: false },
    { field: 'pet', header: 'Pet', sortable: false },
    { field: 'service', header: 'Service', sortable: false },
    { field: 'specialist', header: 'Specialist', sortable: false },
    { field: 'date', header: 'Date & Time', sortable: false },
    { field: 'status', header: 'Status', sortable: false },
    { field: 'action', header: 'Actions', sortable: false, resizeIndicator: false },
];
</script>

<style scoped>
.min-w-0 { min-width: 0; }
.search-input { width: 100%; max-width: 250px; }
@media (min-width: 576px) {
    .search-input { width: 250px; }
}
</style>
