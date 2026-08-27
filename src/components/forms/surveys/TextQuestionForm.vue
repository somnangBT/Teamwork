<template>
    <div class="card p-3 mb-2" >
        <template v-if="isActive">
            <div class="card-header d-flex align-items-center gap-2 justify-content-between">
                <div class="question-type d-flex align-items-center gap-2">
                    <span class="fw-semibold text-primary">{{ formData.questionType }}</span>
                </div>
                <div class="action-button d-flex align-items-center gap-2">
                    <div class="d-flex align-items-center gap-2">
                        <label class="form-label mb-0">Required</label>
                        <BaseToggle v-model="formData.isRequired" />
                    </div>
                    <div class="vr"></div>
                    <button type="button" class="btn p-0 text-danger d-flex align-items-center justify-content-center"
                        @click="emit('remove')">
                        <Trash :size="20" />
                    </button>
                    <button type="button" class="btn p-0 text-primary d-flex align-items-center justify-content-center"
                        @click="toggleSaveForReuse">
                        <Bookmark v-if="!formData.isSavedForReuse" :size="20" />
                        <BookmarkCheck v-else :size="20" />
                    </button>
                </div>
            </div>
            <div class="card-body p-0 pt-3">
                <div class="d-flex flex-wrap align-items-start gap-2">
                    <div class="flex-grow-1">
                        <BaseInput type="textarea" :rows="1" placeholder="Enter text question" v-model="formData.questionText" />
                    </div>
                    <div class="question-type-selector" style="min-width: 150px;">
                        <BaseSelect v-model="formData.questionType" :options="questionTypeOptions" @update:modelValue="emit('change-type', $event)">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="d-flex align-items-center gap-2">
                                    <component :is="getIcon(slotProps.value)" :size="16" />
                                    <span>{{ getLabel(slotProps.value) }}</span>
                                </div>
                                <span v-else>{{ slotProps.placeholder }}</span>
                            </template>
                            <template #option="slotProps">
                                <div class="d-flex align-items-center gap-2">
                                    <component :is="getIcon(slotProps.option.value)" :size="16" />
                                    <span>{{ slotProps.option.label }}</span>
                                </div>
                            </template>
                        </BaseSelect>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div style="cursor: pointer;" @click="emit('activate')">
                <div class="card-header d-flex align-items-center gap-2 justify-content-between mb-3">
                    <div class="question-type d-flex align-items-center gap-2">
                        <span class="fw-semibold text-primary">{{ formData.questionType }}</span>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div class="mb-0 fw-medium">{{ formData.questionText || 'Question' }}</div>
                    <span v-if="formData.isRequired" class="text-danger">*</span>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { Bookmark, BookmarkCheck, Trash, AlignLeft, CircleDot, Star } from '@lucide/vue'
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
    initialData: Object,
    questionTypeOptions: Array,
    isActive: {
        type: Boolean,
        default: false
    }
})

const getIcon = (value) => {
    switch (value) {
        case 'TEXT': return AlignLeft;
        case 'CHOICE': return CircleDot;
        case 'RATING': return Star;
        default: return null;
    }
};

const getLabel = (value) => {
    const opt = props.questionTypeOptions?.find(o => o.value === value);
    return opt ? opt.label : value;
};

const emit = defineEmits(['remove', 'update', 'save-toggle', 'change-type', 'activate'])

const formData = ref({
    questionText: "",
    helpText: "",
    questionType: "TEXT",
    isRequired: false,
    isSavedForReuse: false
})

const toggleSaveForReuse = () => {
    formData.value.isSavedForReuse = !formData.value.isSavedForReuse
    emit('save-toggle', formData.value.isSavedForReuse)
}

const initForm = () => {
    if (props.initialData) {
        formData.value = {
            questionText: props.initialData.questionText || props.initialData.text || props.initialData.title || props.initialData.name || '',
            helpText: props.initialData.helpText || props.initialData.description || '',
            questionType: "TEXT",
            isRequired: props.initialData.isRequired || false,
            isSavedForReuse: props.initialData.isSavedForReuse || false
        }
    } else {
        formData.value = {
            questionText: "",
            helpText: "",
            questionType: "TEXT",
            isRequired: false,
            isSavedForReuse: false
        }
    }
}

watch(() => props.initialData, () => initForm(), { deep: true, immediate: true })
watch(() => JSON.stringify(formData.value), (newVal, oldVal) => {
    if (oldVal !== undefined && newVal !== oldVal) {
        emit('update', JSON.parse(newVal))
    }
})

defineExpose({ formData })
</script>

<style scoped>
.form-switch {
    display: flex;
    align-items: center;
    gap: 8px;
}

.card {
    background-color: var(--body-bg-color);
    border-radius: var(--border-radius);
}

.card-header,
.card-footer {
    background-color: var(--surface-ground);
    border-radius: var(--border-inner-radius) !important;
}
</style>
