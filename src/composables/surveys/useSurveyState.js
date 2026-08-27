import { ref } from 'vue';

export function useSurveyState() {
    const editingSurvey = ref(null);
    const isEdit = ref(false);
    const dynamicSections = ref([]);
    const isInitialLoad = ref(false);
    const dirtyQuestions = ref(new Set());
    const initialSurveyFormData = ref(null);
    const saveStatus = ref('');
    const savePending = ref(false);
    const hasUnsavedChanges = ref(false);
    const questionRefs = ref({});

    return {
        editingSurvey,
        isEdit,
        dynamicSections,
        isInitialLoad,
        dirtyQuestions,
        initialSurveyFormData,
        saveStatus,
        savePending,
        hasUnsavedChanges,
        questionRefs
    };
}
