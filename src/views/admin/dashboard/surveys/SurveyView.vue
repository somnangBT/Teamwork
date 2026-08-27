<template>
    <div>
        <Tabs v-model:value="activeTab" scrollable class="card gap-2 p-2" style="background-color: var(--surface-ground);">
        <div>
            <TabList>
                <Tab value="survey-list" :disabled="activeTab === 'survey-form' || activeTab === 'survey-target-form'">
                    <div class="d-flex align-items-center gap-2">
                        <ScrollText style="color: var(--success-color);" :size="16" />
                        All Surveys List
                    </div>
                </Tab>
                <Tab value="survey-target" :disabled="activeTab === 'survey-form' || activeTab === 'survey-target-form'">
                    <div class="d-flex align-items-center gap-2">
                        <MapPinPen style="color: var(--success-color);" :size="16" />
                        Target Survey
                    </div>
                </Tab>
                <Tab value="survey-form" v-show="activeTab === 'survey-form'">
                    <div class="d-flex align-items-center gap-2">
                        <FileSignature style="color: var(--primary-color);" :size="16" />
                        {{ editingSurvey ? 'Edit Survey' : 'New Survey' }}
                    </div>
                </Tab>
                <Tab value="survey-target-form" v-show="activeTab === 'survey-target-form'">
                    <div class="d-flex align-items-center gap-2">
                        <FileSignature style="color: var(--primary-color);" :size="16" />
                        {{ editingSurveyTarget ? 'Edit Target' : 'New Target' }}
                    </div>
                </Tab>
                <Tab value="survey-response" v-show="activeTab === 'survey-response'" @click="onResponseClose">
                    <div class="d-flex align-items-center gap-2">
                        <ArrowLeft :size="16" />
                        Survey Responses (Back)
                    </div>
                </Tab>
            </TabList>
        </div>
        <TabPanels class="p-0 bg-transparent">
            <TabPanel value="survey-list">
                <SurveyListView v-if="activeTab === 'survey-list'" @edit="onEditSurvey" @new="onNewSurvey" @view-response="onViewResponse" />
            </TabPanel>
            <TabPanel value="survey-target">
                <SurveyTargetView v-if="activeTab === 'survey-target'" @edit="onEditSurveyTarget" @new="onNewSurveyTarget" />
            </TabPanel>
            <TabPanel value="survey-form">
                <SurveyFormView v-if="activeTab === 'survey-form'" :initial-data="editingSurvey" @close="onFormClose" />
            </TabPanel>
            <TabPanel value="survey-target-form">
                <SurveyTargetFormView v-if="activeTab === 'survey-target-form'" :initial-data="editingSurveyTarget" @close="onTargetFormClose" />
            </TabPanel>
            <TabPanel value="survey-response">
                <SurveyResponseView v-if="activeTab === 'survey-response'" :id="viewingResponseId" @close="onResponseClose" />
            </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<script setup>
import { Tab, TabList, TabPanels, TabPanel, Tabs } from 'primevue';
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SurveyListView from './SurveyListView.vue';
import SurveyTargetView from './SurveyTargetView.vue';
import SurveyFormView from './SurveyFormView.vue';
import SurveyTargetFormView from './SurveyTargetFormView.vue';
import SurveyResponseView from './SurveyResponseView.vue';
import { useSurveyStore } from '@/stores/surveys/survey';
import { useSurveyTargetStore } from '@/stores/surveys/surveyTarget';
import { ScrollText, MapPinPen, FileSignature, ArrowLeft } from '@lucide/vue';

const route = useRoute();
const router = useRouter();
const surveyStore = useSurveyStore();
const surveyTargetStore = useSurveyTargetStore();

const activeTab = ref('survey-list');
const VALID_TABS = ['survey-list', 'survey-target', 'survey-form', 'survey-target-form', 'survey-response'];
const editingSurvey = ref(null);
const editingSurveyTarget = ref(null);
const viewingResponseId = ref(null);

const onEditSurvey = (survey) => {
    editingSurvey.value = survey;
    router.push({ query: { ...route.query, tab: 'survey-form', id: survey.id } });
};

const onNewSurvey = () => {
    editingSurvey.value = null;
    const { id, targetId, responseId, ...restQuery } = route.query;
    router.push({ query: { ...restQuery, tab: 'survey-form' } });
};

const onFormClose = async () => {
    const isEdit = !!editingSurvey.value;
    const { id, targetId, responseId, ...restQuery } = route.query;
    router.push({ query: { ...restQuery, tab: 'survey-list' } });
    editingSurvey.value = null;
    
    if (isEdit) {
        await surveyStore.getAllSurveys();
    } else {
        await surveyStore.getAllSurveys({ showLoading: true });
    }
};

const onViewResponse = (id) => {
    viewingResponseId.value = id;
    router.push({ query: { ...route.query, tab: 'survey-response', responseId: id } });
};

const onResponseClose = () => {
    const { responseId, ...restQuery } = route.query;
    router.push({ query: { ...restQuery, tab: 'survey-list' } });
    viewingResponseId.value = null;
};

const onEditSurveyTarget = (target) => {
    editingSurveyTarget.value = target;
    router.push({ query: { ...route.query, tab: 'survey-target-form', targetId: target.id } });
};

const onNewSurveyTarget = () => {
    editingSurveyTarget.value = null;
    const { id, targetId, responseId, ...restQuery } = route.query;
    router.push({ query: { ...restQuery, tab: 'survey-target-form' } });
};

const onTargetFormClose = async () => {
    const { id, targetId, responseId, ...restQuery } = route.query;
    router.push({ query: { ...restQuery, tab: 'survey-target' } });
    editingSurveyTarget.value = null;
    surveyTargetStore.page = 1;
    await surveyTargetStore.getSurveyTargets({ forceRefresh: true });
};

onMounted(async () => {
    if (route.query.tab && VALID_TABS.includes(route.query.tab)) {
        activeTab.value = route.query.tab;
    } else if (route.query.tab) {
        // Fix the URL if tab is invalid
        const { tab, ...restQuery } = route.query;
        router.replace({ query: { ...restQuery, tab: activeTab.value } });
    }

    if (route.query.id && activeTab.value === 'survey-form') {
        const id = route.query.id;
        const survey = await surveyStore.getSurveyById(id);
        if (survey) {
            editingSurvey.value = survey;
        } else {
            const { id: _, tab, ...restQuery } = route.query;
            router.replace({ query: { ...restQuery, tab: 'survey-list' } });
        }
    }
    
    if (route.query.responseId && activeTab.value === 'survey-response') {
        viewingResponseId.value = route.query.responseId;
    }
    
    if (route.query.targetId && activeTab.value === 'survey-target-form') {
        const tId = route.query.targetId;
        // In a real app we might fetch by ID, but we can just use the store list for now
        await surveyTargetStore.getSurveyTargets();
        const target = surveyTargetStore.surveyTargets.find(t => t.id == tId);
        if (target) {
            editingSurveyTarget.value = target;
        } else {
            const { targetId: _, tab, ...restQuery } = route.query;
            router.replace({ query: { ...restQuery, tab: 'survey-target' } });
        }
    }
});

watch(() => route.query.tab, (newTab) => {
    if (newTab && VALID_TABS.includes(newTab)) {
        activeTab.value = newTab;
    }
});

watch(activeTab, (newTab) => {
    if (route.query.tab !== newTab) {
        router.push({ query: { ...route.query, tab: newTab } });
    }
});
</script>