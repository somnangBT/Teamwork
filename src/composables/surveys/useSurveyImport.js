import { ref } from 'vue';

export function useSurveyImport(state, questionStore, initSurveyCallback, toastStore) {
    const { dynamicSections, editingSurvey } = state;

    const showImportPanel = ref(false);
    const selectedImportObjects = ref([]);
    const activeImportSectionIndex = ref(null);

    const openImportModal = async (sIndex) => {
        activeImportSectionIndex.value = sIndex;
        selectedImportObjects.value = [];
        showImportPanel.value = true;
    };

    const confirmImport = async () => {
        const qObjs = selectedImportObjects.value;

        if (!qObjs.length) {
            showImportPanel.value = false;
            return;
        }

        const ids = qObjs.map(q => Number(q.id ?? q._id ?? q.questionId)).filter(n => !Number.isNaN(n));
        const sIdx = activeImportSectionIndex.value;
        const section = dynamicSections.value[sIdx];

        if (section.backendId) {
            const payload = { questionIds: ids };
            try {
                const ok = await questionStore.importSurveyQuestions(section.backendId, payload);
                if (!ok) return;

                if (editingSurvey.value && editingSurvey.value.id) {
                    await initSurveyCallback({ id: editingSurvey.value.id });
                } else {
                    qObjs.forEach(qObj => {
                        const backendId = qObj.id ?? qObj._id ?? qObj.questionId ?? null;
                        section.questions.push({ id: crypto.randomUUID(), backendId, type: qObj.questionType || qObj.type || 'TEXT', data: qObj });
                    });
                }
            } catch (err) {
                console.error('Import API error', err);
                toastStore.showToast('Import API error — see console', 'danger', 5000);
                return;
            }
        } else {
            qObjs.forEach(qObj => {
                const backendId = qObj.id ?? qObj._id ?? qObj.questionId ?? null;
                section.questions.push({ id: crypto.randomUUID(), backendId, type: qObj.questionType || qObj.type || 'TEXT', data: qObj });
            });
        }

        showImportPanel.value = false;
    };

    return {
        showImportPanel,
        selectedImportObjects,
        activeImportSectionIndex,
        openImportModal,
        confirmImport
    };
}
