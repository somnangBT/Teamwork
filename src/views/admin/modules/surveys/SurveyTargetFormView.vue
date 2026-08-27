<template>
    <div class="mx-auto w-100" style="max-width: 600px;">
        <div class="card" style="background-color: var(--surface-ground);">
            <div class="card-body" style="background-color: var(--body-bg-color);">
                <SurveyTargetForm ref="surveyTargetFormRef" :initial-data="initialData" />
                <div class="d-flex align-items-center gap-3 mt-3">
                    <BaseButton @click="onCancel()" variant="outline-primary" class="flex-fill">Cancel</BaseButton>
                    <BaseButton :isLoading="isLoading" @click="handleSubmit()" class="flex-fill">
                        {{ isEdit ? (isLoading ? 'Updating...' : 'Update') : (isLoading ? 'Creating...' : 'Create Target') }}
                    </BaseButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import SurveyTargetForm from '@/components/forms/surveys/SurveyTargetForm.vue';
import { useSurveyTargetStore } from '@/stores/surveys/surveyTarget';
import { ref, computed } from 'vue';

const props = defineProps({
    initialData: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close']);

const surveyTargetStore = useSurveyTargetStore();
const surveyTargetFormRef = ref(null);
const isLoading = ref(false);

const isEdit = computed(() => !!props.initialData);

const onCancel = () => {
    emit('close');
};

const handleSubmit = async () => {
    const formRef = surveyTargetFormRef.value;
    const form = await formRef.validateForm();
    
    if (!form) return;

    isLoading.value = true;
    const apiResult = ref(null);

    const payload = {
        name: form.name
    };

    if (isEdit.value) {
        apiResult.value = await surveyTargetStore.updateSurveyTarget(props.initialData.id, payload);
    } else {
        apiResult.value = await surveyTargetStore.createSurveyTarget(payload);
    }

    isLoading.value = false;

    if (apiResult.value !== false) {
        emit('close');
    }
};
</script>