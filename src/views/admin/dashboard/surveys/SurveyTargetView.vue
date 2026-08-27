<template>
    <div>
        <div class="card p-2 mb-2" style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div class="d-flex align-items-center gap-2 flex-grow-1 search-sort-container" style="min-width: 250px;">
                    <div class="flex-grow-1 search-container">
                        <BaseInput 
                            v-model="searchAndFilter.searchQuery.value" 
                            placeholder="Search by target name..." 
                            :prefixIcon="Search"
                            clearable
                        />
                    </div>
                    <BaseButton 
                        type="button" 
                        variant="outline-primary" 
                        @click="toggleSortOrder"
                        v-tooltip="searchAndFilter.filters.value.sortDir === 'desc' ? 'Sort: Newest First' : 'Sort: Oldest First'"
                        class="h-100 flex-shrink-0"
                    >
                        <ClockArrowDown v-if="searchAndFilter.filters.value.sortDir === 'desc'" :size="18" />
                        <ClockArrowUp v-else :size="18" />
                    </BaseButton>
                </div>
                <div class="button-container flex-shrink-0">
                    <BaseButton class="btn btn-primary text-nowrap w-100 h-100" @click="onCreate()">
                        New Target
                    </BaseButton>
                </div>
            </div>
        </div>

        <SurveyTargetSkeleton v-if="surveyTargetStore.isLoading || isInitialLoad" :count="4" />
        <div v-else-if="!surveyTargetStore.surveyTargets?.length">
            <DashboardEmptyData 
                title="No Survey Targets Found" 
                description="Get started by creating your very first survey target using the new target button." 
            />
        </div>
        <div v-else class="row g-2 mb-2">
            <div class="col-md-4 col-sm-6" v-for="target in surveyTargetStore.surveyTargets" :key="target.id">
                <div class="card p-2 gap-2" style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius);">
                    <div class="card-header pe-2 py-1 bg-transparent d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-2 fw-semibold text-base text-truncate" style="color: var(--text-heading-color);">
                            <MapPinPen :size="18" :style="{ color: getCategoryColorHex(target.name) }" :stroke-width="2.5" class="flex-shrink-0" />
                            <span class="text-truncate" v-tooltip="target?.name">{{ target?.name }}</span>
                        </div>
                        <div>
                            <BaseActionMenu :items="getActionItems(target)" />
                        </div>
                    </div>
                    
                    <div class="card-body"
                        style="background-color: var(--surface-ground); border-radius: calc(var(--border-inner-radius) - 0.5rem) !important">
                        <div class="mb-0 text-muted small">
                            Survey target group
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <BaseInfiniteScroll 
            v-if="surveyTargetStore.surveyTargets?.length"
            :is-loading="isLoadingMore"
            :has-more="surveyTargetStore.page < surveyTargetStore.totalPages"
            @load-more="loadMore"
        />
    </div>
</template>

<script setup>
import { useSurveyTargetStore } from '@/stores/surveys/surveyTarget';
import { Search, Pencil, Trash, ClockArrowDown, ClockArrowUp, MapPinPen } from '@lucide/vue';
import { getCategoryColorHex } from '@/utils/statusTheme';
import { onMounted, watch, ref } from 'vue';
import SurveyTargetSkeleton from '@/components/skeletons/SurveyTargetSkeleton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseActionMenu from '@/components/base/BaseActionMenu.vue';
import BaseInfiniteScroll from '@/components/base/BaseInfiniteScroll.vue';
import DashboardEmptyData from '@/components/common/DashboardEmptyData.vue';

import { useSearchAndFilter } from '@/composables/common/useSearchAndFilter.js';

const emit = defineEmits(['edit', 'new']);
const surveyTargetStore = useSurveyTargetStore();
const isLoadingMore = ref(false);
const isInitialLoad = ref(true);

const toggleSortOrder = () => {
    searchAndFilter.filters.value.sortDir = searchAndFilter.filters.value.sortDir === 'desc' ? 'asc' : 'desc';
};

const handleFilterChange = async (filters) => {
    surveyTargetStore.search = filters.search;
    surveyTargetStore.sortOrder = filters.sortDir;
    surveyTargetStore.page = 1;
    await surveyTargetStore.getSurveyTargets({ showLoading: true });
};

const searchAndFilter = useSearchAndFilter(
    { sortDir: surveyTargetStore.sortOrder },
    handleFilterChange
);

const loadMore = async () => {
    if (surveyTargetStore.page >= surveyTargetStore.totalPages || isLoadingMore.value) return;
    isLoadingMore.value = true;
    surveyTargetStore.page++;
    await surveyTargetStore.getSurveyTargets({ append: true });
    isLoadingMore.value = false;
};

const onCreate = () => {
    emit('new');
};

const onUpdate = (target) => {
    emit('edit', target);
};

const handleDelete = async (targetId) => {
    if (!targetId) return;
    const success = await surveyTargetStore.deleteSurveyTarget(targetId);
    if (success) {
        surveyTargetStore.page = 1;
        await surveyTargetStore.getSurveyTargets({ forceRefresh: true });
    }
};

const getActionItems = (target) => [
    {
        label: 'Edit',
        icon: Pencil,
        command: () => onUpdate(target),
        iconClass: 'text-warning'
    },
    {
        label: 'Delete',
        icon: Trash,
        command: () => handleDelete(target.id),
        iconClass: 'text-danger'
    }
];

onMounted(async () => {
    surveyTargetStore.search = searchAndFilter.searchQuery.value;
    surveyTargetStore.sortOrder = searchAndFilter.filters.value.sortDir;
    surveyTargetStore.page = 1;
    await surveyTargetStore.getSurveyTargets({ showLoading: true });
    isInitialLoad.value = false;
});
</script>

<style scoped>
@media (min-width: 768px) {
    .search-container {
        max-width: 300px;
    }
}
@media (max-width: 575.98px) {
    .button-container {
        flex-grow: 1 !important;
        width: 100%;
    }
}
</style>