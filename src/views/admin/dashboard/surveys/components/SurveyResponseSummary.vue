<template>
    <div class="summary-tab">
        <div v-if="!questions || questions.length === 0" class="text-center text-muted p-4">
            No questions available for this survey.
        </div>
        
        <div v-else>
            <div v-for="section in groupedQuestions" :key="section.sectionId" class="section mb-3">
                <div class="card px-3 py-2 mb-0 border-0 d-flex flex-row align-items-center justify-content-between" style="background-color: var(--primary-color); border-bottom-left-radius: 0; border-bottom-right-radius: 0; border-top-right-radius: var(--border-inner-radius) !important; border-top-left-radius: var(--border-inner-radius) !important;">
                    <div class="section-title m-0 fw-medium" style="color: var(--text-white);">{{ section.sectionTitle }}</div>
                </div>
                
                <div class="d-flex flex-column gap-2">
                    <div v-for="(q, idx) in section.questions" :key="q.surveyQuestionId" class="col-12">
                        <div class="card px-3 py-2 h-100 " :style="idx === 0 ? 'background-color: var(--body-bg-color); border-top-left-radius: 0; border-top-right-radius: 0; border-bottom-left-radius: var(--border-inner-radius); border-bottom-right-radius: var(--border-inner-radius);' : 'background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);'">
                            <p class="fw-medium mb-3">{{ q.orderIndex }}. {{ q.questionText }}</p>
                            
                            <div class="card-body p-0">
                                <!-- Pie Chart -->
                                <div v-if="q.summary?.chartType === 'pie' || q.summary?.chartType === 'bar'" class="d-flex justify-content-center">
                                    <PieChart 
                                        :type="q.summary.chartType === 'bar' ? 'bar' : 'doughnut'"
                                        :labels="q.questionType === 'RATING' ? q.summary.labels.map(l => `${l} Star${l == '1' ? '' : 's'}`) : q.summary.labels" 
                                        :data-values="q.summary.datasets[0].data"
                                        title=""
                                        :show-custom-legend="true"
                                        :hide-wrapper="true"
                                        layout="row"
                                        style="width: 100%; max-width: 600px;"
                                    />
                                </div>

                                <div v-else-if="q.summary?.chartType === 'text'">
                                    <div v-if="q.summary.answers?.length > 0" class="text-responses-list">
                                        <div v-for="(ans, idx) in q.summary.answers" :key="idx" 
                                            class="px-3 py-2 mb-2 rounded" style="background-color: var(--surface-ground); border: 1px solid var(--border-color);">
                                            {{ ans.answer }}
                                        </div>
                                    </div>
                                    <div v-else class="text-muted fst-italic">No text responses yet.</div>
                                </div>
                            
                                <div v-else>
                                    <p class="text-muted fst-italic">No summary data available.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import PieChart from '@/components/charts/PieChart.vue';

const props = defineProps({
    questions: {
        type: Array,
        default: () => []
    }
});

const groupedQuestions = computed(() => {
    const groups = {};
    
    props.questions.forEach(q => {
        if (!groups[q.sectionId]) {
            groups[q.sectionId] = {
                sectionId: q.sectionId,
                sectionTitle: q.sectionTitle,
                questions: [],
                totalResponses: 0
            };
        }
        groups[q.sectionId].questions.push(q);
        groups[q.sectionId].totalResponses = Math.max(groups[q.sectionId].totalResponses, q.summary?.totalAnswers || 0);
    });
    
    return Object.values(groups);
});
</script>
