<template>
    <div v-if="isFetchingSurvey" class="d-flex flex-column align-items-center justify-content-center w-100 h-100 py-5 text-muted gap-3" style="min-height: 400px;">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
        </div>
        <h5 class="fw-medium">Loading survey data...</h5>
    </div>
    <div v-else class="w-100" @focusout="handleFocusOut">
        <div class="row w-100 gx-3 m-0">
            <div class="col-12 mb-3">
                <SurveyFormHeader 
                    :save-pending="savePending"
                    :save-status="saveStatus"
                    :show-import-view="showImportView"
                    @cancel="onCancel"
                    @toggle-import="showImportView = !showImportView"
                    @add-question="onHeaderAddQuestion"
                />
            </div>
        
        <div class="col-12 col-lg-4 mb-4">
            <SurveySectionSidebar 
                :dynamic-sections="dynamicSections"
                :active-tab-id="activeTabId"
                :custom-drag-state="customDragState"
                :start-custom-drag="startCustomDrag"
                @update:active-tab-id="activeTabId = $event"
                @remove-section="removeSection"
                @add-section="onAddSection"
            />
        </div>

        <!-- Main Form Content -->
        <div class="col-12 col-lg-8">
            <div v-show="showImportView && !customDragState.isDragging" class="w-100 me-auto" style="max-width: 800px;">
                <ImportQuestionList 
                    :existing-question-ids="existingQuestionIds"
                    :start-custom-drag="startCustomDrag" />
            </div>

            <div v-show="!showImportView || customDragState.isDragging" class="w-100 me-auto" style="max-width: 800px;">
            <div class="form-info mb-3">
                    <SurveyForm ref="surveyFormRef" :initial-data="editingSurvey" />
                </div>

                <!-- Active Section Content -->
                <div v-if="activeTabId">
                        <template v-for="(section, sIndex) in dynamicSections" :key="section.id">
                            <div class="mb-lg-5 mb-md-4 mb-3 position-relative"
                                :data-section-idx="sIndex"
                                v-if="activeTabId === section.id">
                        
                        <div class="card mb-3 p-3 position-relative"
                            style="background-color: var(--body-bg-color);"
                            @click.stop="setActiveItem(section.id)">
                            <template v-if="activeItemId === section.id">
                                <div class="w-100 d-flex flex-column gap-2">
                                    <BaseInput type="text" placeholder="Section Title" v-model="section.title" />
                                    <BaseInput type="text" placeholder="Section Description (optional)"
                                        v-model="section.description" />
                                </div>
                            </template>
                            <template v-else>
                                <div class="w-100" style="cursor: pointer;">
                                    <div class="mb-2 fw-medium">{{ section.title || 'Untitled Section' }}</div>
                                    <p class="text-muted mb-0">{{ section.description || 'No description' }}</p>
                                </div>
                            </template>
                        </div>

                        <div>
                                    <div v-for="(q, qIndex) in section.questions" :key="q.id" class="mb-2 position-relative question-card-wrapper"
                                        :data-section-idx="sIndex"
                                        :data-question-idx="qIndex"
                                        :class="{
                                            'custom-dragging': customDragState.isDragging && customDragState.type === 'question' && customDragState.sIndex === sIndex && customDragState.qIndex === qIndex,
                                            ['type-' + q.type]: true
                                        }"
                                        @click.stop="setActiveItem(q.id)"
                                        @input="onQuestionInput(sIndex, qIndex)" @change="onQuestionInput(sIndex, qIndex)">
                                        
                                        <div class="position-absolute start-50 translate-middle-x z-3 question-drag-handle question-drag-handle-container d-flex align-items-center justify-content-center py-1"
                                            style="top: 2px; cursor: move; user-select: none; width: 100%; height: 20px;"
                                            @mousedown.stop.prevent="startCustomDrag($event, 'question', sIndex, qIndex)">
                                            <GripHorizontal :size="18" class="text-secondary" style="pointer-events: none; opacity: 0.7;" />
                                        </div>

                                        <component :is="getQuestionComponent(q.type)" :initial-data="q.data"
                                            :question-type-options="questionTypeOptions"
                                            :is-active="activeItemId === q.id"
                                            @change-type="onChangeQuestionType(sIndex, qIndex, $event)"
                                            @activate="setActiveItem(q.id)"
                                            @remove="onQuestionRemove(sIndex, qIndex)" @update="onQuestionUpdate(sIndex, qIndex)"
                                            @save-toggle="onQuestionSaveToggle(sIndex, qIndex, $event)"
                                            :ref="el => setQuestionRef(el, sIndex, qIndex)" />
                                    </div>
                        </div>
                            </div>
                        </template>
                </div>

                <div v-if="dynamicSections.length === 0" class="text-center py-5 text-muted">
                    No sections added yet. Click above to add a section.
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import SurveyForm from '@/components/forms/surveys/SurveyForm.vue';
import ChoiceQuestionForm from '@/components/forms/surveys/ChoiceQuestionForm.vue';
import TextQuestionForm from '@/components/forms/surveys/TextQuestionForm.vue';
import RatingQuestionForm from '@/components/forms/surveys/RatingQuestionForm.vue';
import ImportQuestionList from './components/ImportQuestionList.vue';
import SurveyFormHeader from './components/SurveyFormHeader.vue';
import SurveySectionSidebar from './components/SurveySectionSidebar.vue';
import { useSurveyStore } from '@/stores/surveys/survey';
import { useSurveySectionStore } from '@/stores/surveys/surveySection';
import { useSurveyQuestionStore } from '@/stores/surveys/surveyQuestion';
import { useToastStore } from '@/stores/toast';
import { GripHorizontal } from '@lucide/vue';
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useSurveyManager } from '@/composables/surveys/useSurveyManager';
import { useSurveyDragDrop } from '@/composables/surveys/useSurveyDragDrop';
import { useSurveySelection } from '@/composables/surveys/useSurveySelection';

const props = defineProps({
    initialData: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close']);

const surveyStore = useSurveyStore();
const sectionStore = useSurveySectionStore();
const questionStore = useSurveyQuestionStore();
const toastStore = useToastStore();
const route = useRoute();
const router = useRouter();

const surveyFormRef = ref(null);

const surveyManager = useSurveyManager(
    surveyStore,
    sectionStore,
    questionStore,
    toastStore,
    surveyFormRef
);

const {
    editingSurvey,
    isEdit,
    dynamicSections,
    isInitialLoad,
    saveStatus,
    savePending,
    hasUnsavedChanges,
    questionRefs,
    showImportPanel,
    selectedImportObjects,

    addSection,
    removeSection,
    addQuestion,
    removeQuestion,
    setQuestionRef,

    triggerAutoSave,
    toggleQuestionSave,
    handleFocusOut,

    openImportModal,
    confirmImport,

    initializeNewSurvey,
    initializeEditSurvey,
    handleCustomReorder,
    existingQuestionIds
} = surveyManager;

const questionTypeOptions = [
    { label: 'Text', value: 'TEXT' },
    { label: 'Choice', value: 'CHOICE' },
    { label: 'Rating', value: 'RATING' }
];

const showImportView = ref(false);

const { customDragState, startCustomDrag } = useSurveyDragDrop(dynamicSections, handleCustomReorder, {
    scrollSensitivity: 250,
    scrollSpeed: 150,
    questionRefs: questionRefs
});

const { activeItemId, lastActiveSectionId, activeTabId, setActiveItem, isSectionActive } = useSurveySelection(dynamicSections, customDragState);

const getQuestionComponent = (type) => {
    if (type === 'CHOICE') return ChoiceQuestionForm;
    if (type === 'TEXT') return TextQuestionForm;
    if (type === 'RATING') return RatingQuestionForm;
};

const onAddDefaultQuestion = (sIndex) => {
    addQuestion(sIndex, 'TEXT');
    setTimeout(() => {
        const section = dynamicSections.value[sIndex];
        const newQuestion = section.questions[section.questions.length - 1];
        if (newQuestion) setActiveItem(newQuestion.id);
    }, 0);
};

const onHeaderAddQuestion = () => {
    const sIndex = dynamicSections.value.findIndex(s => s.id === activeTabId.value);
    if (sIndex !== -1) {
        onAddDefaultQuestion(sIndex);
    }
};

const onAddSection = () => {
    addSection();
    setTimeout(() => {
        const newSection = dynamicSections.value[dynamicSections.value.length - 1];
        if (newSection) {
            setActiveItem(newSection.id);
            activeTabId.value = newSection.id;
        }
    }, 0);
};

const onChangeQuestionType = (sIndex, qIndex, newType) => {
    const q = dynamicSections.value[sIndex].questions[qIndex];
    
    // Normalize newType just in case it's an object or different case
    const normalizedNewType = typeof newType === 'object' && newType !== null ? (newType.value || newType.code || newType.id) : newType;
    
    if (String(q.type).toUpperCase() === String(normalizedNewType).toUpperCase()) return;
    
    const oldRef = questionRefs.value[`${sIndex}-${qIndex}`];
    let preservedData = null;
    if (oldRef && oldRef.formData) {
        preservedData = { ...oldRef.formData };
    }
    
    q.type = normalizedNewType;
    q.data = { ...preservedData, id: q.id, questionType: normalizedNewType };
    
    surveyManager.markQuestionDirty(sIndex, qIndex);
    triggerAutoSave();
};

const onQuestionInput = (sIndex, qIndex) => {
    if (isInitialLoad.value) return;
    surveyManager.markQuestionDirty(sIndex, qIndex);
    triggerAutoSave();
};

const onQuestionUpdate = (sIndex, qIndex) => {
    if (isInitialLoad.value) return;
    surveyManager.markQuestionDirty(sIndex, qIndex);
    triggerAutoSave();
};

const onQuestionSaveToggle = (sIndex, qIndex, isSaved) => {
    if (isInitialLoad.value) return;
    toggleQuestionSave(sIndex, qIndex, isSaved);
};

const onQuestionRemove = (sIndex, qIndex) => {
    removeQuestion(sIndex, qIndex);
};

const onCancel = async () => {
    if (hasUnsavedChanges.value) {
        surveyManager.forceAutoSave();
    }
    emit('close');
};

const isFetchingSurvey = ref(!!route.query.id && !props.initialData);

watch(() => props.initialData, async (newVal) => {
    if (newVal) {
        isFetchingSurvey.value = true;
        await initializeEditSurvey(newVal);
        isFetchingSurvey.value = false;
    } else if (!route.query.id) {
        isFetchingSurvey.value = true;
        initializeNewSurvey();
        isFetchingSurvey.value = false;
    }
    // If route.query.id is present but newVal is null, we just wait for the parent (SurveyView) to fetch and pass it.
}, { immediate: true });

</script>

<style scoped>
/* Ghost & Preview Element Styles (Global because they are injected into body / penetrate child components) */
:global(.custom-ghost-clone .card-header > div:not(.question-type)),
:global(.custom-dragging .card-header > div:not(.question-type)) {
    display: none !important;
}
:global(.custom-ghost-clone .card-footer),
:global(.custom-dragging .card-footer) {
    display: none !important;
}
:global(.custom-ghost-clone .question-options-container),
:global(.custom-ghost-clone .question-type-selector),
:global(.custom-dragging .question-options-container),
:global(.custom-dragging .question-type-selector) {
    display: none !important;
}

/* Make inputs look like plain text in the dragging preview */
:global(.custom-dragging input[type="text"]),
:global(.custom-dragging textarea) {
    pointer-events: none !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    resize: none !important;
    color: inherit !important;
}

/* Add ... to CHOICE preview */
:global(.custom-dragging.type-CHOICE .card::after) {
    content: "...";
    display: block;
    text-align: center;
    color: var(--text-muted);
    font-size: 1.5rem;
    line-height: 0.5;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    letter-spacing: 2px;
}

.section-badge {
    background-color: var(--surface-ground);
    border-bottom-left-radius: var(--border-inner-radius);
    border-bottom-right-radius: var(--border-inner-radius);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
}

.section-badge::before,
.section-badge::after {
    content: "";
    position: absolute;
    top: 0;
    width: var(--border-inner-radius);
    height: var(--border-inner-radius);
}

.section-badge::before {
    left: calc(-1 * var(--border-inner-radius));
    background: radial-gradient(circle at 0 100%, transparent var(--border-inner-radius), var(--surface-ground) var(--border-inner-radius));
}

.section-badge::after {
    right: calc(-1 * var(--border-inner-radius));
    background: radial-gradient(circle at 100% 100%, transparent var(--border-inner-radius), var(--surface-ground) var(--border-inner-radius));
}



.question-drag-handle-container {
    cursor: move !important;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease-in-out;
}

.question-card-wrapper:hover .question-drag-handle-container {
    opacity: 1;
    pointer-events: auto;
}

.drag-handle,
.question-drag-handle,
.section-badge,
.question-drag-handle-container {
    cursor: move !important;
    user-select: none !important;
    -webkit-user-select: none !important;
}

.custom-dragging {
    opacity: 0.25 !important;
}

.custom-floating-card {
    position: fixed;
    z-index: 9999999;
    pointer-events: none !important;
    user-select: none !important;
    transition: none !important;
    will-change: top, left;
    opacity: 0.95;
}

body.custom-dragging-active,
body.custom-dragging-active * {
    cursor: move !important;
    user-select: none !important;
    -webkit-user-select: none !important;
}

</style>