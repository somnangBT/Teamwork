export function useSurveyAutoSave(state, surveyStore, sectionStore, questionStore, surveyFormRef, toastStore) {
    const {
        editingSurvey, isEdit, dynamicSections, isInitialLoad, dirtyQuestions,
        saveStatus, savePending, hasUnsavedChanges, questionRefs
    } = state;

    let saveTimeout = null;

    const performAutoSave = async () => {
        const sForm = surveyFormRef.value;
        if (!sForm) return;

        try {
            hasUnsavedChanges.value = false;
            const form = JSON.parse(JSON.stringify(sForm.formData));

            if (!form.targetId) {
                saveStatus.value = 'Please select a Target filter first!';
                if (toastStore && toastStore.showToast) {
                    toastStore.showToast('Please select a Target before saving!', 'warning');
                }
                savePending.value = false;
                return;
            }



            const capturedQuestionsData = {};
            for (let sIndex = 0; sIndex < dynamicSections.value.length; sIndex++) {
                const section = dynamicSections.value[sIndex];
                capturedQuestionsData[sIndex] = {};
                for (let qIndex = 0; qIndex < section.questions.length; qIndex++) {
                    const refInstance = questionRefs.value[`${sIndex}-${qIndex}`];
                    if (refInstance && refInstance.formData) {
                        capturedQuestionsData[sIndex][qIndex] = JSON.parse(JSON.stringify(refInstance.formData));
                    } else {
                        capturedQuestionsData[sIndex][qIndex] = null;
                    }
                }
            }

            isInitialLoad.value = true;
            saveStatus.value = 'Saving...';

            const surveyPayload = {
                title: form.title?.trim() || 'Untitled Survey',
                description: form.description?.trim() || 'No Description',
                targetId: form.targetId,
                targetTeacherId: form.targetTeacherId || null,
            };

            let surveyId = editingSurvey.value?.id;

            if (!isEdit.value || !surveyId) {
                const createdSurvey = await surveyStore.createSurvey(surveyPayload);
                surveyId = createdSurvey?.id;

                if (surveyId) {
                    isEdit.value = true;
                    editingSurvey.value = createdSurvey;

                    const fullSurveyDetails = await surveyStore.getSurveyById(surveyId);
                    if (fullSurveyDetails && fullSurveyDetails.sections && fullSurveyDetails.sections.length > 0) {
                        if (dynamicSections.value.length > 0 && !dynamicSections.value[0].backendId) {
                            dynamicSections.value[0].backendId = fullSurveyDetails.sections[0].id;
                        }
                    }
                } else {
                    saveStatus.value = 'Failed to Save';
                    isInitialLoad.value = false;
                    return;
                }
            } else {
                await surveyStore.updateSurvey(surveyId, surveyPayload);
            }

            for (let sIndex = 0; sIndex < dynamicSections.value.length; sIndex++) {
                const section = dynamicSections.value[sIndex];
                let sectionId = section.backendId;
                const sectionPayload = {
                    title: section.title || `Section ${sIndex + 1}`,
                    description: section.description || ''
                };

                if (!sectionId) {
                    const createdSection = await sectionStore.addSurveySection(surveyId, sectionPayload);
                    sectionId = createdSection?.id;
                    section.backendId = sectionId;
                } else {
                    await sectionStore.updateSurveySection(sectionId, sectionPayload);
                }

                if (sectionId) {
                    for (let qIndex = 0; qIndex < section.questions.length; qIndex++) {
                        const questionKey = `${sIndex}-${qIndex}`;
                        if (!dirtyQuestions.value.has(questionKey)) {
                            continue;
                        }

                        const q = section.questions[qIndex];
                        const data = capturedQuestionsData[sIndex][qIndex];

                        if (data && data.questionText && data.questionText.trim() !== '') {
                            if (!q.backendId) {
                                const createdQuestion = await questionStore.createSurveyQuestion(sectionId, data);
                                q.backendId = createdQuestion?.id;
                            } else {
                                await questionStore.updateSurveyQuestion(q.backendId, data);
                            }
                        }
                    }
                }
            }

            dirtyQuestions.value.clear();

            saveStatus.value = 'Saved';
            setTimeout(() => {
                if (saveStatus.value === 'Saved') {
                    saveStatus.value = '';
                }
            }, 2000);

            setTimeout(() => isInitialLoad.value = false, 100);
        } finally {
            savePending.value = false;
            if (saveTimeout) {
                clearTimeout(saveTimeout);
                saveTimeout = null;
            }
        }
    };

    const triggerAutoSave = () => {
        if (document.body.classList.contains('custom-dragging-active')) return;
        const active = document.activeElement;
        const tag = active ? active.tagName : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA') {
            hasUnsavedChanges.value = true;
            return;
        }

        if (saveTimeout) clearTimeout(saveTimeout);
        savePending.value = true;
        saveTimeout = setTimeout(() => {
            performAutoSave();
        }, 2000);
    };

    const forceAutoSave = () => {
        if (document.body.classList.contains('custom-dragging-active')) return;
        if (saveTimeout) clearTimeout(saveTimeout);
        savePending.value = true;
        saveTimeout = setTimeout(() => {
            performAutoSave();
        }, 500);
    };

    const toggleQuestionSave = async (sIndex, qIndex, isSaved) => {
        const q = dynamicSections.value[sIndex]?.questions[qIndex];
        if (!q || !q.backendId) return;

        saveStatus.value = isSaved ? 'Saving question...' : 'Removing saved question...';

        if (isSaved) {
            await questionStore.saveSurveyQuestion(q.backendId);
        } else {
            await questionStore.unsaveSurveyQuestion(q.backendId);
        }

        saveStatus.value = 'Saved';
        setTimeout(() => {
            if (saveStatus.value === 'Saved') {
                saveStatus.value = '';
            }
        }, 2000);
    };

    const handleFocusOut = () => {
        if (hasUnsavedChanges.value) {
            forceAutoSave();
        }
    };

    return {
        triggerAutoSave,
        forceAutoSave,
        performAutoSave,
        toggleQuestionSave,
        handleFocusOut
    };
}
