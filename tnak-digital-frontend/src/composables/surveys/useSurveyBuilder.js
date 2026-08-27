export function useSurveyBuilder(state, sectionStore, questionStore) {
    const { dynamicSections, dirtyQuestions, questionRefs, saveStatus } = state;

    const createDefaultSection = (index = 1) => ({
        id: crypto.randomUUID(),
        backendId: null,
        title: `Section ${index}`,
        description: '',
        questions: [],
        newQuestionType: 'TEXT'
    });

    const addSection = () => {
        const newIndex = dynamicSections.value.length + 1;
        dynamicSections.value.push(createDefaultSection(newIndex));
    };

    const removeSection = async (sIndex) => {
        const section = dynamicSections.value[sIndex];
        if (section.backendId) {
            saveStatus.value = 'Deleting Section...';
            await sectionStore.removeSurveySection(section.backendId);
        }
        dynamicSections.value.splice(sIndex, 1);
        saveStatus.value = 'Saved as Draft';
    };

    const addQuestion = (sIndex, type) => {
        dynamicSections.value[sIndex].questions.push({
            id: crypto.randomUUID(),
            backendId: null,
            type,
            data: null
        });
    };

    const removeQuestion = async (sIndex, qIndex) => {
        const q = dynamicSections.value[sIndex].questions[qIndex];
        if (q.backendId) {
            saveStatus.value = 'Deleting Question...';
            await questionStore.deleteSurveyQuestion(q.backendId);
        }
        dynamicSections.value[sIndex].questions.splice(qIndex, 1);
        dirtyQuestions.value.delete(`${sIndex}-${qIndex}`);
        saveStatus.value = 'Saved as Draft';
    };

    const setQuestionRef = (el, sIndex, qIndex) => {
        if (el) {
            questionRefs.value[`${sIndex}-${qIndex}`] = el;
        }
    };

    const markQuestionDirty = (sIndex, qIndex) => {
        dirtyQuestions.value.add(`${sIndex}-${qIndex}`);
    };

    return {
        createDefaultSection,
        addSection,
        removeSection,
        addQuestion,
        removeQuestion,
        setQuestionRef,
        markQuestionDirty
    };
}
