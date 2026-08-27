<template>
    <div class="question-tab">
        <div v-if="!questions || questions.length === 0" class="text-center text-muted p-4">
            No questions available for this survey.
        </div>

        <div v-else>
            <!-- Navigation Header -->
            <div class="card p-3 mb-3 d-flex flex-row align-items-center justify-content-between" style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
                <BaseButton 
                    variant="outline-primary" 
                    class="d-flex align-items-center gap-2"
                    :disabled="currentIndex <= 0"
                    @click="goToPrevious"
                >
                    <ChevronLeft :size="16" />
                </BaseButton>

                <div class="text-center flex-grow-1 mx-3">
                    <span class="text-muted">Question {{ currentIndex + 1 }} of {{ totalQuestions }}</span>
                </div>

                <BaseButton 
                    variant="outline-primary" 
                    class="d-flex align-items-center gap-2"
                    :disabled="currentIndex >= totalQuestions - 1"
                    @click="goToNext"
                >
                    <ChevronRight :size="16" />
                </BaseButton>
            </div>

            <!-- Content Area -->
            <div v-if="surveyStore.isQuestionLoading" class="text-center p-5 text-muted">
                Loading question data...
            </div>
            
            <div v-else-if="questionData" class="question-content">
                <div class="card py-3 px-4 mb-2" style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
                    <h5 class="fw-medium mb-3">{{ questionData.question.questionText }}</h5>
                    <div class="d-flex align-items-center gap-3 text-muted small">
                        <span class="badge text-base" style="background-color: var(--surface-ground);">{{ questionData.question.questionType }}</span>
                        <span>{{ questionData.question.totalAnswers }} responses</span>
                    </div>
                </div>

                <!-- Choice Counts (Grouped View) -->
                <div v-if="choiceCounts">
                    <div class="d-flex flex-column gap-2 mb-3">
                        <div 
                            v-for="(group, idx) in choiceCounts" 
                            :key="idx" 
                            class="card p-0"
                            style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);"
                        >
                            <div class="py-3 px-4 d-flex align-items-center">
                                <div v-if="group.type === 'RATING'" class="d-flex align-items-center gap-1">
                                    <Star v-for="n in group.ratingValue" :key="n" :size="18"
                                          class="text-warning"
                                          fill="currentColor"
                                          :stroke-width="0" />
                                </div>
                                <span v-else class="fw-medium" style="color: var(--text-heading-color); font-size: 1.05rem;">{{ group.text }}</span>
                            </div>
                            <div class="pb-3 px-4">
                            <hr class="main-divider text-muted mt-0" />
                                <span class="fw-semibold text-primary" style="font-size: 0.95rem;">
                                    {{ group.count }} {{ group.count === 1 ? 'response' : 'responses' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Text / Rating (Individual List) -->
                <div v-else-if="questionData.question.answers?.length > 0">
                    <div class="card p-0 mb-3" style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
                        <div class="list-group list-group-flush" style="border-radius: var(--border-inner-radius);">
                            <div 
                                v-for="(answer, idx) in questionData.question.answers" 
                                :key="answer.answerId" 
                                class="list-group-item py-3 px-4"
                                style="background-color: transparent;"
                            >
                                <div class="d-flex w-100 justify-content-between mb-1">
                                    <small class="text-muted">Response #{{ (page - 1) * perPage + idx + 1 }}</small>
                                    <small class="text-muted">{{ new Date(answer.answeredAt).toLocaleString() }}</small>
                                </div>
                                <div v-if="answer.answerRating" class="d-flex align-items-center gap-1 mb-1">
                                    <Star v-for="n in answer.answerRating" :key="n" :size="18"
                                          class="text-warning"
                                          fill="currentColor"
                                          :stroke-width="0" />
                                </div>
                                <p v-else class="mb-1 fw-medium" style="color: var(--text-heading-color);">
                                    {{ answer.answerChoice || answer.answerText || 'N/A' }}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Pagination -->
                    <div class="d-flex justify-content-end" v-if="questionData.meta?.totalPages > 1">
                        <BasePagination
                            :current-page="page"
                            :total-pages="questionData.meta.totalPages"
                            @page-change="onPageChange"
                        />
                    </div>
                </div>
                <div v-else class="text-center p-4 text-muted card" style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
                    No responses for this question yet.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { ChevronLeft, ChevronRight, Circle, Star } from '@lucide/vue';
import { useSurveyStore } from '@/stores/surveys/survey';

const props = defineProps({
    surveyId: {
        type: [String, Number],
        required: true
    },
    questions: {
        type: Array,
        default: () => []
    }
});

const surveyStore = useSurveyStore();

// State
const currentQuestionId = ref(null);
const page = ref(1);
const perPage = ref(10);

// Computed
const questionsList = computed(() => {
    return props.questions.map(q => q.surveyQuestionId);
});

const totalQuestions = computed(() => questionsList.value.length);

const currentIndex = computed(() => {
    if (!currentQuestionId.value) return 0;
    return questionsList.value.findIndex(id => id === currentQuestionId.value);
});

const questionData = computed(() => surveyStore.surveyQuestionResponses);

const choiceCounts = computed(() => {
    const q = questionData.value?.question;
    
    if (q?.questionType === 'CHOICE' && q?.summary?.optionCounts) {
        if (q.options) {
            return q.options.map(opt => ({
                text: opt,
                count: q.summary.optionCounts[opt] || 0,
                type: 'CHOICE'
            })).filter(item => item.count > 0);
        } else {
            return Object.entries(q.summary.optionCounts).map(([text, count]) => ({
                text,
                count,
                type: 'CHOICE'
            })).filter(item => item.count > 0);
        }
    } else if (q?.questionType === 'RATING' && q?.summary?.distribution) {
        return Object.entries(q.summary.distribution).map(([rating, count]) => ({
            text: `${rating} Star${parseInt(rating) !== 1 ? 's' : ''}`,
            ratingValue: parseInt(rating),
            count,
            type: 'RATING'
        })).filter(item => item.count > 0).sort((a, b) => b.ratingValue - a.ratingValue);
    }
    
    return null;
});

// Methods
const fetchQuestionData = async () => {
    if (!currentQuestionId.value) return;
    
    await surveyStore.getSurveyQuestionResponses(props.surveyId, {
        questionId: currentQuestionId.value,
        _page: page.value,
        _per_page: perPage.value
    });
};

const goToNext = () => {
    if (currentIndex.value < totalQuestions.value - 1) {
        currentQuestionId.value = questionsList.value[currentIndex.value + 1];
        page.value = 1;
    }
};

const goToPrevious = () => {
    if (currentIndex.value > 0) {
        currentQuestionId.value = questionsList.value[currentIndex.value - 1];
        page.value = 1;
    }
};

const onPageChange = (newPage) => {
    page.value = newPage;
    fetchQuestionData();
};

// Watchers
watch(currentQuestionId, () => {
    fetchQuestionData();
});

// Initialization
onMounted(() => {
    if (questionsList.value.length > 0) {
        currentQuestionId.value = questionsList.value[0];
    }
});
</script>

<style scoped>
.list-group-item:last-child {
    border-bottom: none !important;
}
</style>
