import api from "@/api/api";
import { handleApiError } from "@/utils/apiError";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "../toast";

export const useUserStore = defineStore('user', () => {
    const toastStore = useToastStore()
    const users = ref([]);
    const pendingUsers = ref([]);
    const user = ref(null);
    const userRoles = ref([]);
    const parsedBulkUsers = ref([]);
    const isLoading = ref(false);
    const queryCache = new Map();
    const clearCache = () => {
        queryCache.clear();
        roleStats.value = { 'all': '...', 1: '...', 2: '...', 3: '...' };
        fetchRoleStats(true);
    };

    const roleStats = ref({ 'all': '...', 1: '...', 2: '...', 3: '...' });

    const fetchRoleStats = async (forceRefresh = false) => {
        if (!forceRefresh && roleStats.value['all'] !== '...') return;
        try {
            const roles = [null, 1, 2, 3]; // null for 'All Users'
            const promises = roles.map(roleId => {
                const params = { _per_page: 10, _page: 1 };
                if (roleId) params.roleId = roleId;
                return api.get('user', { params });
            });
            const results = await Promise.all(promises);

            results.forEach((res, index) => {
                const roleKey = roles[index] === null ? 'all' : roles[index];
                const meta = res?.data?.data?.meta;
                if (meta) {
                    roleStats.value[roleKey] = String(meta.totalItems || 0);
                }
            });
        } catch (e) {
            console.error("Failed to fetch role stats", e);
        }
    };

    const page = ref(1);
    const perPage = ref(10);
    const totalItems = ref(0);
    const totalPages = ref(1);

    const pendingPage = ref(1);
    const pendingPerPage = ref(10);
    const pendingTotalItems = ref(0);
    const pendingTotalPages = ref(1);
    const pendingSearch = ref('');
    const pendingSortDir = ref('desc');
    const pendingSortBy = ref('createdAt');

    const sortBy = ref('id');
    const sortOrder = ref('asc');
    const search = ref('');
    const filters = ref({});

    const getAllUsers = async (options = {}) => {
        const { showLoading = null, forceRefresh = false, ...extraParams } = options;
        const shouldLoad = showLoading !== null ? showLoading : users.value.length === 0;

        const params = Object.assign({
            _page: page.value,
            _per_page: perPage.value,
            sortBy: sortBy.value,
            sortDir: sortOrder.value,
            search: search.value || undefined,
            ...filters.value
        }, extraParams || {});

        const cacheKey = 'users_' + JSON.stringify(params);

        if (!forceRefresh && queryCache.has(cacheKey)) {
            const cached = queryCache.get(cacheKey);
            users.value = cached.users;
            if (cached.meta) {
                totalItems.value = cached.meta.totalItems;
                totalPages.value = cached.meta.totalPages || 1;
                page.value = cached.meta.page;
            }
            return cached.users;
        }

        try {
            if (shouldLoad) isLoading.value = true;

            const response = await api.get('user', { params });

            const data = response?.data?.data?.users || [];
            users.value = data;

            const meta = response?.data?.data?.meta;
            if (meta) {
                totalItems.value = meta.totalItems;
                totalPages.value = meta.totalPages || 1;
                page.value = meta.page;
            }

            queryCache.set(cacheKey, { users: data, meta });

            return data;
        } catch (error) {
            handleApiError(error, toastStore);
            throw error;
        } finally {
            if (shouldLoad) isLoading.value = false;
        }
    };

    const getAllPendingUsers = async (options = {}) => {
        const { showLoading = null, forceRefresh = false, ...extraParams } = options;
        const shouldLoad = showLoading !== null ? showLoading : pendingUsers.value.length === 0;

        const params = Object.assign({
            _page: pendingPage.value,
            _per_page: pendingPerPage.value,
            limit: pendingPerPage.value,
            per_page: pendingPerPage.value,
            search: pendingSearch.value || undefined,
            sortDir: pendingSortDir.value,
            sortBy: pendingSortBy.value
        }, extraParams || {});

        const cacheKey = 'pending_' + JSON.stringify(params);
        if (!forceRefresh && queryCache.has(cacheKey)) {
            const cached = queryCache.get(cacheKey);
            if (options.append) {
                pendingUsers.value = [...pendingUsers.value, ...cached.users];
            } else {
                pendingUsers.value = cached.users;
            }
            if (cached.meta) {
                pendingTotalItems.value = cached.meta.totalItems;
                pendingTotalPages.value = cached.meta.totalPages || 1;
                pendingPage.value = cached.meta.page;
            }
            return true;
        }

        try {
            if (shouldLoad) isLoading.value = true;

            const res = await api.get('user/pending-register', { params })
            const data = res?.data?.data?.users || [];
            if (options.append) {
                pendingUsers.value = [...pendingUsers.value, ...data];
            } else {
                pendingUsers.value = data;
            }

            const meta = res?.data?.data?.meta;
            if (meta) {
                pendingTotalItems.value = meta.totalItems;
                pendingTotalPages.value = meta.totalPages || 1;
                pendingPage.value = meta.page;
            }

            queryCache.set(cacheKey, { users: data, meta });
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            if (shouldLoad) isLoading.value = false;
        }
    }

    const resendVerificationEmail = async (email) => {
        try {
            if (!email) throw new Error('Email is required!');
            const res = await api.post('auth/resend-verification', email)
            toastStore.showToast(res?.data?.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const getUserRoles = async () => {
        try {
            const response = await api.get('roles');
            const data = response?.data?.data?.roles || [];
            userRoles.value = data;
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        }
    }

    const getUserById = async (id) => {
        try {
            const response = await api.get(`user/${id}`);
            const data = response?.data?.data || null;
            user.value = data;
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const createUser = async (payload) => {
        try {
            const res = await api.post('auth/request-register', payload);
            toastStore.showToast(res?.data?.message, 'success')
            clearCache();
            await fetchRoleStats();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const bulkRegister = async (payload) => {
        try {
            const res = await api.post('auth/bulk-register', payload);
            toastStore.showToast(res?.data?.message, 'success')
            clearCache();
            await fetchRoleStats();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const requestRegisterAdmin = async (token) => {
        try {
            const res = await api.post(`auth/register-admin`, token)
            toastStore.showToast(res?.data?.message, 'success')
            clearCache();
            return res?.data?.data || res?.data || true;
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        }
    }

    const updateUser = async (id, payload) => {
        try {
            const res = await api.put(`user/${id}`, payload);
            toastStore.showToast(res?.data?.message, 'success');
            clearCache();
            await fetchRoleStats();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const resetUserPassword = async (id) => {
        try {
            const response = await api.put(`user/reset-password/${id}`);
            toastStore.showToast(response?.data?.message, 'success');
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const uploadProfileAvatar = async (formData) => {
        try {
            const res = await api.post('profile/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const deleteProfileAvatar = async () => {
        try {
            const res = await api.delete('profile/avatar');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const requestTelegramLink = async () => {
        try {
            const response = await api.get('profile/telegram/request-link');
            toastStore.showToast(response?.data?.message, 'success');
            return response?.data?.data;
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        }
    }

    const unlinkTelegram = async () => {
        try {
            const response = await api.delete('profile/telegram/unlink');
            toastStore.showToast(response?.data?.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const getNotificationSettings = async () => {
        try {
            const response = await api.get('profile/notifications/settings');
            return response?.data?.data || null;
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        }
    }

    const updateNotificationSettings = async (payload) => {
        try {
            const response = await api.put('profile/notifications/settings', payload);
            toastStore.showToast(response?.data?.message || 'Settings updated successfully', 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    return {
        getAllUsers,
        getAllPendingUsers,
        resendVerificationEmail,
        getUserById,
        getUserRoles,
        createUser,
        bulkRegister,
        requestRegisterAdmin,
        updateUser,
        resetUserPassword,
        uploadProfileAvatar,
        deleteProfileAvatar,
        requestTelegramLink,
        unlinkTelegram,
        getNotificationSettings,
        updateNotificationSettings,

        users,
        pendingUsers,
        user,
        userRoles,
        parsedBulkUsers,
        roleStats,
        fetchRoleStats,

        isLoading,
        page,
        perPage,
        totalItems,
        totalPages,
        sortBy,
        sortOrder,
        search,
        filters,
        pendingPage,
        pendingPerPage,
        pendingTotalItems,
        pendingTotalPages,
        pendingSearch,
        pendingSortDir,
        pendingSortBy
    };
});
