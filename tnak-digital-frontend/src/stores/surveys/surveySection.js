import api from "@/api/api";
import { handleApiError } from "@/utils/apiError";
import { defineStore } from "pinia";
import { useToastStore } from "../toast";

export const useSurveySectionStore = defineStore('survey-section', () => {
    const toastStore = useToastStore();

    const addSurveySection = async (id, payload) => {
        try {
            const res = await api.post(`surveys/${id}/add-section`, payload)
            return res.data?.data || res.data || true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const assignSurveyQuestion = async (id, payload) => {
        try {
            await api.post(`sections/${id}/import-questions`, payload)
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const updateSurveySection = async (id, payload) => {
        try {
            await api.put(`surveys/update-section/${id}`, payload);
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const removeSurveySection = async (id) => {
        try {
            const res = await api.delete(`surveys/remove-section/${id}`);
            toastStore.showToast(res?.data?.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const reorderSurveySection = async (surveyId, payload) => {
        try {
            await api.put(`surveys/${surveyId}/sections/reorder`, payload);
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    return {
        addSurveySection,
        assignSurveyQuestion,
        updateSurveySection,
        removeSurveySection,
        reorderSurveySection
    }
})