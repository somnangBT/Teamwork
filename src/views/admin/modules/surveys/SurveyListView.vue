<template>
        <div class="mb-2 d-flex flex-column flex-xl-row gap-3 w-100 align-items-xl-center justify-content-between">
            <div class="flex-grow-1 overflow-auto pb-1 pb-xl-0 d-flex align-items-center gap-2" style="min-width: 0;">
                <BaseButton v-if="hasActiveFilters" @click="resetFilters" variant="outline-danger" v-tooltip.top="'Reset Filters'" class="flex-shrink-0">
                    <FilterX :size="16" />
                </BaseButton>
                <BaseFilter 
                    v-model="searchAndFilter.filters.value.status" 
                    :options="filterOptions" 
                    style="min-width: max-content;"
                />
            </div>
            
            <div class="d-flex flex-wrap align-items-center gap-2 justify-content-start justify-content-xl-end flex-grow-1">
                <BaseInput 
                    v-model="searchAndFilter.searchQuery.value" 
                    placeholder="Search by title or description..." 
                    :prefixIcon="Search"
                    clearable
                    class="flex-grow-1"
                    style="min-width: 200px; max-width: 100%;"
                />
                <BaseSelect
                    v-model="searchAndFilter.filters.value.targetId"
                    :options="targetOptions"
                    placeholder="Filter by Target"
                    class="flex-shrink-1"
                    style="min-width: 150px; max-width: 250px;"
                    :loading="isFetchingTargets"
                    @load-more="loadTargets(false)"
                >
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="d-flex align-items-center gap-2">
                            <MapPinPen v-if="slotProps.value !== 'all'" :size="14" :style="{ color: getCategoryColorHex(getSelectedTargetLabel(slotProps.value)) }" :stroke-width="2.5" />
                            <span>{{ getSelectedTargetLabel(slotProps.value) }}</span>
                        </div>
                        <span v-else>Filter by Target</span>
                    </template>
                    <template #option="slotProps">
                        <div class="d-flex align-items-center gap-2 w-100">
                            <MapPinPen v-if="slotProps.option.value !== 'all'" :size="14" :style="{ color: getCategoryColorHex(slotProps.option.label) }" :stroke-width="2.5" class="flex-shrink-0" />
                            <span class="text-truncate">{{ slotProps.option.label }}</span>
                        </div>
                    </template>
                </BaseSelect>
                <BaseSelect
                    v-model="searchAndFilter.filters.value.createdById"
                    :options="creatorOptions"
                    placeholder="Filter by Creator"
                    class="flex-shrink-1"
                    style="min-width: 150px; max-width: 250px;"
                    :loading="isFetchingCreators"
                    @load-more="loadCreators(false)"
                >
                    <template #option="slotProps">
                        <div class="d-flex align-items-center gap-2">
                            <div class="d-flex align-items-center justify-content-center text-muted"
                                style="border-radius: 50%; width: 24px; height: 24px; overflow: hidden; background-color: var(--surface-ground);">
                                <img v-if="slotProps.option.user?.profile?.avatarUrl" :src="$authImg(slotProps.option.user.profile.avatarUrl)" class="img-fluid" style="width: 100%; height: 100%; object-fit: cover;">
                                <User v-else-if="slotProps.option.value !== 'all'" :size="16" />
                            </div>
                            <span>{{ slotProps.option.label }}</span>
                        </div>
                    </template>
                </BaseSelect>

                <BaseButton @click="onCreate()" class="flex-shrink-0">New Survey</BaseButton>
            </div>
        </div>
        <BaseTable ref="dt" :columns="colDefs" :rows="surveyStore.surveys" :loading="surveyStore.isLoading || isInitialLoad"
            :total-records="surveyStore.totalItems" v-model:page="surveyStore.page"
            v-model:per-page="surveyStore.perPage" v-model:sort-by="surveyStore.sortBy"
            v-model:sort-order="surveyStore.sortOrder" @refresh-data="surveyStore.getAllSurveys">
            <template #title="{ data }">
                <div class="truncate-2-lines">{{ data?.title || 'Untitled survey.' }}</div>
            </template>
            <template #createdBy="{ data }">
                <span>{{ data.createdBy?.firstName + ' ' + data?.createdBy?.lastName }}</span>
            </template>
            <template #target="{ data }">
                <div class="d-flex flex-column">
                    <div class="d-flex align-items-center gap-2">
                        <MapPinPen v-if="data.target?.name" :size="15" :style="{ color: getCategoryColorHex(data.target.name) }" :stroke-width="2.5" class="flex-shrink-0" />
                        <span>{{ data.target?.name || 'No target.' }}</span>
                    </div>
                    <span class="text-primary small">
                        {{ (data.targetTeacher?.email) || 'No teacher target.' }}
                    </span>
                </div>
            </template>
            <template #status="{ data }">
                <BaseBadge :status="data.status" :loading="updatingId === data.id" />
            </template>
            <template #responses="{ data }">
                <div class="text-muted fw-medium" style="font-size: 0.9rem;">
                    <span v-if="!data._count?.responses">No responses</span>
                    <span v-else-if="data._count?.responses === 1" class="text-primary">1 response</span>
                    <span v-else class="text-primary">{{ data._count?.responses }} responses</span>
                </div>
            </template>
            <template #requireAccessCode="{ data }">
                <div v-if="updatingId === data.id" class="spinner-border spinner-border-sm text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div v-else class="d-flex align-items-center gap-2">
                    <span v-if="!data.requireAccessCode" class="fw-medium text-muted">Open Access</span>
                    <div v-else-if="data.accessCode" class="d-flex align-items-center gap-2">
                        <span class="text-primary fw-medium">{{ data.accessCode }}</span>
                        <button class="btn btn-sm text-primary p-1 border-0 rounded-circle d-flex align-items-center justify-content-center hover-bg-primary-soft" 
                                @click.stop="copyAccessCode(data.accessCode)" 
                                v-tooltip.top="'Copy Code'">
                            <Copy :size="14" />
                        </button>
                    </div>
                </div>
            </template>
            <template #action="{ data }">
                <BaseActionMenu :items="getActionItems(data)" />
            </template>
        </BaseTable>

        <BaseModal v-model="showPublishModal" title="Publish survey" size="md">

            <div class="main-divider mb-3"></div>

            <h6 class="mb-3 fw-medium text-base">General access</h6>
            <div class="d-flex flex-column gap-2">
                <div v-for="option in accessOptions" :key="option.title"
                     class="d-flex align-items-center justify-content-between gap-3 p-3 transition-all access-option-card"
                     :class="{ 'active': modalRequireAccessCode === option.value }"
                     @click="modalRequireAccessCode = option.value">
                    <div class="d-flex align-items-center gap-3">
                        <div class="d-flex align-items-center justify-content-center access-option-icon">
                            <component :is="option.icon" :size="20" />
                        </div>
                        <div>
                            <div class="fw-medium text-base access-option-title">{{ option.title }}</div>
                            <div class="text-muted mt-1 access-option-desc">{{ option.description }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="publishingSurvey?.shareLink">
                <div class="main-divider my-3"></div>
                <h6 class="mb-3 fw-medium text-base">Share Link</h6>
                <div class="d-flex align-items-center gap-2">
                    <BaseInput :disabled="true" :modelValue="publishingSurvey.shareLink" class="flex-grow-1" />
                    <BaseButton variant="outline-primary" @click="copyShareLink(publishingSurvey.shareLink)" v-tooltip.top="'Copy Link'">
                        <Copy :size="16" />
                    </BaseButton>
                </div>
            </div>

            <template #footer>
                <div class="d-flex justify-content-between gap-2 w-100">
                    <BaseButton variant="outline-primary" class="flex-grow-1" @click="showPublishModal = false">Dismiss</BaseButton>
                    <BaseButton variant="primary" class="flex-grow-1" @click="confirmPublish" :is-loading="isPublishing">
                        {{ isPublishing ? 'Publishing...' : 'Publish' }}
                    </BaseButton>
                </div>
            </template>
        </BaseModal>
        <BaseModal v-model="showUnpublishModal" :title="unpublishingSurveyHasResponses ? 'Archive survey' : 'Unpublish survey'" size="sm">
            <div class="text-center mb-3">
                <div class="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle" 
                     :class="unpublishingSurveyHasResponses ? 'bg-secondary-subtle text-secondary' : 'bg-danger-subtle text-danger'" 
                     style="width: 60px; height: 60px;">
                    <Archive v-if="unpublishingSurveyHasResponses" :size="28" />
                    <EyeOff v-else :size="28" />
                </div>
                <h6 class="fw-medium text-base mb-3">{{ unpublishingSurveyHasResponses ? 'Archive this survey?' : 'Unpublish this survey?' }}</h6>
                <p class="text-muted small mb-0">
                    Are you sure you want to {{ unpublishingSurveyHasResponses ? 'archive' : 'unpublish' }}?
                    Students will no longer be able to submit responses.
                </p>
            </div>
            
            <template #footer>
                <div class="d-flex justify-content-between gap-2 w-100">
                    <BaseButton :variant="unpublishingSurveyHasResponses ? 'outline-secondary' : 'outline-danger'" class="flex-grow-1" @click="showUnpublishModal = false">Cancel</BaseButton>
                    <BaseButton :variant="unpublishingSurveyHasResponses ? 'secondary' : 'danger'" class="flex-grow-1" @click="confirmUnpublish" :is-loading="isUnpublishing">
                        {{ isUnpublishing ? (unpublishingSurveyHasResponses ? 'Archiving...' : 'Unpublishing...') : (unpublishingSurveyHasResponses ? 'Archive' : 'Unpublish') }}
                    </BaseButton>
                </div>
            </template>
        </BaseModal>

        <BaseModal v-model="showSetTimeModal" title="Set Publish/Unpublish Time" size="md">
            <div class="d-flex flex-column gap-3">
                <BaseDatePicker
                    v-model="publishAtTime"
                    label="Publish At"
                    placeholder="Select publish time"
                    :showTime="true"
                    :hourFormat="'12'"
                />
                <BaseDatePicker
                    v-model="unpublishAtTime"
                    label="Unpublish At"
                    placeholder="Select unpublish time"
                    :showTime="true"
                    :hourFormat="'12'"
                />
            </div>
            
            <template #footer>
                <div class="d-flex justify-content-between gap-2 w-100">
                    <BaseButton variant="outline-primary" class="flex-grow-1" @click="showSetTimeModal = false">Cancel</BaseButton>
                    <BaseButton variant="primary" class="flex-grow-1" @click="confirmSetTime" :is-loading="isSavingTime">
                        {{ isSavingTime ? 'Saving...' : 'Save' }}
                    </BaseButton>
                </div>
            </template>
        </BaseModal>
</template>

<script setup>
import { useSurveyStore } from '@/stores/surveys/survey';
import { useSurveyTargetStore } from '@/stores/surveys/surveyTarget';
import { useUserStore } from '@/stores/users/user';
import { useToastStore } from '@/stores/toast';
import { Info, Pencil, Globe, EyeOff, Copy, Lock, Share2, Unlock, Clock, Search, User, MapPinPen, Archive, FilterX } from '@lucide/vue';
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useSearchAndFilter } from '@/composables/common/useSearchAndFilter.js';
import { getStatusVariant, getCategoryColorHex } from '@/utils/statusTheme';

const emit = defineEmits(['edit', 'new', 'view-response']);

const surveyStore = useSurveyStore();
const toastStore = useToastStore();

const searchAndFilter = useSearchAndFilter(
    { status: 'all', targetId: 'all', createdById: 'all' },
    (newFilters) => {
        surveyStore.search = newFilters.search;
        surveyStore.statusFilter = newFilters.status;
        surveyStore.targetId = newFilters.targetId;
        surveyStore.createdById = newFilters.createdById;
        surveyStore.page = 1;
        surveyStore.getAllSurveys({ showLoading: true });
    }
);

const hasActiveFilters = computed(() => {
    return !!searchAndFilter.searchQuery.value || 
           searchAndFilter.filters.value.status !== 'all' || 
           searchAndFilter.filters.value.targetId !== 'all' ||
           searchAndFilter.filters.value.createdById !== 'all';
});

const resetFilters = () => {
    searchAndFilter.searchQuery.value = '';
    searchAndFilter.filters.value.status = 'all';
    searchAndFilter.filters.value.targetId = 'all';
    searchAndFilter.filters.value.createdById = 'all';
};

const updatingId = ref(null);

const targetStore = useSurveyTargetStore();
const userStore = useUserStore();

const accessOptions = [
    {
        value: true,
        icon: Lock,
        title: 'Require access code',
        description: 'Only student with access code can do response'
    },
    {
        value: false,
        icon: Globe,
        title: 'For all student',
        description: 'Every student can do response'
    }
];

const filterOptions = computed(() => [
    { label: 'All Surveys', value: 'all', badge: surveyStore.statusStats['all'] || '-' },
    { label: 'Published', value: 'published', badge: surveyStore.statusStats['published'] || '0', variant: getStatusVariant('published') },
    { label: 'Draft', value: 'draft', badge: surveyStore.statusStats['draft'] || '0', variant: getStatusVariant('draft') },
    { label: 'Archived', value: 'archived', badge: surveyStore.statusStats['archived'] || '0', variant: getStatusVariant('archived') }
]);

const targetOptions = ref([{ label: 'All Targets', value: 'all' }]);
const getSelectedTargetLabel = (val) => {
    if (!val || val === 'all') return 'All Targets';
    const found = targetOptions.value.find(opt => opt.value === val);
    return found ? found.label : 'Target';
};
const targetPage = ref(1);
const hasMoreTargets = ref(true);
const isFetchingTargets = ref(false);

const isInitialLoad = ref(true);

const loadTargets = async (reset = true) => {
    if (reset) {
        targetPage.value = 1;
        targetOptions.value = [{ label: 'All Targets', value: 'all' }];
        hasMoreTargets.value = true;
    }
    
    if (!hasMoreTargets.value || isFetchingTargets.value) return;
    
    isFetchingTargets.value = true;
    try {
        await targetStore.getSurveyTargets({ _page: targetPage.value, _per_page: 10 });
        const targets = targetStore.surveyTargets || [];
        
        if (targets.length < 10 || targetPage.value >= (targetStore.totalPages || 1)) {
            hasMoreTargets.value = false;
        }
        
        const newOptions = targets
            .filter(t => !targetOptions.value.some(opt => opt.value == t.id))
            .map(t => ({ label: t.name, value: t.id }));
        
        targetOptions.value = [...targetOptions.value, ...newOptions];
        
        if (hasMoreTargets.value) {
            targetPage.value++;
        }
    } finally {
        isFetchingTargets.value = false;
    }
}

const creatorOptions = ref([{ label: 'All Creators', value: 'all' }]);
const creatorPage = ref(1);
const hasMoreCreators = ref(true);
const isFetchingCreators = ref(false);

const loadCreators = async (reset = true) => {
    if (reset) {
        creatorPage.value = 1;
        creatorOptions.value = [{ label: 'All Creators', value: 'all' }];
        hasMoreCreators.value = true;
    }
    
    if (!hasMoreCreators.value || isFetchingCreators.value) return;
    
    isFetchingCreators.value = true;
    try {
        await userStore.getAllUsers({ roleId: 1, _page: creatorPage.value, _per_page: 10 });
        const users = userStore.users || [];
        
        if (users.length < 10 || creatorPage.value >= (userStore.totalPages || 1)) {
            hasMoreCreators.value = false;
        }
        
        const newOptions = users
            .filter(u => !creatorOptions.value.some(opt => opt.value == u.id))
            .map(u => ({ 
                label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || `User ${u.id}`, 
                value: u.id,
                user: u
            }));
        
        creatorOptions.value = [...creatorOptions.value, ...newOptions];
        
        if (hasMoreCreators.value) {
            creatorPage.value++;
        }
    } finally {
        isFetchingCreators.value = false;
    }
}

let searchTimeout;
watch(() => surveyStore.search, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        surveyStore.page = 1;
        surveyStore.getAllSurveys();
        surveyStore.fetchStatusStats();
    }, 500);
});

watch([() => surveyStore.statusFilter, () => surveyStore.targetId, () => surveyStore.createdById], () => {
    surveyStore.page = 1;
    surveyStore.getAllSurveys();
    surveyStore.fetchStatusStats();
});

const onCreate = () => {
    emit('new');
}

const onViewReponse = (data) => {
    emit('view-response', data.id);
};

const showPublishModal = ref(false);
const publishingSurvey = ref(null);
const modalRequireAccessCode = ref(false);
const isPublishing = ref(false);

const openPublishModal = (data) => {
    publishingSurvey.value = data;
    modalRequireAccessCode.value = data.requireAccessCode || false;
    showPublishModal.value = true;
};

const confirmPublish = async () => {
    if (!publishingSurvey.value) return;
    const currentId = publishingSurvey.value.id;
    isPublishing.value = true;
    updatingId.value = currentId;
    
    if (publishingSurvey.value.requireAccessCode !== modalRequireAccessCode.value) {
        const payload = {
            title: publishingSurvey.value.title,
            description: publishingSurvey.value.description,
            targetId: publishingSurvey.value.targetId,
            targetTeacherId: publishingSurvey.value.targetTeacherId,
            requireAccessCode: modalRequireAccessCode.value
        };
        await surveyStore.updateSurvey(currentId, payload);
    }
    
    const result = await surveyStore.publishSurvey(currentId);
    if (result) {
        await surveyStore.getAllSurveys({ showLoading: false, forceRefresh: true });
        showPublishModal.value = false;
    }
    isPublishing.value = false;
    if (updatingId.value === currentId) updatingId.value = null;
};

const showUnpublishModal = ref(false);
const unpublishingSurvey = ref(null);
const isUnpublishing = ref(false);

const unpublishingSurveyHasResponses = computed(() => {
    if (!unpublishingSurvey.value) return false;
    const data = unpublishingSurvey.value;
    return (data._count?.responses > 0 || data.responsesCount > 0 || data.responses?.length > 0);
});

const openUnpublishModal = (data) => {
    unpublishingSurvey.value = data;
    showUnpublishModal.value = true;
};

const confirmUnpublish = async () => {
    if (!unpublishingSurvey.value) return;
    const currentId = unpublishingSurvey.value.id;
    isUnpublishing.value = true;
    updatingId.value = currentId;
    
    const result = await surveyStore.unpublishSurvey(currentId);
    if (result) {
        await surveyStore.getAllSurveys({ showLoading: false, forceRefresh: true });
        showUnpublishModal.value = false;
    }
    isUnpublishing.value = false;
    if (updatingId.value === currentId) updatingId.value = null;
};

const showSetTimeModal = ref(false);
const editingTimeSurvey = ref(null);
const publishAtTime = ref(null);
const unpublishAtTime = ref(null);
const isSavingTime = ref(false);

const openSetTimeModal = (data) => {
    editingTimeSurvey.value = data;
    publishAtTime.value = data.publishAt || null;
    unpublishAtTime.value = data.unpublishAt || null;
    showSetTimeModal.value = true;
};

const confirmSetTime = async () => {
    if (!editingTimeSurvey.value) return;
    const currentId = editingTimeSurvey.value.id;
    isSavingTime.value = true;
    updatingId.value = currentId;
    
    const payload = {
        title: editingTimeSurvey.value.title,
        description: editingTimeSurvey.value.description,
        targetId: editingTimeSurvey.value.targetId,
        targetTeacherId: editingTimeSurvey.value.targetTeacherId,
        requireAccessCode: editingTimeSurvey.value.requireAccessCode,
        publishAt: publishAtTime.value,
        unpublishAt: unpublishAtTime.value
    };
    
    const result = await surveyStore.updateSurvey(currentId, payload);
    if (result) {
        await surveyStore.getAllSurveys({ showLoading: false, forceRefresh: true });
        showSetTimeModal.value = false;
        toastStore.showToast('Survey time updated successfully', 'success');
    }
    isSavingTime.value = false;
    if (updatingId.value === currentId) updatingId.value = null;
};

const copyAccessCode = async (code) => {
    try {
        await navigator.clipboard.writeText(code);
        toastStore.showToast('Access code copied!', 'success');
    } catch (e) {
        toastStore.showToast('Failed to copy code', 'error');
    }
}

const copyShareLink = async (link, isDraft = false) => {
    if (!link) return;
    try {
        await navigator.clipboard.writeText(link);
        if (isDraft) {
            toastStore.showToast('Publish the survey for users to access this link.', 'warning');
        } else {
            toastStore.showToast('Share link copied!', 'success');
        }
    } catch (e) {
        toastStore.showToast('Failed to copy link', 'error');
    }
}

const onUpdate = (survey) => {
    emit('edit', survey);
}

const toggleAccessCode = async (data) => {
    updatingId.value = data.id;
    const payload = {
        title: data.title,
        description: data.description,
        targetId: data.targetId,
        targetTeacherId: data.targetTeacherId,
        requireAccessCode: !data.requireAccessCode
    };
    
    const result = await surveyStore.updateSurvey(data.id, payload);
    if (result) {
        toastStore.showToast(`Access code ${payload.requireAccessCode ? 'required' : 'removed'}.`, 'success');
        await surveyStore.getAllSurveys({ showLoading: false, forceRefresh: true });
    }
    updatingId.value = null;
}

const getActionItems = (data) => {
    const hasResponse = (data._count?.responses > 0 || data.responsesCount > 0 || data.responses?.length > 0);
    const isArchived = data.status?.toUpperCase() === 'ARCHIVED';
    const isPublished = data.status?.toUpperCase() === 'PUBLISHED';

    const items = [
        {
            label: data.requireAccessCode ? 'Remove Code' : 'Require Code',
            icon: data.requireAccessCode ? Unlock : Lock,
            command: () => toggleAccessCode(data),
            iconClass: data.requireAccessCode ? 'text-warning' : 'text-info'
        },
        {
            label: 'Share',
            icon: Share2,
            command: () => copyShareLink(data.shareLink, data.status === 'DRAFT'),
            iconClass: 'text-primary',
            disabled: !data.shareLink
        }
    ];

    const hideEdit = hasResponse || isPublished || isArchived;
    if (!hideEdit) {
        items.push({
            label: 'Edit',
            icon: Pencil,
            command: () => onUpdate(data),
            iconClass: 'text-warning'
        });
    }

    items.push(
        {
            label: 'View Detail',
            icon: Info,
            command: () => onViewReponse(data),
        },
        {
            label: 'Set Time',
            icon: Clock,
            command: () => openSetTimeModal(data),
            iconClass: 'text-primary'
        }
    );

    if (data.status === 'DRAFT' || data.status === 'ARCHIVED') {
        items.push({
            label: 'Publish',
            icon: Globe,
            command: () => openPublishModal(data),
            iconClass: 'text-success'
        });
    } else {
        if (hasResponse) {
            items.push({
                label: 'Archive',
                icon: Archive,
                command: () => openUnpublishModal(data),
                iconClass: 'text-secondary'
            });
        } else {
            items.push({
                label: 'Unpublish',
                icon: EyeOff,
                command: () => openUnpublishModal(data),
                iconClass: 'text-danger'
            });
        }
    }

    return items;
};

const colDefs = [
    { field: 'title', header: 'Survey Name' },
    { field: 'target', header: 'Target Audience', sortable: false },
    { field: 'responses', header: 'Responses', sortable: false },
    { field: 'requireAccessCode', header: 'Access', sortable: false },
    { field: 'status', header: 'Status' },
    { field: 'createdBy', header: 'Author', sortable: false },
    { field: 'action', header: 'Actions', sortable: false },
]

onMounted(async () => {
    surveyStore.setupSocketListeners();
    
    loadTargets();
    loadCreators();
    surveyStore.fetchStatusStats();
    
    surveyStore.search = searchAndFilter.searchQuery.value;
    surveyStore.statusFilter = searchAndFilter.filters.value.status;
    surveyStore.targetId = searchAndFilter.filters.value.targetId;
    surveyStore.createdById = searchAndFilter.filters.value.createdById;
    
    surveyStore.page = 1;
    await surveyStore.getAllSurveys({ showLoading: true });
    isInitialLoad.value = false;
});

onUnmounted(() => {
    surveyStore.search = '';
    surveyStore.statusFilter = 'all';
    surveyStore.targetId = 'all';
    surveyStore.createdById = 'all';
    surveyStore.page = 1;
});
</script>

<style scoped>
.access-option-card {
    border-radius: var(--border-inner-radius);
    cursor: pointer;
    background-color: var(--body-bg-color);
    border: var(--border-width) solid transparent;
}

.access-option-card.active {
    border-color: var(--primary-color);
}

.access-option-icon {
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 50px;
    background-color: var(--surface-ground);
    color: var(--text-base);
    transition: all 0.2s ease-in-out;
}

.access-option-card.active .access-option-icon {
    background-color: var(--primary-color-soft);
    color: var(--primary-color);
}

.access-option-desc {
    font-size: 0.85rem;
    line-height: 1.2;
}
</style>