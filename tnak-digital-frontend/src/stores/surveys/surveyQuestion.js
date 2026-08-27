import api from "@/api/api";
import { handleApiError } from "@/utils/apiError";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "../toast";

export const useSurveyQuestionStore = defineStore('survey-question', () => {

    const toastStore = useToastStore();
    const surveyQuestions = ref([]);
    const surveyQuestionsMeta = ref({
        totalItems: 0,
        page: 1,
        perPage: 10,
        totalPages: 1
    });
    const isLaoding = ref(false);

    const getAllSurveyQuestions = async (params = {}, append = false) => {
        try {
            isLaoding.value = true;
            const response = await api.get('questions', { params });
            const data = response?.data?.data?.questions || [];
            const meta = response?.data?.data?.meta;
            
            if (append) {
                surveyQuestions.value = [...surveyQuestions.value, ...data];
            } else {
                surveyQuestions.value = data;
            }
            if (meta) {
                surveyQuestionsMeta.value = meta;
            }

            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            isLaoding.value = false;
        }
    }

    const createSurveyQuestion = async (id, payload) => {
        try {
            const res = await api.post(`sections/${id}/create-question`, payload)
            return res.data?.data || res.data?.question || res.data || true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const saveSurveyQuestion = async (id) => {
        try {
            const res = await api.patch(`questions/${id}/saved-question`);
            toastStore.showToast(res?.data?.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const unsaveSurveyQuestion = async (id) => {
        try {
            const res = await api.patch(`questions/${id}/saved-question`);
            toastStore.showToast(res?.data?.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const deleteSurveyQuestion = async (id) => {
        try {
            const res = await api.delete(`questions/${id}`);
            toastStore.showToast(res?.data?.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const updateSurveyQuestion = async (id, payload) => {
        try {
            const res = await api.put(`questions/${id}/update-question`, payload);
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const importSurveyQuestions = async (id, payload) => {
        try {
            const res = await api.post(`sections/${id}/import-questions`, payload);
            toastStore.showToast(res?.data?.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore)
            return false;
        }
    }

    const reorderSurveyQuestion = async (sectionId, payload) => {
        try {
            await api.put(`surveys/sections/${sectionId}/questions/reorder`, payload);
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const moveSurveyQuestion = async (payload) => {
        try {
            await api.put(`surveys/questions/move-between-sections`, payload);
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    return {
        isLaoding,
        surveyQuestions,
        surveyQuestionsMeta,
        getAllSurveyQuestions,
        createSurveyQuestion,
        updateSurveyQuestion,
        saveSurveyQuestion,
        unsaveSurveyQuestion,
        deleteSurveyQuestion,
        importSurveyQuestions,
        reorderSurveyQuestion,
        moveSurveyQuestion
    }
})