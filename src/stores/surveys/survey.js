import api from "@/api/api";
import { handleApiError } from "@/utils/apiError";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useToastStore } from "../toast";
import { socket } from "@/utils/socket";

export const useSurveyStore = defineStore("survey", () => {
  const toastStore = useToastStore();
  const surveys = ref([]);
  const surveyReponses = ref([]);
  const isLoading = ref(false);
  const queryCache = new Map();
  const clearCache = () => {
    queryCache.clear();
    statusStats.value = { 'all': '...', 'published': '...', 'draft': '...', 'archived': '...' };
    fetchStatusStats(true);
  };
  const page = ref(1);
  const perPage = ref(10);
  const totalItems = ref(0);
  const totalPages = ref(0);
  const sortBy = ref('id');
  const sortOrder = ref('desc'); // Changed to desc for sensible default like reports

  const search = ref('');
  const statusFilter = ref('all');
  const targetId = ref('all');
  const createdById = ref('all');
  const statusStats = ref({ 'all': '...', 'published': '...', 'draft': '...', 'archived': '...' });

  const fetchStatusStats = async (forceRefresh = false) => {
    if (!forceRefresh && statusStats.value['all'] !== '...') return;
    try {
      const promises = Object.keys(statusStats.value).map(async (statusKey) => {
        const params = statusKey === 'all' ? { _per_page: 10, _page: 1 } : { status: statusKey.toUpperCase(), _per_page: 10, _page: 1 };

        const res = await api.get('surveys', { params });
        const meta = res?.data?.data?.meta;
        if (meta) {
          statusStats.value[statusKey] = String(meta.totalItems || 0);
        }
      });
      await Promise.all(promises);
    } catch (e) {
      console.error("Failed to fetch survey status stats", e);
    }
  };

  const stats = computed(() => ({
    total: surveys.value.length,
    draft: surveys.value.filter(s => s.response?.isDraft === true).length,
    completed: surveys.value.filter(s => s.response?.isCompleted === true).length,
  }));

  const completionRate = computed(() =>
    stats.value.total > 0
      ? Math.round((stats.value.completed / stats.value.total) * 100)
      : 0
  );

  const getAllSurveys = async (options = {}) => {
    const { showLoading = null, forceRefresh = false, ...extraParams } = options;
    const shouldLoad = showLoading !== null ? showLoading : surveys.value.length === 0;

    const params = Object.assign({
      _page: page.value,
      _per_page: perPage.value,
      sortBy: sortBy.value,
      sortDir: sortOrder.value,
      search: search.value || undefined,
      status: statusFilter.value !== 'all' ? statusFilter.value.toUpperCase() : undefined,
      targetId: targetId.value !== 'all' ? targetId.value : undefined,
      createdById: createdById.value !== 'all' ? createdById.value : undefined
    }, extraParams || {});

    const cacheKey = 'surveys_' + JSON.stringify(params);

    if (!forceRefresh && queryCache.has(cacheKey)) {
      const cached = queryCache.get(cacheKey);
      surveys.value = cached.surveys;
      totalItems.value = cached.meta.totalItems;
      totalPages.value = cached.meta.totalPages;
      page.value = cached.meta.page;
      return true;
    }

    try {
      if (shouldLoad) isLoading.value = true;

      const response = await api.get("surveys", { params });

      const data = response?.data?.data?.surveys || [];

      const knownResponses = {};
      surveys.value.forEach(s => {
        if (s.response) knownResponses[s.id] = s.response;
      });

      surveys.value = data.map(s => ({
        ...s,
        response: s.response ?? knownResponses[s.id] ?? null
      }));

      const meta = response.data.data.meta;
      totalItems.value = meta.totalItems;
      totalPages.value = meta.totalPages;
      page.value = meta.page;

      queryCache.set(cacheKey, { surveys: surveys.value, meta });

      return true;
    } catch (error) {
      handleApiError(error, toastStore);
      throw error;
    } finally {
      if (shouldLoad) isLoading.value = false;
    }
  };

  const getSurveyById = async (id) => {
    try {
      const response = await api.get(`surveys/${id}`);
      return response.data?.data;
    } catch (error) {
      handleApiError(error, toastStore);
      return null;
    }
  };

  const surveyQuestionResponses = ref(null);
  const isQuestionLoading = ref(false);

  const surveyIndividualResponse = ref(null);
  const isIndividualLoading = ref(false);

  const getSurveyResponses = async (id) => {
    try {
      const response = await api.get(`surveys/${id}/responses`)
      const data = response?.data?.data;
      surveyReponses.value = data;
    } catch (error) {
      handleApiError(error, toastStore)
      return false;
    }
  }

  const getSurveyQuestionResponses = async (id, params = {}) => {
    isQuestionLoading.value = true;
    try {
      const response = await api.get(`surveys/${id}/responses`, { params: { view: 'question', ...params } });
      const data = response?.data?.data;
      surveyQuestionResponses.value = data;
      return true;
    } catch (error) {
      handleApiError(error, toastStore);
      return false;
    } finally {
      isQuestionLoading.value = false;
    }
  };

  const getSurveyIndividualResponse = async (id, params = {}) => {
    isIndividualLoading.value = true;
    try {
      const response = await api.get(`surveys/${id}/responses`, { params: { view: 'individual', ...params } });
      const data = response?.data?.data;
      surveyIndividualResponse.value = data;
      return true;
    } catch (error) {
      handleApiError(error, toastStore);
      return false;
    } finally {
      isIndividualLoading.value = false;
    }
  };

  const createSurvey = async (payload) => {
    try {
      const res = await api.post("surveys", payload);
      clearCache();
      return res.data?.data?.result;
    } catch (error) {
      handleApiError(error, toastStore);
      return false;
    }
  };

  const updateSurvey = async (id, payload) => {
    try {
      const response = await api.put(`surveys/${id}`, payload);
      clearCache();
      return response.data?.data || true;
    } catch (error) {
      handleApiError(error, toastStore);
      return false;
    }
  };

  const publishSurvey = async (id) => {
    try {
      const res = await api.patch(`surveys/${id}/publish`);
      toastStore.showToast(res.data?.message, 'success')
      clearCache();
      return true;
    } catch (error) {
      handleApiError(error, toastStore);
      return false;
    }
  };

  const unpublishSurvey = async (id) => {
    try {
      const res = await api.patch(`surveys/${id}/unpublish`);
      toastStore.showToast(res.data?.message, 'success')
      clearCache();
      return true;
    } catch (error) {
      handleApiError(error, toastStore);
      return false;
    }
  };

  const handleRealTimeUpdate = (payload, newStatus) => {
    if (!payload || !payload.id) return;

    const index = surveys.value.findIndex(s => s.id === payload.id);
    if (index !== -1) {
      surveys.value[index] = {
        ...surveys.value[index],
        status: newStatus
      };

      queryCache.forEach((value) => {
        const cachedIndex = value.surveys.findIndex(s => s.id === payload.id);
        if (cachedIndex !== -1) {
          value.surveys[cachedIndex].status = newStatus;
        }
      });
    }

    fetchStatusStats();
  };

  const setupSocketListeners = () => {
    socket.off('survey:published');
    socket.off('survey:unpublished');

    socket.on('survey:published', (payload) => {
      handleRealTimeUpdate(payload, 'PUBLISHED');
    });

    socket.on('survey:unpublished', (payload) => {
      handleRealTimeUpdate(payload, 'ARCHIVED');
    });
  };

  return {
    getAllSurveys,
    getSurveyById,
    getSurveyResponses,
    getSurveyQuestionResponses,
    getSurveyIndividualResponse,
    createSurvey,
    updateSurvey,
    publishSurvey,
    unpublishSurvey,
    surveys,
    surveyReponses,
    surveyQuestionResponses,
    surveyIndividualResponse,
    isQuestionLoading,
    isIndividualLoading,
    isLoading,
    page,
    perPage,
    totalItems,
    totalPages,
    sortBy,
    sortOrder,
    stats,
    completionRate,
    search,
    statusFilter,
    targetId,
    createdById,
    statusStats,
    fetchStatusStats,
    setupSocketListeners
  };
});