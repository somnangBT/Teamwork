<template>
    <div class="individual-tab">
        <div v-if="surveyStore.isIndividualLoading" class="text-center p-4 text-muted">
            Loading response data...
        </div>

        <div v-else-if="individualData && individualData.response">
            <!-- Navigation Header -->
            <div class="card p-3 mb-3 d-flex flex-row align-items-center justify-content-between" style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
                <BaseButton 
                    variant="outline-primary" 
                    class="d-flex align-items-center gap-2"
                    :disabled="currentIndex <= 1"
                    @click="goToPrevious"
                >
                    <ChevronLeft :size="16" />
                </BaseButton>

                <div class="text-center flex-grow-1 mx-3 ">
                    <span class="text-muted">Response {{ currentIndex }} of {{ totalResponses }}</span>
                </div>

                <BaseButton 
                    variant="outline-primary" 
                    class="d-flex align-items-center gap-2"
                    :disabled="currentIndex >= totalResponses"
                    @click="goToNext"
                >
                    <ChevronRight :size="16" />
                </BaseButton>
            </div>

            <!-- Respondent Info  -->
            <div class="card p-3 mb-3 " style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
                <div class="d-flex align-items-center gap-3">
                    <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; background-color: var(--surface-hover); border: 1px solid var(--border-color);">
                        <User :size="30" class="text-muted" />
                    </div>
                    
                    <div>
                        <h6 class="fw-semibold mb-1 m-0">{{ respondent.firstName }} {{ respondent.lastName }}</h6>
                        <p class="text-muted small mb-0">{{ respondent.email }}</p>
                        <p class="text-muted small mb-0 mt-1">Submitted at: {{ new Date(individualData.response.submittedAt).toLocaleString() }}</p>
                    </div>
                </div>
            </div>

            <!-- Answers List -->
            <div class="answers-list d-flex flex-column gap-4 mb-3">
                <div v-for="section in groupedAnswers" :key="section.sectionId" class="section">
                    <div class="card px-3 py-2 mb-0 border-0" style="background-color: var(--primary-color); border-bottom-left-radius: 0; border-bottom-right-radius: 0; border-top-right-radius: var(--border-inner-radius) !important; border-top-left-radius: var(--border-inner-radius) !important;">
                        <div class="m-0 fw-medium" style="color: var(--text-white);">{{ section.sectionTitle }}</div>
                    </div>
                    
                    <div class="d-flex flex-column gap-2">
                        <div 
                            v-for="(ans, idx) in section.answers" 
                            :key="ans.surveyQuestionId"
                            class="card p-4"
                            :style="idx === 0 ? 'background-color: var(--body-bg-color); border-top-left-radius: 0; border-top-right-radius: 0; border-bottom-left-radius: var(--border-inner-radius); border-bottom-right-radius: var(--border-inner-radius);' : 'background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);'"
                        >
                            <h6 class="mb-3">{{ ans.orderIndex }}. {{ ans.questionText }}</h6>
                            
                            <div class="px-3 py-2 rounded" style="background-color: var(--surface-ground); border: 1px solid var(--border-color);">
                                <p class="mb-0" style="color: var(--text-heading-color);">
                                    {{ ans.answer?.answerChoice || ans.answer?.answerText || (ans.answer?.answerRating ? `${ans.answer.answerRating} Stars` : 'No answer provided') }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center p-4 text-muted">
            No individual responses found.
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { ChevronLeft, ChevronRight, User } from '@lucide/vue';
import { useSurveyStore } from '@/stores/surveys/survey';

const props = defineProps({
    surveyId: {
        type: [String, Number],
        required: true
    }
});

const surveyStore = useSurveyStore();

const responseIndex = ref(1);

const individualData = computed(() => surveyStore.surveyIndividualResponse);

const currentIndex = computed(() => individualData.value?.navigation?.currentIndex || 1);
const totalResponses = computed(() => individualData.value?.navigation?.totalResponses || 0);
const respondent = computed(() => individualData.value?.response?.respondent || {});

const groupedAnswers = computed(() => {
    const answers = individualData.value?.response?.answers || [];
    const groups = {};
    
    answers.forEach(ans => {
        if (!groups[ans.sectionId]) {
            groups[ans.sectionId] = {
                sectionId: ans.sectionId,
                sectionTitle: ans.sectionTitle,
                answers: []
            };
        }
        groups[ans.sectionId].answers.push(ans);
    });
    
    return Object.values(groups);
});

const fetchIndividualData = async () => {
    if (surveyStore.surveyReponses && surveyStore.surveyReponses.totalResponses === 0) {
        surveyStore.surveyIndividualResponse = null;
        return;
    }
    
    await surveyStore.getSurveyIndividualResponse(props.surveyId, {
        responseIndex: responseIndex.value
    });
};

const goToNext = () => {
    if (responseIndex.value < totalResponses.value) {
        responseIndex.value++;
    }
};

const goToPrevious = () => {
    if (responseIndex.value > 1) {
        responseIndex.value--;
    }
};

watch(responseIndex, () => {
    fetchIndividualData();
});


onMounted(() => {
    fetchIndividualData();
});
</script>
