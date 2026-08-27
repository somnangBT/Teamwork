import api from "@/api/api";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "../toast";
import { handleApiError } from "@/utils/apiError";
import { socket } from "@/utils/socket";

export const useSurveyStudentStore = defineStore('survey-student', () => {

    const queryCache = new Map();
    const detailCache = new Map();
    const currentParams = ref({});

    const states = ref({
        surveyStudent: [],
        surveyStudentDetail: null,
        meta: null,
        isLoading: false,
        refreshTrigger: 0
    })

    const toastStore = useToastStore();

    const getAllSurveyStudent = async (params = {}, forceRefresh = false, append = false) => {
        const cacheKey = JSON.stringify(params);
        currentParams.value = { ...params };

        if (!forceRefresh && queryCache.has(cacheKey)) {
            const cached = queryCache.get(cacheKey);
            if (append) {
                const existingIds = new Set(states.value.surveyStudent.map(s => s.id));
                const newSurveys = cached.surveys.filter(s => !existingIds.has(s.id));
                states.value.surveyStudent = [...states.value.surveyStudent, ...newSurveys];
            } else {
                states.value.surveyStudent = cached.surveys;
            }
            states.value.meta = cached.meta;
            return true;
        }

        try {
            if (states.value.surveyStudent.length === 0 || forceRefresh) {
                states.value.isLoading = !append;
            }
            const res = await api.get('surveys/to-student', { params });
            const data = res?.data?.data?.surveys || [];
            const meta = res?.data?.data?.meta || null;

            if (append) {
                const existingIds = new Set(states.value.surveyStudent.map(s => s.id));
                const newSurveys = data.filter(s => !existingIds.has(s.id));
                states.value.surveyStudent = [...states.value.surveyStudent, ...newSurveys];
            } else {
                states.value.surveyStudent = data;
            }

            states.value.meta = meta;
            queryCache.set(cacheKey, { surveys: data, meta });

            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            states.value.isLoading = false;
        }
    }

    const getSurveyStudentDetails = async (id, forceRefresh = false, params = {}) => {
        if (!forceRefresh && detailCache.has(id) && Object.keys(params).length === 0) {
            states.value.surveyStudentDetail = detailCache.get(id);
            return true;
        }

        try {
            const res = await api.get(`surveys/to-student/${id}`, { params })
            const data = res?.data?.data || null
            states.value.surveyStudentDetail = data;
            if (data && Object.keys(params).length === 0) {
                detailCache.set(id, data);
            }
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const startSurvey = async (surveyId) => {
        try {
            const res = await api.post(`surveys/${surveyId}/start-survey`);
            const payload = res.data?.data || res.data || {};
            const responseId =
                payload.responseId || payload.id || payload.response?.id || null;
            if (!responseId) {
                console.warn("No responseId returned from start-survey API");
            }
            return { ...payload, responseId };
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        }
    };

    const answerSurveyQuestion = async (responseId, payload) => {
        try {
            await api.post(`surveys/response/${responseId}/answer-survey`, payload);
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const saveDraftSurveyResponse = async (responseId) => {
        try {
            const res = await api.patch(`surveys/response/${responseId}/save-draft`);
            const updated = res.data?.data;

            if (updated?.isDraft) {
                const survey = states.value.surveyStudent.find(s => s.id === updated.surveyId);
                if (survey) {
                    survey.response = {
                        ...survey.response,
                        isDraft: true,
                        isCompleted: false,
                    };
                }
                toastStore.showToast("Survey saved as draft!", "info");
            }

            return updated;
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        }
    };

    const submitSurveyResponse = async (responseId) => {
        try {
            const res = await api.patch(`surveys/response/${responseId}/submit-survey`);
            const payload = res.data?.data || res.data || {};
            const updated = {
                ...payload,
                responseId: payload.responseId || payload.id || responseId,
            };

            if (updated?.isCompleted) {
                const survey = states.value.surveyStudent.find(s => s.id === updated.surveyId);
                if (survey) {
                    survey.response = {
                        responseId: updated.responseId,
                        isCompleted: true,
                        isDraft: false,
                        submittedAt: updated.submittedAt,
                    };
                }

                queryCache.clear();
                if (updated.surveyId) {
                    detailCache.delete(updated.surveyId);
                }

                toastStore.showToast(res.data?.message, 'success');
            }

            return updated;
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        }
    };

    const unlockSurvey = async (id, accessCode) => {
        try {
            const res = await api.post(`surveys/to-student/${id}/unlock`, { accessCode });
            queryCache.clear();
            toastStore.showToast(res.data?.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const setupSocketListeners = () => {
        socket.off('survey:published');
        socket.off('survey:unpublished');

        socket.on('survey:published', (payload) => {
            queryCache.clear();
            states.value.refreshTrigger++;
            toastStore.showToast(`New Survey Available: ${payload.title || 'Untitled'}`, 'info');
        });

        socket.on('survey:unpublished', (payload) => {
            if (!payload || !payload.id) return;
            states.value.surveyStudent = states.value.surveyStudent.filter(s => s.id !== payload.id);
            queryCache.forEach((value) => {
                value.surveys = value.surveys.filter(s => s.id !== payload.id);
            });
            detailCache.delete(payload.id);
            if (states.value.surveyStudentDetail?.id === payload.id) {
                states.value.surveyStudentDetail = null;
            }
        });
    };

    return {
        getAllSurveyStudent,
        getSurveyStudentDetails,
        unlockSurvey,
        startSurvey,
        answerSurveyQuestion,
        saveDraftSurveyResponse,
        submitSurveyResponse,
        setupSocketListeners,
        states
    }
})