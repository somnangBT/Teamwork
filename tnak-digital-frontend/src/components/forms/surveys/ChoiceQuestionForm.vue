<template>
    <div class="card p-3 mb-2">
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
                <div class="mb-3 d-flex flex-wrap align-items-start gap-2">
                    <div class="flex-grow-1">
                        <BaseInput type="textarea" :rows="1" placeholder="Enter multiple choice question" v-model="formData.questionText" />
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
                <div class="question-options-container">
                    <button type="button" class="btn btn-sm text-primary p-0 mt-1 mb-3 d-flex align-items-center gap-1"
                        @click="addOption">
                        <Plus :size="16" /> Add Option
                    </button>
                </div>
                <div class="question-options-container">
                    <div v-for="(opt, index) in formData.options" :key="index" class="d-flex align-items-center gap-2 mt-2">
                        <BaseInput type="text" class="w-100" placeholder="Option text" v-model="formData.options[index]" />
                        <BaseButton type="button" variant="outline-primary" v-if="formData.options.length > 1"
                            @click="removeOption(index)">
                            <X :size="18" />
                        </BaseButton>
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
                <div class="d-flex align-items-center gap-2 mb-3">
                    <div class="mb-0 fw-medium">{{ formData.questionText || 'Question' }}</div>
                    <span v-if="formData.isRequired" class="text-danger">*</span>
                </div>
                <div class="d-flex flex-column gap-2 question-options-container">
                    <div v-for="(opt, index) in formData.options" :key="index" class="d-flex align-items-center gap-2 text-muted">
                        <CircleDot :size="18" /> <span>{{ opt || `Option ${index + 1}` }}</span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Bookmark, BookmarkCheck, Plus, Trash, X, AlignLeft, CircleDot, Star } from '@lucide/vue'

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

const toggleSaveForReuse = () => {
    formData.value.isSavedForReuse = !formData.value.isSavedForReuse
    emit('save-toggle', formData.value.isSavedForReuse)
}

const formData = ref({
    questionText: "",
    helpText: "",
    questionType: "CHOICE",
    options: [""],
    isRequired: false,
    isSavedForReuse: false
})

const addOption = () => formData.value.options.push("")
const removeOption = (index) => {
    if (formData.value.options.length > 1) formData.value.options.splice(index, 1)
}

const initForm = () => {
    if (props.initialData) {
        formData.value = {
            questionText: props.initialData.questionText || props.initialData.text || props.initialData.title || props.initialData.name || '',
            helpText: props.initialData.helpText || props.initialData.description || '',
            questionType: "CHOICE",
            options: props.initialData.options && props.initialData.options.length > 0 ? [...props.initialData.options] : [""],
            isRequired: props.initialData.isRequired || false,
            isSavedForReuse: props.initialData.isSavedForReuse || false
        }
    } else {
        formData.value = {
            questionText: "",
            helpText: "",
            questionType: "CHOICE",
            options: [""],
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
