<template>
    <div style="background-color: var(--surface-ground);">
        <div class="mb-2 d-flex flex-column flex-xl-row align-items-xl-center gap-2 w-100">
            <div class="flex-grow-1 overflow-auto pb-1 pb-xl-0 d-flex align-items-center gap-2" style="min-width: 0;">
                <BaseButton v-if="hasActiveFilters" @click="resetFilters" variant="outline-danger" v-tooltip.top="'Reset Filters'" class="flex-shrink-0">
                    <FilterX :size="16" />
                </BaseButton>
                <BaseFilter v-model="activeFilter" :options="filterOptions" style="min-width: max-content;" />
            </div>
            
            <div class="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 flex-shrink-0">
                
                <div class="search-input">
                    <BaseInput 
                        v-model="searchAndFilter.searchQuery.value" 
                        placeholder="Search users..." 
                        :prefixIcon="Search"
                        clearable
                    />
                </div>

                <div class="status-select">
                    <BaseSelect 
                        v-model="searchAndFilter.filters.value.isActive" 
                        :options="statusOptions"
                        placeholder="Status"
                    >
                        <template #value="slotProps">
                            <BaseBadge v-if="slotProps.value === true" status="ACTIVE" pill size="sm" />
                            <BaseBadge v-else-if="slotProps.value === false" status="INACTIVE" pill size="sm" />
                            <span v-else class="text-muted">Status</span>
                        </template>
                        <template #option="slotProps">
                            <BaseBadge v-if="slotProps.option.value === true" status="ACTIVE" pill size="sm" />
                            <BaseBadge v-else-if="slotProps.option.value === false" status="INACTIVE" pill size="sm" />
                            <span v-else>{{ slotProps.option.label }}</span>
                        </template>
                    </BaseSelect>
                </div>
                


                <input type="file" accept=".csv" ref="csvInputRef" @change="onFileSelected" style="display: none;" />
                <BaseButton :disabled="userStore.isLoading" @click="triggerFileInput" variant="outline-primary"
                    class="btn d-flex align-items-center gap-2 text-nowrap" v-tooltip="'Import CSV'">
                    <FileDown class="text-success" :size="16" />
                </BaseButton>
                <BaseButton :disabled="userStore.isLoading" @click="$emit('new')"
                    class="btn btn-primary text-nowrap">
                    Add New User
                </BaseButton>
            </div>
        </div>
        <BaseTable :columns="colDefs" :rows="userStore.users" :loading="userStore.isLoading"
            :total-records="userStore.totalItems" v-model:page="userStore.page" v-model:per-page="userStore.perPage"
            v-model:sort-by="userStore.sortBy" v-model:sort-order="userStore.sortOrder"
            @refresh-data="userStore.getAllUsers"
            :rowClass="getUserRowClass">

            <template #username="{ data }">
                <div class="d-flex align-items-center gap-3">
                    <div>
                    <div class="user-profile-avatar d-flex align-items-center justify-content-center text-muted"
                        style="border-radius: 50%;">
                        <img v-if="data?.profile?.avatarUrl" :src="$authImg(data.profile.avatarUrl)" class="img-fluid"
                            style="border-radius: 50%;">
                        <User v-else :size="20" />
                    </div>
                    </div>
                    <div class="d-flex flex-column align-items-start" style="min-width: 0;">
                        <span class="fw-medium truncate-1-line" :title="data?.firstName + ' ' + data?.lastName">{{ data?.firstName + " " + data?.lastName }}</span>
                    </div>
                </div>
            </template>

            <template #email="{ data }">
                <span :class="[`text-${getRoleVariant(data?.role?.id)}`]" class="truncate-1-line" :title="data?.email">
                    {{ data?.email }}
                </span>
            </template>

            <template #role="{ data }">
                <BaseBadge 
                    v-if="data?.role"
                    :variant="getRoleVariant(data.role.id)" 
                    :label="data.role.name" 
                    :icon="getRoleIcon(data.role.id)" 
                    pill 
                    size="sm" 
                />
            </template>

            <template #createdAt="{ data }">
                <span v-if="data?.createdAt">{{ formatDate(data.createdAt) }}</span>
            </template>
            <template #isActive="{ data }">
                <BaseBadge 
                    :status="data?.isActive ? 'ACTIVE' : 'INACTIVE'" 
                    pill 
                    size="sm" 
                    :loading="targetStatusUser?.id === data.id && isUpdatingStatus"
                />
            </template>

            <template #action="{ data }">
                <BaseActionMenu :items="getActionItems(data)" />
            </template>
        </BaseTable>
    </div>

    <BaseDrawer v-model="showUserDetail" title="Details" width="30rem">
        <UserDetailView v-if="showUserDetail" :user="userDetail" />
    </BaseDrawer>

    <BaseModal v-model="showResetModal" title="Reset Password" size="sm">
        <div class="text-center">
            <p class="mb-4 fw-medium text-muted">Are you sure you want to reset this user's password?</p>
            <div class="d-flex gap-2">
                <BaseButton variant="outline-warning" type="button" class="flex-grow-1"
                    @click="cancelResetPassword()">
                    Cancel
                </BaseButton>
                <BaseButton variant="warning" type="button" class="flex-grow-1" @click="confirmResetPassword()" :isLoading="isReseting">
                    {{ isReseting ? 'Reseting...' : 'Reset Now' }}
                </BaseButton>
            </div>
        </div>
    </BaseModal>

    <BaseModal v-model="showStatusModal" :title="targetStatusUser?.isActive ? 'Deactivate User' : 'Activate User'" size="sm">
        <div class="text-center">
            <div class="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle" 
                 :class="targetStatusUser?.isActive ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'" 
                 style="width: 60px; height: 60px;">
                <X v-if="targetStatusUser?.isActive" :size="28" />
                <Check v-else :size="28" />
            </div>
            <p class="mb-4 fw-medium text-muted">
                Are you sure you want to {{ targetStatusUser?.isActive ? 'deactivate' : 'activate' }}
                <strong class="text-base">{{ targetStatusUser?.firstName }} {{ targetStatusUser?.lastName }}</strong>?
            </p>
            <div class="d-flex gap-2">
                <BaseButton :variant="targetStatusUser?.isActive ? 'outline-danger' : 'outline-success'" type="button" class="flex-grow-1"
                    @click="showStatusModal = false">
                    Cancel
                </BaseButton>
                <BaseButton :variant="targetStatusUser?.isActive ? 'danger' : 'success'" type="button" class="flex-grow-1" 
                    @click="confirmStatusChange()" :is-Loading="isUpdatingStatus">
                    {{ isUpdatingStatus ? 'Updating...' : (targetStatusUser?.isActive ? 'Deactivate Now' : 'Activate Now') }}
                </BaseButton>
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
const emit = defineEmits(['new', 'edit', 'import', 'preview-bulk']);
import { useUserStore } from '@/stores/users/user.js';
import { onMounted, ref, computed } from 'vue';
import { formatDate } from '@/utils/dateFormat';
import { BadgeCheck, Info, User, KeyRound, Search, FileDown, Check, X, BookOpen, FilterX } from '@lucide/vue';
import UserDetailView from './UserDetailView.vue';
import { useAuthStore } from '@/stores/auth.js';
import { useToastStore } from '@/stores/toast.js';
import { useUserList } from '@/composables/users/useUserList.js';
import Papa from 'papaparse';

// Base Component Imports
import BaseButton from '@/components/base/BaseButton.vue';
import BaseFilter from '@/components/base/BaseFilter.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';
import BaseBadge from '@/components/base/BaseBadge.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import BaseActionMenu from '@/components/base/BaseActionMenu.vue';
import BaseDrawer from '@/components/base/BaseDrawer.vue';
import BaseModal from '@/components/base/BaseModal.vue';

const userStore = useUserStore();
const authStore = useAuthStore();
const toastStore = useToastStore();

const {
    showResetModal,
    showUserDetail,
    userDetail,
    isLoading,
    onViewDetail,
    onResetPassword,
    handleResetPassword,
    onCancelReset,
    searchAndFilter
} = useUserList(userStore, authStore, toastStore);

const activeFilter = computed({
    get: () => searchAndFilter.filters.value.roleId,
    set: (val) => {
        searchAndFilter.filters.value.roleId = val;
    }
});

const hasActiveFilters = computed(() => {
    return !!searchAndFilter.searchQuery.value || 
           searchAndFilter.filters.value.isActive !== null || 
           searchAndFilter.filters.value.roleId !== null;
});

const resetFilters = () => {
    searchAndFilter.searchQuery.value = '';
    searchAndFilter.filters.value.isActive = null;
    searchAndFilter.filters.value.roleId = null;
};

const csvInputRef = ref(null);

const triggerFileInput = () => {
    if (csvInputRef.value) {
        csvInputRef.value.click();
    }
};

const onFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toastStore.showToast('Only CSV files are allowed.', 'danger');
        e.target.value = '';
        return;
    }

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            if (results.errors.length) {
                toastStore.showToast('Error parsing CSV file.', 'danger');
                e.target.value = '';
                return;
            }
            
            const fields = results.meta.fields || [];
            if (!fields.includes('firstName') || !fields.includes('lastName')) {
                toastStore.showToast('CSV must contain "firstName" and "lastName" headers.', 'danger');
                e.target.value = '';
                return;
            }

            const users = results.data
                .filter(row => row.firstName?.trim() && row.lastName?.trim())
                .map(row => ({
                    firstName: row.firstName.trim(),
                    lastName: row.lastName.trim()
                }));
            
            if (users.length === 0) {
                toastStore.showToast('No valid users found in CSV.', 'danger');
                e.target.value = '';
                return;
            }

            userStore.parsedBulkUsers = users;
            emit('preview-bulk');
            e.target.value = '';
        },
        error: () => {
            toastStore.showToast('Error reading the file.', 'danger');
            e.target.value = '';
        }
    });
};

const filterOptions = computed(() => [
    { label: 'All Users', value: null, badge: userStore.roleStats['all'], variant: 'primary' },
    { label: 'Admin', value: 1, badge: userStore.roleStats[1], variant: 'success' },
    { label: 'Teacher', value: 2, badge: userStore.roleStats[2], variant: 'info' },
    { label: 'Student', value: 3, badge: userStore.roleStats[3], variant: 'secondary' }
]);

const statusOptions = ref([
    { label: 'All Status', value: null },
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
]);

const getRoleVariant = (roleId) => {
    switch(roleId) {
        case 1: return 'success';
        case 2: return 'info';
        case 3: return 'secondary';
        default: return 'secondary';
    }
};

const getRoleIcon = (roleId) => {
    switch(roleId) {
        case 1: return BadgeCheck;
        case 2: return BookOpen;
        case 3: return User;
        default: return User;
    }
};

const getUserRowClass = (data) => {
    return (data && data.id && data.isActive === false) ? 'row-border-secondary opacity-75' : '';
};

const isReseting = ref(false);

const toggleReset = (event, id) => {
    onResetPassword(id);
    showResetModal.value = true;
}

const getActionItems = (data) => [
    {
        label: 'View Details',
        icon: Info,
        command: () => onViewDetail(data),
    },
    {
        label: data.isActive ? 'Deactivate User' : 'Activate User',
        icon: data.isActive ? X : Check,
        command: () => promptToggleStatus(data),
        iconClass: data.isActive ? 'text-danger' : 'text-success'
    },
    {
        label: 'Reset Password',
        icon: KeyRound,
        command: ({ originalEvent }) => toggleReset(originalEvent, data.id),
        iconClass: 'text-warning'
    }
];

const confirmResetPassword = async () => {
    isReseting.value = true;
    await handleResetPassword();
    isReseting.value = false;
    showResetModal.value = false;
}

const cancelResetPassword = () => {
    onCancelReset();
    showResetModal.value = false;
}

const showStatusModal = ref(false);
const targetStatusUser = ref(null);
const isUpdatingStatus = ref(false);

const promptToggleStatus = (data) => {
    const isCurrentUser = (authStore?.user?.id === data?.id) && (authStore?.user?.role?.id === 1);
    if (isCurrentUser) {
        toastStore.showToast("Cannot update current user's status", 'warning');
        return;
    }
    targetStatusUser.value = data;
    showStatusModal.value = true;
};

const confirmStatusChange = async () => {
    if (!targetStatusUser.value) return;
    const data = targetStatusUser.value;
    
    isUpdatingStatus.value = true;

    const originalStatus = data.isActive;
    const newStatus = !originalStatus;

    const payload = {
        isActive: newStatus
    };

    const result = await userStore.updateUser(data.id, payload);

    if (result !== false) {
        data.isActive = newStatus;
    }

    isUpdatingStatus.value = false;
    showStatusModal.value = false;
    targetStatusUser.value = null;
};

onMounted(async () => {
    userStore.fetchRoleStats();
    await Promise.all([
        userStore.getAllUsers(),
        userStore.getUserRoles()
    ]);
});

const colDefs = [
    { field: 'username', header: 'User' },
    { field: 'email', header: 'Email Address' },
    { field: 'role', header: 'Role', sortable: false },
    { field: 'isActive', header: 'Status' },
    { field: 'createdAt', header: 'Joined On' },
    { field: 'action', header: '', sortable: false },
];
</script>

<style scoped>
.user-profile-avatar {
    width: 35px;
    height: 35px;
    background-color: var(--surface-ground);
    border-radius: 50px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: var(--border-width) solid var(--border-clr);
}

.user-profile-avatar img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.status-select,
.search-input {
    width: 100%;
}

@media (min-width: 576px) {
    .status-select {
        width: 150px;
    }
    .search-input {
        width: 300px;
    }
}
</style>