<template>
    <div class="d-flex flex-column">
        <div class="mb-3 d-flex align-items-center gap-2">
            <BaseInput 
                v-model="searchQuery" 
                placeholder="Search questions..." 
                icon="search"
                class="flex-grow-1"
            />
            <slot name="close"></slot>
        </div>
        
        <div class="flex-grow-1 d-flex flex-column gap-3">
            <div v-if="!questionStore.isLaoding && questionStore.surveyQuestions.length === 0" class="text-center py-5 text-muted">
                <Search :size="32" class="mb-3 opacity-50" />
                <p class="mb-0">No questions found.</p>
            </div>

            <div v-else class="d-flex flex-column gap-3">
                <div v-for="q in availableQuestions" :key="q.id ?? q._id ?? q.questionId" 
                    class="card p-3 transition-all import-question-card bg-body"
                    style="border: var(--border-width) solid var(--border-clr); cursor: pointer;"
                    @click="togglePreview(q.id ?? q._id ?? q.questionId)">
                    
                    <div class="d-flex gap-3 align-items-start">
                        <div class="mt-1 flex-shrink-0" style="cursor: move;" @mousedown.stop.prevent="onDragStart($event, q)">
                            <GripVertical class="text-secondary opacity-50" :size="20" style="pointer-events: none;" />
                        </div>
                        <div class="flex-grow-1 min-w-0" style="pointer-events: none;">
                            <template v-if="previewQuestionId === (q.id ?? q._id ?? q.questionId)">
                                <component :is="getQuestionComponent(q.questionType || q.type)" :initial-data="q" :is-active="false" style="border: none !important; padding: 0 !important; background: transparent !important; box-shadow: none !important;" />
                            </template>
                            <template v-else>
                                <div class="fw-medium text-base mb-2 text-wrap" :title="q.questionText || q.title || q.name">
                                    {{ q.questionText || q.title || q.name || 'Untitled Question' }}
                                    <span v-if="q.isRequired" class="text-danger">*</span>
                                </div>
                                <div class="d-flex flex-wrap align-items-center gap-2">
                                    <BaseBadge variant="secondary" class="small d-flex align-items-center gap-1">
                                        <component :is="getTypeIcon(q.questionType || q.type)" :size="12" />
                                        {{ q.questionType || q.type || 'TEXT' }}
                                    </BaseBadge>
                                    <span v-if="q.options?.length" class="text-muted small d-flex align-items-center gap-1">
                                        <Check :size="12" /> {{ q.options.length }} options
                                    </span>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <BaseInfiniteScroll
                    :is-loading="questionStore.isLaoding"
                    :has-more="hasMore"
                    @load-more="onLoadMore"
                />
            </div>
        </div>

        <slot name="footer"></slot>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Search, Check, GripVertical, AlignLeft, CircleDot, Star } from '@lucide/vue';
import BaseInfiniteScroll from '@/components/base/BaseInfiniteScroll.vue';
import { useSurveyQuestionStore } from '@/stores/surveys/surveyQuestion';
import ChoiceQuestionForm from '@/components/forms/surveys/ChoiceQuestionForm.vue';
import TextQuestionForm from '@/components/forms/surveys/TextQuestionForm.vue';
import RatingQuestionForm from '@/components/forms/surveys/RatingQuestionForm.vue';

const props = defineProps({
    startCustomDrag: {
        type: Function,
        default: null
    },
    existingQuestionIds: {
        type: Array,
        default: () => []
    }
});
const questionStore = useSurveyQuestionStore();

const previewQuestionId = ref(null);
const togglePreview = (id) => {
    if (previewQuestionId.value === id) {
        previewQuestionId.value = null;
    } else {
        previewQuestionId.value = id;
    }
};

const getQuestionComponent = (type) => {
    const normalizedType = type?.toUpperCase() || 'TEXT';
    switch (normalizedType) {
        case 'CHOICE': return ChoiceQuestionForm;
        case 'RATING': return RatingQuestionForm;
        case 'TEXT':
        default: return TextQuestionForm;
    }
};

const getTypeIcon = (type) => {
    const normalizedType = type?.toUpperCase() || 'TEXT';
    switch (normalizedType) {
        case 'CHOICE': return CircleDot;
        case 'RATING': return Star;
        case 'TEXT':
        default: return AlignLeft;
    }
};

const searchQuery = ref('');
const page = ref(1);
const perPage = ref(15);
const sortBy = ref('createdAt');
const sortOrder = ref('desc');

const hasMore = computed(() => {
    return page.value < (questionStore.surveyQuestionsMeta?.totalPages || 1);
});

const availableQuestions = computed(() => {
    const seenIds = new Set();
    return questionStore.surveyQuestions.filter(q => {
        const qId = q.id ?? q._id ?? q.questionId;
        if (seenIds.has(qId)) return false;
        if (props.existingQuestionIds.includes(qId)) return false;
        
        seenIds.add(qId);
        return true;
    });
});

const onDragStart = (e, q) => {
    if (props.startCustomDrag) {
        props.startCustomDrag(e, 'import_question', null, null, q);
    }
};

let searchTimeout = null;
watch(searchQuery, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        page.value = 1;
        fetchData(false);
    }, 500);
});

const fetchData = (append = false) => {
    questionStore.getAllSurveyQuestions({
        page: page.value,
        _per_page: perPage.value,
        search: searchQuery.value,
        sortBy: sortBy.value,
        sortDir: sortOrder.value
    }, append);
};

const onLoadMore = () => {
    page.value++;
    fetchData(true);
};

onMounted(() => {
    fetchData(false);
});
</script>
