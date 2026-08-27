import api from "@/api/api";
import { handleApiError } from "@/utils/apiError";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "../toast";

export const useSurveyTargetStore = defineStore('survey-target', () => {
    const toastStore = useToastStore();
    const surveyTargets = ref([]);
    const isLoading = ref(false);
    const queryCache = new Map();
    const clearCache = () => queryCache.clear();
    
    const page = ref(1);
    const perPage = ref(10);
    const totalItems = ref(0);
    const totalPages = ref(1);
    const search = ref('');
    const sortBy = ref('id');
    const sortOrder = ref('desc');

    const getSurveyTargets = async (options = {}) => {
        try {
            const { showLoading = null, forceRefresh = false, ...extraParams } = options;
            const shouldLoad = showLoading !== null ? showLoading : surveyTargets.value.length === 0;

            const params = Object.assign({
                _page: page.value,
                _per_page: perPage.value,
                sortBy: sortBy.value,
                sortDir: sortOrder.value,
                search: search.value || undefined,
            }, extraParams || {});

            const cacheKey = 'targets_' + JSON.stringify(params);

            if (!forceRefresh && queryCache.has(cacheKey)) {
                const cached = queryCache.get(cacheKey);
                if (options.append) {
                    surveyTargets.value = [...surveyTargets.value, ...cached.targets];
                } else {
                    surveyTargets.value = cached.targets;
                }
                if (cached.meta) {
                    totalItems.value = cached.meta.totalItems;
                    page.value = cached.meta.page;
                    totalPages.value = cached.meta.totalPages || 1;
                }
                return true;
            }

            if (shouldLoad) isLoading.value = true;

            const response = await api.get('survey-target', { params });
            const data = response?.data?.data?.targets || [];
            
            if (options.append) {
                surveyTargets.value = [...surveyTargets.value, ...data];
            } else {
                surveyTargets.value = data;
            }
            
            const meta = response?.data?.data?.meta;
            if (meta) {
                totalItems.value = meta.totalItems;
                page.value = meta.page;
                totalPages.value = meta.totalPages || 1;
            }
            
            queryCache.set(cacheKey, { targets: data, meta });
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    const createSurveyTarget = async (payload) => {
        try {
            if (!payload.name) throw new Error('Target name is required!')

            const res = await api.post('survey-target', payload)
            toastStore.showToast(res?.data?.message, 'success');
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const updateSurveyTarget = async (id, payload) => {
        try {
            if (!payload.name) throw new Error('Target name is required!')

            const res = await api.put(`survey-target/${id}`, payload)
            toastStore.showToast(res?.data?.message, 'success');
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const deleteSurveyTarget = async (id) => {
        try {
            const res = await api.delete(`survey-target/${id}`);
            toastStore.showToast(res?.data?.message, 'success');
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    return {
        surveyTargets,
        isLoading,
        page,
        perPage,
        totalItems,
        totalPages,
        search,
        sortBy,
        sortOrder,

        getSurveyTargets,
        createSurveyTarget,
        updateSurveyTarget,
        deleteSurveyTarget
    }
})