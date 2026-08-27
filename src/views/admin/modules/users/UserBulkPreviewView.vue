<template>
    <div style="background-color: var(--surface-ground);">
        <div class="mb-2 d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-2 w-100">
            <div class="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 flex-shrink-0">
                <div class="search-input">
                    <BaseInput 
                        v-model="searchQuery" 
                        placeholder="Search users..." 
                        :prefixIcon="Search"
                        clearable
                    />
                </div>

                <div class="status-select">
                    <BaseSelect 
                        v-model="bulkRoleId" 
                        :options="bulkRoles" 
                        placeholder="Select Role" 
                        required 
                        :error="bulkRoleError" 
                    />
                </div>
            </div>

            <div class="d-flex align-items-center gap-2">
                <BaseButton variant="outline-primary" class="text-nowrap" @click="onCancel()">
                    Cancel
                </BaseButton>
                <BaseButton :isLoading="isLoading" variant="primary" class="text-nowrap" @click="handleConfirm()">
                    {{ isLoading ? 'Importing...' : 'Confirm Import' }}
                </BaseButton>
            </div>
        </div>

        <BaseTable 
            :columns="colDefs" 
            :rows="paginatedUsers" 
            :loading="false"
            :total-records="filteredUsers.length"
            v-model:page="currentPage"
            v-model:per-page="perPage"
            :show-index="true"
        >
            <template #role>
                <div class="d-flex align-items-center gap-1">
                    <span class="fw-medium text-primary">
                        {{ selectedRoleName }}
                    </span>
                </div>
            </template>
            <template #email="{ data }">
                <span class="text-muted">{{ data.firstName.toLowerCase() }}.{{ data.lastName.toLowerCase() }}.****@ant.com</span>
            </template>
            <template #action="{ data }">
                <button class="btn btn-sm border-0 text-danger d-flex align-items-center justify-content-center" @click="removeUser(data)" v-tooltip="'Remove'">
                    <Trash2 :size="16" />
                </button>
            </template>
        </BaseTable>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/users/user';
import { useToastStore } from '@/stores/toast';
import { Search, Trash2 } from '@lucide/vue';

const emit = defineEmits(['close']);
const userStore = useUserStore();
const toastStore = useToastStore();

const colDefs = [
    { field: 'firstName', header: 'First Name', sortable: false },
    { field: 'lastName', header: 'Last Name', sortable: false },
    { field: 'role', header: 'Role', sortable: false },
    { field: 'email', header: 'Preview Email', sortable: false },
    { field: 'action', header: 'Action', sortable: false }
];

const isLoading = ref(false);
const bulkRoleId = ref(3);
const bulkRoleError = ref('');
const searchQuery = ref('');

const filteredUsers = computed(() => {
    if (!searchQuery.value) {
        return userStore.parsedBulkUsers;
    }
    const q = searchQuery.value.toLowerCase();
    return userStore.parsedBulkUsers.filter(u => 
        u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q)
    );
});

const currentPage = ref(1);
const perPage = ref(10);

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return filteredUsers.value.slice(start, end);
});

const bulkRoles = computed(() => {
    return userStore.userRoles
        .filter(r => r.id === 2 || r.id === 3)
        .map(r => ({ label: r.name, value: r.id }));
});

const selectedRoleName = computed(() => {
    const role = userStore.userRoles.find(r => r.id === bulkRoleId.value);
    return role ? role.name : 'Unknown';
});

const removeUser = (user) => {
    const idx = userStore.parsedBulkUsers.indexOf(user);
    if (idx !== -1) {
        userStore.parsedBulkUsers.splice(idx, 1);
        if (userStore.parsedBulkUsers.length === 0) {
            onCancel(); // Close if empty
        }
    }
};

const onCancel = () => {
    userStore.parsedBulkUsers = [];
    emit('close');
};

const handleConfirm = async () => {
    isLoading.value = true;
    try {
        const payload = {
            roleId: bulkRoleId.value,
            users: userStore.parsedBulkUsers
        };
        const success = await userStore.bulkRegister(payload);
        if (success) {
            userStore.parsedBulkUsers = [];
            userStore.getAllUsers();
            emit('close');
        }
    } finally {
        isLoading.value = false;
    }
};
</script>
