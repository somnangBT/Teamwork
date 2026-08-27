<template>
    <div class="tnak-survey-list-view h-100 d-flex flex-column">
        <div class="row g-3 flex-grow-1">
            <!-- Left Aside: Filters & Actions (col-4) -->
            <div class="col-12 col-md-4 col-lg-4">
                <div class="card p-3 d-flex flex-column gap-3" style="background-color: var(--body-bg-color); border-radius: var(--border-radius); border: 1px solid var(--border-color, rgba(0,0,0,0.06)); position: sticky; top: 1rem;">
                    <div class="d-flex align-items-center justify-content-between">
                        <h6 class="fw-semibold mb-0 d-flex align-items-center gap-2" style="color: var(--text-base); font-size: 1rem;">
                            <Filter :size="16" />
                            <span>Filters & Actions</span>
                        </h6>
                    </div>
                    <div class="main-divider my-0"></div>

                    <!-- Search -->
                    <div>
                        <BaseInput 
                            label="Search Surveys"
                            v-model="searchAndFilter.searchQuery" 
                            placeholder="Search by title..." 
                            :prefixIcon="Search"
                            clearable
                        />
                    </div>



                    <div class="main-divider my-0"></div>

                    <!-- Sort Direction -->
                    <div>
                        <label class="form-label mb-2">Sort Direction</label>
                        <div class="d-flex gap-2">
                            <BaseButton 
                                type="button" 
                                variant="outline-primary" 
                                @click="toggleSortDir"
                                v-tooltip="searchAndFilter.filters.sortDir === 'desc' ? 'Sort: Descending' : 'Sort: Ascending'"
                                class="d-flex align-items-center justify-content-center px-3 w-100"
                            >
                                <ArrowDownAZ v-if="searchAndFilter.filters.sortDir === 'desc'" :size="18" class="me-2" />
                                <ArrowUpZA v-else :size="18" class="me-2" />
                                <span>{{ searchAndFilter.filters.sortDir === 'desc' ? 'Descending' : 'Ascending' }}</span>
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right List: Survey Cards (col-8) -->
            <div class="col-12 col-md-8 col-lg-8 d-flex flex-column">
                <div v-if="surveyStudentStore.states.isLoading" class="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>

                <div v-else-if="filteredSurveys.length === 0" class="flex-grow-1 card d-flex flex-column align-items-center justify-content-center text-muted p-5" style="background-color: var(--body-bg-color); border-radius: var(--border-radius); border: 1px solid var(--border-color, rgba(0,0,0,0.06)); min-height: 300px;">
                    <ClipboardList :size="64" class="mb-3 opacity-25" />
                    <h5 class="fw-bold mb-2">No surveys found</h5>
                    <p class="mb-0">You don't have any surveys matching your criteria.</p>
                </div>

                <div v-else>
                    <div class="row g-3">
                        <div class="col-12 col-md-6" v-for="survey in filteredSurveys" :key="survey.id">
                            <div class="card p-3 h-100 border-0 survey-card" @click="goToSurvey(survey.id)">
                                <div class="card-body d-flex flex-column p-0">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <span class="badge rounded-pill px-3 py-2 fw-medium" :class="getStatusClass(survey)">
                                            {{ getStatusText(survey) }}
                                        </span>
                                    </div>
                                    
                                    <h6 class="fw-medium text-truncate text-base mt-3" style="font-size: 1.125rem;">{{ survey.title }}</h6>
                                    
                                    <div class="d-flex align-items-center gap-3 mb-2 small text-muted flex-wrap">
                                        <span class="d-flex align-items-center gap-1" v-if="survey.createdAt">
                                            Published On : <span class="text-base d-flex gap-1 align-items-center">
                                            <Calendar :size="14" /> {{ formatDate(survey.createdAt) }}
                                            </span>
                                        </span>
                                        <span v-if="survey.targetTeacher" class="d-flex align-items-center gap-1">
                                            <User :size="14" /> {{ survey.targetTeacher.firstName }}
                                        </span>
                                    </div>

                                    <p class="text-muted flex-grow-1"
                                        style="display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.6;">
                                        {{ survey.description || 'No Description' }}
                                    </p>

                                    <div class="main-divider"></div>

                                    <div class="d-flex align-items-center justify-content-between pt-3">
                                        <small class="text-muted fw-medium d-flex align-items-center gap-1">
                                            For : <span class="text-base">{{ survey.target?.name }}</span>
                                        </small>
                                        <BaseButton variant="outline-primary" v-if="!(survey.isCompleted || survey.response?.isCompleted)"
                                            class="d-flex align-items-center gap-1" :class="getButtonClass(survey)"
                                            :disabled="loadingSurveyId === survey.id">
                                            <span v-if="loadingSurveyId === survey.id" class="spinner-border spinner-border-sm me-1" role="status"></span>
                                            <span class="fw-medium">{{ loadingSurveyId === survey.id ? 'Loading...' : getButtonText(survey) }}</span>
                                            <ChevronRight v-if="loadingSurveyId !== survey.id" :size="16" />
                                        </BaseButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <BaseInfiniteScroll
                        v-if="!surveyStudentStore.states.isLoading && filteredSurveys.length > 0"
                        :is-loading="isLoadingMore"
                        :has-more="pagination.page < (surveyStudentStore.states.meta?.totalPages || 1)"
                        @load-more="onLoadMore"
                        class="mt-4"
                    />
                </div>
            </div>
        </div>

        <BaseModal v-model="showUnlockModal" title="Unlock Survey" size="sm" @close="accessCode = ''">
            <p class="text-base mb-3">This survey requires an access code to participate.</p>
            <div class="d-flex flex-column gap-2">
                <BaseInput id="accessCode" required v-model="accessCode" label="Access Code" placeholder="Enter code..." class="w-100" @keyup.enter="submitUnlock" />
            </div>
            <template #footer>
                <div class="d-flex justify-content-end gap-2 w-100">
                    <BaseButton variant="outline-primary" @click="showUnlockModal = false">Cancel</BaseButton>
                    <BaseButton variant="primary" @click="submitUnlock" :is-loading="isUnlocking" :disabled="!accessCode || isUnlocking">
                        {{ isUnlocking ? 'Unlocking...' : 'Unlock' }}
                    </BaseButton>
                </div>
            </template>
        </BaseModal>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSurveyStudentStore } from '@/stores/surveys/surveyStudent';
import { Search, ClipboardList, MapPin, ChevronRight, CheckCircle2, Clock, AlertCircle, Calendar, User, Filter, ArrowDownAZ, ArrowUpZA } from '@lucide/vue';
import { formatDate } from '@/utils/dateFormat';
import BaseInfiniteScroll from '@/components/base/BaseInfiniteScroll.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';

const router = useRouter();
const surveyStudentStore = useSurveyStudentStore();

const searchAndFilter = ref({
    searchQuery: '',
    filters: {
        sortDir: 'desc'
    }
});

const toggleSortDir = () => {
    searchAndFilter.value.filters.sortDir = searchAndFilter.value.filters.sortDir === 'desc' ? 'asc' : 'desc';
};

const filteredSurveys = computed(() => {
    return surveyStudentStore.states.surveyStudent || [];
});

const pagination = ref({
    page: 1,
    limit: 6
});

const isLoadingMore = ref(false);

const fetchSurveys = async (append = false) => {
    if (append) {
        isLoadingMore.value = true;
    }
    await surveyStudentStore.getAllSurveyStudent({
        _page: pagination.value.page,
        _per_page: pagination.value.limit,
        search: searchAndFilter.value.searchQuery,
        sortDir: searchAndFilter.value.filters.sortDir
    }, false, append);
    
    if (append) {
        isLoadingMore.value = false;
    }
};

const onLoadMore = () => {
    if (pagination.value.page < (surveyStudentStore.states.meta?.totalPages || 1)) {
        pagination.value.page++;
        fetchSurveys(true);
    }
};


let searchTimeout;
watch(searchAndFilter, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        pagination.value.page = 1;
        fetchSurveys(false);
    }, 500);
}, { deep: true });

watch(() => surveyStudentStore.states.refreshTrigger, () => {
    pagination.value.page = 1;
    fetchSurveys(false);
});

const showUnlockModal = ref(false);
const accessCode = ref('');
const selectedSurvey = ref(null);
const isUnlocking = ref(false);
const loadingSurveyId = ref(null);

const goToSurvey = async (id) => {
    if (loadingSurveyId.value) return; // Prevent multiple clicks

    const targetSurvey = filteredSurveys.value.find(s => s.id === id);
    if (targetSurvey?.isCompleted || targetSurvey?.response?.isCompleted) {
        return;
    }

    loadingSurveyId.value = id;
    try {
        const success = await surveyStudentStore.getSurveyStudentDetails(id);
        if (success) {
            const detail = surveyStudentStore.states.surveyStudentDetail;
            if (detail?.requiresAccessCode && !detail?.isUnlocked) {
                selectedSurvey.value = detail;
                showUnlockModal.value = true;
                return;
            }
        }

        router.push({ name: 'tnak-survey', params: { id } })
    } finally {
        loadingSurveyId.value = null;
    }
}

const submitUnlock = async () => {
    if (!selectedSurvey.value || !accessCode.value) return;

    isUnlocking.value = true;
    try {
        const success = await surveyStudentStore.unlockSurvey(selectedSurvey.value.id, accessCode.value);

        if (success) {
            await surveyStudentStore.getSurveyStudentDetails(selectedSurvey.value.id, true);
            const updatedDetail = surveyStudentStore.states.surveyStudentDetail;
            if (updatedDetail) {
                selectedSurvey.value = updatedDetail;
                const listIndex = surveyStudentStore.states.surveyStudent.findIndex(s => s.id === selectedSurvey.value.id);
                if (listIndex !== -1) {
                    surveyStudentStore.states.surveyStudent[listIndex].isUnlocked = true;
                }
            } else {
                selectedSurvey.value.isUnlocked = true;
            }
            showUnlockModal.value = false;
            router.push({ name: 'tnak-survey', params: { id: selectedSurvey.value.id } });
            accessCode.value = '';
        }
    } finally {
        isUnlocking.value = false;
    }
}

const getStatusText = (survey) => {
    if (survey.isCompleted || survey.response?.isCompleted) return 'Completed';
    if (survey.isDraft || survey.response?.isDraft) return 'Draft Saved';
    return 'Pending Action';
}

const getStatusClass = (survey) => {
    if (survey.isCompleted || survey.response?.isCompleted) return 'bg-success text-white';
    if (survey.isDraft || survey.response?.isDraft) return 'bg-info text-white';
    return 'bg-warning text-dark';
}

const getStatusIcon = (survey) => {
    if (survey.isCompleted || survey.response?.isCompleted) return CheckCircle2;
    if (survey.isDraft || survey.response?.isDraft) return Clock;
    return AlertCircle;
}

const getStatusIconColor = (survey) => {
    if (survey.isCompleted || survey.response?.isCompleted) return 'text-success';
    if (survey.isDraft || survey.response?.isDraft) return 'text-info';
    return 'text-warning';
}

const getButtonText = (survey) => {
    if (survey.isCompleted || survey.response?.isCompleted) return 'Done';
    if (survey.isDraft || survey.response?.isDraft) return 'Resume';
    return 'Start';
}

const getButtonClass = (survey) => {
    if (survey.isCompleted || survey.response?.isCompleted) return 'pointer-events-none';
    return 'btn-primary';
}

onMounted(() => {
    surveyStudentStore.setupSocketListeners();
    if (!surveyStudentStore.states.surveyStudent?.length) {
        fetchSurveys();
    }
});
</script>

<style scoped>
.survey-card {
    cursor: pointer;
    background: var(--body-bg-color);
}

.pointer-events-none {
    pointer-events: none;
}
</style>
