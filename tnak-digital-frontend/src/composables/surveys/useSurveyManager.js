import { watch, onBeforeUpdate, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSurveyState } from './useSurveyState';
import { useSurveyBuilder } from './useSurveyBuilder';
import { useSurveyImport } from './useSurveyImport';
import { useSurveyAutoSave } from './useSurveyAutoSave';

export function useSurveyManager(surveyStore, sectionStore, questionStore, toastStore, surveyFormRef) {
    const state = useSurveyState();
    const builder = useSurveyBuilder(state, sectionStore, questionStore);
    const autoSave = useSurveyAutoSave(state, surveyStore, sectionStore, questionStore, surveyFormRef, toastStore);

    const route = useRoute();
    const router = useRouter();

    let initCounter = 0;
    const initializeEditSurvey = async (survey) => {
        const currentInit = ++initCounter;
        state.isInitialLoad.value = true;
        state.isEdit.value = true;

        state.saveStatus.value = 'Loading...';
        const fullSurveyDetails = survey.id ? await surveyStore.getSurveyById(survey.id) : survey;
        
        if (currentInit !== initCounter) return;

        const targetSurvey = fullSurveyDetails || survey;

        state.editingSurvey.value = targetSurvey;
        state.saveStatus.value = '';
        state.initialSurveyFormData.value = null;
        state.dirtyQuestions.value.clear();

        state.dynamicSections.value = [];

        if (targetSurvey.sections && targetSurvey.sections.length > 0) {
            state.dynamicSections.value = targetSurvey.sections.map(s => ({
                id: crypto.randomUUID(),
                backendId: s.id,
                title: s.title,
                description: s.description,
                questions: s.questions ? s.questions.map(q => {
                    const actualQ = q.question || q;
                    return {
                        id: crypto.randomUUID(),
                        backendId: actualQ.id || q.id,
                        type: actualQ.questionType || actualQ.type,
                        data: actualQ
                    };
                }) : [],
                newQuestionType: 'TEXT'
            }));
        } else {
            const defaultSec = builder.createDefaultSection();
            state.dynamicSections.value = [defaultSec];
        }

        setTimeout(() => {
            if (currentInit !== initCounter) return;
            if (surveyFormRef.value?.formData) {
                state.initialSurveyFormData.value = JSON.parse(JSON.stringify(surveyFormRef.value.formData));
            }
            state.isInitialLoad.value = false;
        }, 500);
    };

    const initializeNewSurvey = () => {
        state.isInitialLoad.value = true;
        state.isEdit.value = false;
        state.editingSurvey.value = null;
        state.saveStatus.value = '';
        state.initialSurveyFormData.value = null;
        state.dirtyQuestions.value.clear();
        state.dynamicSections.value = [builder.createDefaultSection()];

        setTimeout(() => {
            if (surveyFormRef.value?.formData) {
                state.initialSurveyFormData.value = JSON.parse(JSON.stringify(surveyFormRef.value.formData));
            }
            state.isInitialLoad.value = false;
        }, 500);
    };

    const importManager = useSurveyImport(state, questionStore, initializeEditSurvey, toastStore);

    const existingQuestionIds = computed(() => {
        const ids = [];
        if (state.dynamicSections.value) {
            state.dynamicSections.value.forEach(sec => {
                if (sec.questions) {
                    sec.questions.forEach(q => {
                        const qId = q.data?.id || q.data?._id || q.data?.questionId || q.id;
                        if (qId) ids.push(qId);
                    });
                }
            });
        }
        return ids;
    });

    const onSectionReorder = async () => {
        const surveyId = state.editingSurvey.value?.id;
        if (!surveyId) return;

        state.saveStatus.value = 'Reordering...';

        const sectionOrders = [];
        state.dynamicSections.value.forEach((sec, index) => {
            if (sec.backendId) {
                sectionOrders.push({
                    id: sec.backendId,
                    orderIndex: index + 1
                });
            }
        });

        if (sectionOrders.length > 0) {
            const success = await sectionStore.reorderSurveySection(surveyId, { sectionOrders });
            if (success) {
                state.saveStatus.value = 'Saved as Draft';
            } else {
                state.saveStatus.value = 'Failed to reorder';
            }
        } else {
            state.saveStatus.value = 'Saved as Draft';
        }
    };

    const onQuestionReorder = async (sIndex) => {
        const section = state.dynamicSections.value[sIndex];
        if (!section || !section.backendId) return;

        state.saveStatus.value = 'Reordering...';

        const questionOrders = [];
        section.questions.forEach((q, index) => {
            if (q.backendId) {
                questionOrders.push({
                    questionId: q.backendId,
                    orderIndex: index + 1
                });
            }
        });

        if (questionOrders.length > 0) {
            const success = await questionStore.reorderSurveyQuestion(section.backendId, { questionOrders });
            if (success) {
                state.saveStatus.value = 'Saved as Draft';
            } else {
                state.saveStatus.value = 'Failed to reorder';
            }
        } else {
            state.saveStatus.value = 'Saved as Draft';
        }
    };

    const onQuestionDragEnd = async (e) => {
        const fromIndex = parseInt(e.from?.dataset?.sectionIndex);
        const toIndex = parseInt(e.to?.dataset?.sectionIndex);

        if (isNaN(fromIndex) || isNaN(toIndex)) return;

        if (fromIndex === toIndex) {
            await onQuestionReorder(fromIndex);
        } else {
            const sourceSection = state.dynamicSections.value[fromIndex];
            const targetSection = state.dynamicSections.value[toIndex];
            if (!sourceSection || !targetSection) return;

            const targetQuestion = targetSection.questions[e.newIndex];

            if (targetQuestion && targetQuestion.backendId && sourceSection.backendId && targetSection.backendId) {
                state.saveStatus.value = 'Moving...';
                const success = await questionStore.moveSurveyQuestion({
                    questionId: targetQuestion.backendId,
                    sourceSectionId: sourceSection.backendId,
                    targetSectionId: targetSection.backendId,
                    newOrderIndex: e.newIndex + 1
                });

                if (success) {
                    state.saveStatus.value = 'Saved as Draft';
                } else {
                    state.saveStatus.value = 'Failed to move';
                }
            } else {
                state.saveStatus.value = 'Saved as Draft';
                autoSave.triggerAutoSave();
            }
        }
    };

    const handleCustomReorder = (dragInfo) => {
        if (!dragInfo) {
            autoSave.triggerAutoSave();
            return;
        }
        if (dragInfo.type === 'section') {
            onSectionReorder();
        } else if (dragInfo.type === 'question') {
            if (dragInfo.fromSectionIndex === dragInfo.toSectionIndex) {
                onQuestionReorder(dragInfo.toSectionIndex);
            } else {
                onQuestionDragEnd({
                    from: { dataset: { sectionIndex: dragInfo.fromSectionIndex } },
                    to: { dataset: { sectionIndex: dragInfo.toSectionIndex } },
                    newIndex: dragInfo.toQuestionIndex
                });
            }
        } else if (dragInfo.type === 'import_drop') {
            builder.markQuestionDirty(dragInfo.toSectionIndex, dragInfo.toQuestionIndex);
            autoSave.triggerAutoSave();
        }
    };

    watch(() => state.editingSurvey.value?.id, (newId) => {
        if (newId && route.query.id != newId) {
            router.replace({
                query: {
                    ...route.query,
                    id: newId
                }
            });
        }
    }, { immediate: true });

    watch(() => JSON.stringify(state.dynamicSections.value), (newStr, oldStr) => {
        if (!state.isInitialLoad.value && oldStr !== undefined && newStr !== oldStr) {
            autoSave.triggerAutoSave();
        }
    }, { deep: true, immediate: false });

    watch(() => surveyFormRef.value?.formData, (newFormData) => {
        if (!state.isInitialLoad.value && state.initialSurveyFormData.value) {
            if (JSON.stringify(newFormData) !== JSON.stringify(state.initialSurveyFormData.value)) {
                autoSave.triggerAutoSave();
            }
        }
    }, { deep: true, immediate: false });

    onBeforeUpdate(() => {
        state.questionRefs.value = {};
    });

    const handleBeforeUnload = (e) => {
        if (state.savePending.value || state.saveStatus.value === 'Saving...') {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        }
    };

    onMounted(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);
    });

    onUnmounted(() => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    });

    return {
        ...state,
        ...builder,
        ...autoSave,
        ...importManager,
        existingQuestionIds,
        handleCustomReorder,
        initializeNewSurvey,
        initializeEditSurvey,
        onSectionReorder,
        onQuestionReorder,
        onQuestionDragEnd
    };
}
