import { ref, watch, computed } from 'vue';

export function useSurveySelection(dynamicSections, customDragState) {
    const activeItemId = ref(null);
    const lastActiveSectionId = ref(null);
    const activeTabId = ref(null);

    const surveySectionIds = computed(() => dynamicSections.value?.map(s => s.id).join(',') || '');
    const surveyItemIds = computed(() => dynamicSections.value?.map(s => s.id + ':' + s.questions.map(q => q.id).join(',')).join('|') || '');

    const setActiveItem = (id) => {
        if (!id) {
            if (!activeItemId.value && dynamicSections.value?.length > 0) {
                activeItemId.value = dynamicSections.value[0].id;
                lastActiveSectionId.value = dynamicSections.value[0].id;
            }
            return;
        }
        
        activeItemId.value = id;
        
        const foundSec = dynamicSections.value?.find(sec => sec.id === id || sec.questions.some(q => q.id === id));
        if (foundSec) {
            lastActiveSectionId.value = foundSec.id;
        }
    };

    const isSectionActive = (section) => {
        return activeItemId.value === section.id || section.questions.some(q => q.id === activeItemId.value);
    };

    watch(surveySectionIds, () => {
        const newVal = dynamicSections.value;
        if (newVal && newVal.length > 0) {
            const exists = newVal.some(sec => sec.id === activeTabId.value);
            if (!exists) {
                activeTabId.value = newVal[0].id;
            }
        }
    }, { immediate: true });

    watch(surveyItemIds, () => {
        const sections = dynamicSections.value;
        if (sections && sections.length > 0) {
            if (activeItemId.value !== null) {
                const exists = sections.some(sec => sec.id === activeItemId.value || sec.questions.some(q => q.id === activeItemId.value));
                if (!exists) {
                    activeItemId.value = sections[0].id;
                    lastActiveSectionId.value = sections[0].id;
                }
            } else {
                activeItemId.value = sections[0].id;
                lastActiveSectionId.value = sections[0].id;
            }
        } else {
            activeItemId.value = null;
            lastActiveSectionId.value = null;
        }
    }, { immediate: true });

    watch(() => customDragState.value?.hoverSIndex, (newHoverSIdx) => {
        if (customDragState.value?.isDragging && ['question', 'import_question'].includes(customDragState.value?.type) && newHoverSIdx !== null && newHoverSIdx !== undefined) {
            const sec = dynamicSections.value[newHoverSIdx];
            if (sec && sec.id !== activeTabId.value) {
                activeTabId.value = sec.id;
            }
        }
    });

    return {
        activeItemId,
        lastActiveSectionId,
        activeTabId,
        setActiveItem,
        isSectionActive
    };
}
