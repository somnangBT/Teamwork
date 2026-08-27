<template>
    <div class="pb-3">
        <div class="d-flex flex-column align-items-center">
            <div style="max-width: 800px; width: 100%;" class="px-2">

                    <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="height: 300px;">
                        <span class="spinner-border text-primary" role="status"></span>
                    </div>

                    <div v-else-if="surveyStore.surveyReponses && surveyStore.surveyReponses.survey">
                        <div class="page-header card py-3 px-4 mb-3" style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius); border-top: 8px solid var(--primary-color) !important;">
                            <h4 class="fw-semibold mb-2">{{ surveyStore.surveyReponses?.survey?.title }}</h4>
                            <p class="text-muted">{{ surveyStore.surveyReponses?.survey?.description }}</p>

                            <div class="main-divider mb-3"></div>

                            <div class="survey-meta d-flex gap-3">
                                <div>
                                    <span class="text-muted small d-block">Total Responses</span>
                                    <span class="fw-semibold text-lg">{{ surveyStore.surveyReponses?.totalResponses || 0 }}</span>
                                </div>
                                <div>
                                    <span class="text-muted small d-block">Total Questions</span>
                                    <span class="fw-semibold text-lg">{{ surveyStore.surveyReponses?.totalQuestions || 0 }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Response Tabs -->
                        <Tabs v-model:value="activeResponseTab" class="w-100">
                            <TabList class="w-100 d-flex mb-3" style="border-bottom: 2px solid var(--border-color);">
                                <Tab value="summary" class="flex-grow-1 text-center py-2 fw-medium">Summary</Tab>
                                <Tab value="question" class="flex-grow-1 text-center py-2 fw-medium">Question</Tab>
                                <Tab value="individual" class="flex-grow-1 text-center py-2 fw-medium">Individual</Tab>
                            </TabList>
                            <TabPanels class="p-0 bg-transparent">
                                <TabPanel value="summary">
                                    <SurveyResponseSummary 
                                        v-if="activeResponseTab === 'summary'"
                                        :questions="surveyStore.surveyReponses?.questions || []" 
                                    />
                                </TabPanel>
                                <TabPanel value="question">
                                    <SurveyResponseQuestion 
                                        v-if="activeResponseTab === 'question'" 
                                        :surveyId="id" 
                                        :questions="surveyStore.surveyReponses?.questions || []" 
                                    />
                                </TabPanel>
                                <TabPanel value="individual">
                                    <SurveyResponseIndividual 
                                        v-if="activeResponseTab === 'individual'" 
                                        :surveyId="id" 
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </div>

                    <div v-else class="text-center p-5 text-muted card" style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
                        No response data found.
                    </div>
                </div>
            </div>
        </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSurveyStore } from '@/stores/surveys/survey';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primevue';

// Subcomponents
import SurveyResponseSummary from './components/SurveyResponseSummary.vue';
import SurveyResponseQuestion from './components/SurveyResponseQuestion.vue';
import SurveyResponseIndividual from './components/SurveyResponseIndividual.vue';

const emit = defineEmits(['close']);
const props = defineProps(['id']);
const surveyStore = useSurveyStore();

const isLoading = ref(false);
const activeResponseTab = ref('summary');

onMounted(async () => {
    if (props.id) {
        isLoading.value = true;
        await surveyStore.getSurveyResponses(props.id);
        isLoading.value = false;
    }
});
</script>

<style scoped>
:deep(.p-tab) {
    transition: all 0.2s ease;
    border-bottom: 3px solid transparent;
}
:deep(.p-tab[aria-selected="true"]) {
    border-bottom-color: var(--primary-color);
    color: var(--primary-color);
}
</style>
