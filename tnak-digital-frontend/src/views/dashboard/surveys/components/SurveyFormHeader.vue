<template>
    <div class="card p-3 d-flex flex-row align-items-center justify-content-between mb-3" style="background-color: var(--body-bg-color);">
        <div class="d-flex align-items-center gap-3">
            <BaseButton variant="primary" :isLoading="savePending || saveStatus === 'Saving...'" @click="$emit('cancel')">
                {{ (savePending || saveStatus === 'Saving...') ? 'Saving...' : 'Done / Close' }}
            </BaseButton>
        </div>
        <div class="d-flex align-items-center gap-2">
            <BaseButton type="button" variant="outline-primary" @click="$emit('add-question')">
                <Plus :size="16" /> Add Question
            </BaseButton>
            <BaseButton type="button" :variant="showImportView ? 'primary' : 'outline-primary'" @click="$emit('toggle-import')">
                <span v-if="showImportView">Done Importing</span>
                <span v-else><Import :size="16" /> Import Questions</span>
            </BaseButton>
        </div>
    </div>
</template>

<script setup>
import { Import, Plus } from '@lucide/vue';

defineProps({
    savePending: Boolean,
    saveStatus: String,
    showImportView: Boolean
});

defineEmits(['cancel', 'toggle-import', 'add-question']);
</script>
