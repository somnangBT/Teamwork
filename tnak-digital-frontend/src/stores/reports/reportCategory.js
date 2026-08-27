import api from "@/api/api";
import { handleApiError } from "@/utils/apiError";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "../toast";

export const useReportCategoryStore = defineStore('report-category', () => {
    const toastStore = useToastStore();
    const reportCategories = ref([]);
    const isLoading = ref(false);
    const queryCache = new Map();
    const clearCache = () => queryCache.clear();

    const page = ref(1);
    const perPage = ref(10);
    const totalItems = ref(0);
    const totalPages = ref(0);

    const sortBy = ref('id');
    const sortOrder = ref('desc');
    const search = ref('');

    const getAllReportCategories = async (options = {}) => {
        const { showLoading = null, forceRefresh = false, ...extraParams } = options;
        const shouldLoad = showLoading !== null ? showLoading : reportCategories.value.length === 0;

        const params = Object.assign({
            _page: page.value,
            _per_page: perPage.value,
            sortBy: sortBy.value,
            sortDir: sortOrder.value,
            search: search.value,
        }, extraParams || {});

        const cacheKey = 'categories_' + JSON.stringify(params);

        if (!forceRefresh && queryCache.has(cacheKey)) {
            const cached = queryCache.get(cacheKey);
            if (options.append) {
                reportCategories.value = [...reportCategories.value, ...cached.data];
            } else {
                reportCategories.value = cached.data;
            }
            if (cached.meta) {
                totalItems.value = cached.meta.totalItems;
                totalPages.value = cached.meta.totalPages;
                page.value = cached.meta.page;
            }
            return true;
        }

        try {
            if (shouldLoad) isLoading.value = true;

            const response = await api.get('category', { params });
            const data = response?.data?.data?.category || [];
            
            if (options.append) {
                reportCategories.value = [...reportCategories.value, ...data];
            } else {
                reportCategories.value = data;
            }

            const meta = response?.data?.data?.meta;
            if (meta) {
                totalItems.value = meta.totalItems;
                totalPages.value = meta.totalPages;
                page.value = meta.page;
            }

            queryCache.set(cacheKey, { data, meta });
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            if (shouldLoad) isLoading.value = false;
        }
    }

    const createReportCategory = async (payload) => {
        try {
            if (!payload.name) throw new Error('Category name is required!')

            const res = await api.post('category', payload);
            toastStore.showToast(res?.data?.message, 'success')
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const updateReportCategory = async (id, payload) => {
        try {
            if (!id) throw new Error('Category Not Found!')
            if (!payload.name) throw new Error('Category name is required!')

            const res = await api.put(`category/${id}`, payload);
            toastStore.showToast(res?.data?.message, 'success')
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const deleteReportCategory = async (id) => {
        try {
            if (!id) throw new Error('Category Not Found!')
            const res = await api.delete(`category/${id}`)
            toastStore.showToast(res?.data?.message, 'success')
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    return {
        isLoading,
        page,
        perPage,
        totalItems,
        totalPages,
        sortBy,
        sortOrder,
        search,

        reportCategories,

        getAllReportCategories,
        createReportCategory,
        updateReportCategory,
        deleteReportCategory,
    }
})