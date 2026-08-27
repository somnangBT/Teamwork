import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchAndFilter } from '@/composables/common/useSearchAndFilter.js';

export function useUserList(userStore, authStore, toastStore, userFormRef) {
    const router = useRouter();

    const showResetModal = ref(false);
    const showUserDetail = ref(false);
    const userDetail = ref(null);
    const isLoading = ref(false);
    const currentUser = ref(null);


    const handleFilterChange = async ({ search, ...filters }) => {
        userStore.search = search;
        userStore.filters = filters;
        userStore.page = 1; // Reset pagination on search/filter change
        await userStore.getAllUsers({ showLoading: true });
    };

    const searchAndFilter = useSearchAndFilter(
        { roleId: null, isActive: null },
        handleFilterChange
    );

    // Sync store with default UI state on initialization to prevent stale filters
    userStore.search = searchAndFilter.searchQuery.value;
    userStore.filters = searchAndFilter.filters.value;

    const onViewDetail = async (user) => {
        if (!user) return;
        showUserDetail.value = true;
        userDetail.value = user;
    };

    const onResetPassword = async (id) => {
        currentUser.value = id;
        showResetModal.value = true;
    };

    const handleResetPassword = async () => {
        await userStore.resetUserPassword(currentUser.value);
        if (currentUser.value == authStore?.user?.id) {
            authStore.logout();
            router.push({ name: 'login' });
        }
        onCancelReset();
    };

    const onCancelReset = () => {
        currentUser.value = null;
        showResetModal.value = false;
    };

    return {
        showResetModal,
        showUserDetail,
        userDetail,
        isLoading,
        currentUser,
        onViewDetail,
        onResetPassword,
        handleResetPassword,
        onCancelReset,
        searchAndFilter
    };
}
