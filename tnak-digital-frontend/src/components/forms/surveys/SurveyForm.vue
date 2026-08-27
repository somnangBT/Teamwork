<template>
    <form class="card p-3" style="background-color: var(--body-bg-color); border-radius: var(--border-radius);">
        <div class="row g-2">
            <div class="col-12">
                <BaseInput type="text" placeholder="Untitled Survey" v-model="formData.title" />
            </div>
            <div class="col-12">
                <BaseInput :rows="2" type="textarea" placeholder="Survey description"
                    v-model="formData.description">
                </BaseInput>
            </div>
            <div class="col-lg-6 col-12">
                <BaseSelect
                    placeholder="Select Target"
                    :options="targets"
                    v-model="formData.targetId"
                    :loading="isFetchingTargets"
                    @load-more="loadTargets(false)"
                >
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="d-flex align-items-center gap-2">
                            <MapPinPen :size="14" :style="{ color: getCategoryColorHex(getSelectedTargetLabel(slotProps.value)) }" :stroke-width="2.5" />
                            <span>{{ getSelectedTargetLabel(slotProps.value) }}</span>
                        </div>
                        <span v-else>Select Target</span>
                    </template>
                    <template #option="slotProps">
                        <div class="d-flex align-items-center gap-2 w-100">
                            <MapPinPen :size="14" :style="{ color: getCategoryColorHex(slotProps.option.label) }" :stroke-width="2.5" class="flex-shrink-0" />
                            <span class="text-truncate">{{ slotProps.option.label }}</span>
                        </div>
                    </template>
                </BaseSelect>
            </div>
            <div v-if="showTeacherSelect" class="col-lg-6 col-12">
                <BaseSelect placeholder="Select Teacher" :options="teacherOptions"
                    v-model="formData.targetTeacherId" :loading="isFetchingTeachers" @load-more="loadTeachers(false)">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="d-flex align-items-center gap-2">
                            <div class="d-flex align-items-center justify-content-center text-muted"
                                style="border-radius: 50%; width: 24px; height: 24px; overflow: hidden; background-color: var(--surface-ground);">
                                <img v-if="getTeacher(slotProps.value)?.profile?.avatarUrl" :src="$authImg(getTeacher(slotProps.value).profile.avatarUrl)" class="img-fluid" style="width: 100%; height: 100%; object-fit: cover;">
                                <User v-else :size="16" />
                            </div>
                            <div class="d-flex flex-column align-items-start" style="line-height: 1.2;">
                                <span class="fw-medium" style="font-size: 0.9rem;">
                                    {{ getTeacher(slotProps.value)?.firstName }} {{ getTeacher(slotProps.value)?.lastName }}
                                </span>
                            </div>
                        </div>
                        <span v-else>{{ slotProps.placeholder }}</span>
                    </template>
                    <template #option="slotProps">
                        <div class="d-flex align-items-center gap-2">
                            <div class="d-flex align-items-center justify-content-center text-muted"
                                style="border-radius: 50%; width: 32px; height: 32px; overflow: hidden; background-color: var(--surface-ground);">
                                <img v-if="slotProps.option.user?.profile?.avatarUrl" :src="$authImg(slotProps.option.user.profile.avatarUrl)" class="img-fluid" style="width: 100%; height: 100%; object-fit: cover;">
                                <User v-else :size="20" />
                            </div>
                            <div class="d-flex flex-column align-items-start" style="line-height: 1.2;">
                                <span class="fw-medium">
                                    {{ slotProps.option.user?.firstName }} {{ slotProps.option.user?.lastName }}
                                </span>
                            </div>
                        </div>
                    </template>
                </BaseSelect>
            </div>
        </div>
    </form>
</template>

<script setup>
import { useSurveyTargetStore } from '@/stores/surveys/surveyTarget';
import { useUserStore } from '@/stores/users/user';
import { ref, watch, onMounted } from 'vue'
import { User, MapPinPen } from '@lucide/vue'
import { getCategoryColorHex } from '@/utils/statusTheme';

const props = defineProps({
    initialData: Object
})

const surveyTargetStore = useSurveyTargetStore();
const targets = ref([])
const userStore = useUserStore();
const teacherOptions = ref([])
const teacherTargetId = ref(null)
const showTeacherSelect = ref(false)

const teacherPage = ref(1)
const hasMoreTeachers = ref(true)
const isFetchingTeachers = ref(false)

const targetPage = ref(1);
const hasMoreTargets = ref(true);
const isFetchingTargets = ref(false);

const getSelectedTargetLabel = (val) => {
    if (!val) return 'Select Target';
    const found = targets.value.find(opt => opt.value == val);
    return found ? found.label : 'Target';
};

const loadTargets = async (reset = true) => {
    if (reset) {
        targetPage.value = 1;
        targets.value = [];
        hasMoreTargets.value = true;
        
        if (props.initialData?.target?.id && props.initialData?.target?.name) {
            const t = props.initialData.target;
            if (!targets.value.some(opt => opt.value == t.id)) {
                targets.value.push({
                    label: t.name,
                    value: t.id
                });
            }
            if (/teacher/i.test(t.name)) {
                teacherTargetId.value = t.id;
            }
        }
    }
    
    if (!hasMoreTargets.value || isFetchingTargets.value) return;
    
    isFetchingTargets.value = true;
    try {
        await surveyTargetStore.getSurveyTargets({ _page: targetPage.value, _per_page: 10 });
        const resTargets = surveyTargetStore.surveyTargets || [];
        
        if (resTargets.length < 10 || targetPage.value >= (surveyTargetStore.totalPages || 1)) {
            hasMoreTargets.value = false;
        }
        
        const newOptions = resTargets
            .filter(t => !targets.value.some(opt => opt.value == t.id))
            .map(t => ({ label: t.name, value: t.id }));
            
        targets.value = [...targets.value, ...newOptions];
        
        const teacherTarget = resTargets.find(t => /teacher/i.test(t.name));
        if (teacherTarget && !teacherTargetId.value) {
            teacherTargetId.value = teacherTarget.id;
        }
        
        if (hasMoreTargets.value) {
            targetPage.value++;
        }
    } finally {
        isFetchingTargets.value = false;
    }
};

onMounted(() => {
    loadTargets();
});

const formData = ref({
    title: "",
    description: "",
    targetId: null,
    targetTeacherId: null
})

const initForm = () => {
    if (props.initialData) {
        formData.value = {
            title: props.initialData.title || '',
            description: props.initialData.description,
            targetId: props.initialData.targetId,
            targetTeacherId: props.initialData.targetTeacherId || null
        };
        
        if (props.initialData.target?.id && props.initialData.target?.name) {
            const t = props.initialData.target;
            if (!targets.value.some(opt => opt.value == t.id)) {
                targets.value.push({
                    label: t.name,
                    value: t.id
                });
            }
            if (/teacher/i.test(t.name)) {
                teacherTargetId.value = t.id;
            }
        }
        
        if (props.initialData.targetTeacher?.id) {
            const u = props.initialData.targetTeacher;
            // The API returns an integer for targetTeacherId but a UUID for targetTeacher.id
            // We must use the UUID to match the options loaded from the users API
            formData.value.targetTeacherId = u.id; 
            
            if (!teacherOptions.value.some(opt => opt.value == u.id)) {
                teacherOptions.value.push({
                    label: `${u.firstName || u.name || ''} ${u.lastName || ''}`.trim() || u.email || `User ${u.id}`, 
                    value: u.id,
                    user: u
                });
            }
        }
    } else {
        formData.value = {
            title: "",
            description: "",
            targetId: null,
            targetTeacherId: null
        };
    }
};

const loadTeachers = async (reset = true) => {
    if (reset) {
        teacherPage.value = 1;
        teacherOptions.value = [];
        hasMoreTeachers.value = true;
        
        if (props.initialData?.targetTeacher?.id) {
            const u = props.initialData.targetTeacher;
            if (!teacherOptions.value.some(opt => opt.value == u.id)) {
                teacherOptions.value.push({
                    label: `${u.firstName || u.name || ''} ${u.lastName || ''}`.trim() || u.email || `User ${u.id}`, 
                    value: u.id,
                    user: u
                });
            }
        }
    }
    
    if (!hasMoreTeachers.value || isFetchingTeachers.value) return;
    
    isFetchingTeachers.value = true;
    try {
        await userStore.getAllUsers({ roleId: 2, _page: teacherPage.value, _per_page: 10 });
        const users = userStore.users || [];
        
        if (users.length < 10 || teacherPage.value >= (userStore.totalPages || 1)) {
            hasMoreTeachers.value = false;
        }
        
        const newOptions = users
            .filter(u => !teacherOptions.value.some(opt => opt.value == u.id))
            .map(u => ({ 
            label: `${u.firstName || u.name || ''} ${u.lastName || ''}`.trim() || u.email || `User ${u.id}`, 
            value: u.id,
            user: u
        }));
        
        teacherOptions.value = [...teacherOptions.value, ...newOptions];
        
        if (hasMoreTeachers.value) {
            teacherPage.value++;
        }
    } finally {
        isFetchingTeachers.value = false;
    }
};

const getTeacher = (id) => {
    const opt = teacherOptions.value.find(o => o.value == id);
    return opt ? opt.user : null;
}

watch(() => formData.value.targetId, async (newVal, oldVal) => {
    if (newVal === oldVal || oldVal === undefined) return;
    
    if (newVal != null && teacherTargetId.value != null && Number(newVal) === Number(teacherTargetId.value)) {
        showTeacherSelect.value = true;
        await loadTeachers();
    } else {
        showTeacherSelect.value = false;
        formData.value.targetTeacherId = null;
    }
})

watch(() => props.initialData, () => {
    initForm()
}, { deep: true, immediate: true })

defineExpose({ formData })
</script>