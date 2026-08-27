<template>
    <div class="card p-3 d-flex flex-column gap-2 w-100" style="background-color: var(--body-bg-color);position: sticky; top: 75px; max-height: calc(100vh - 3rem); overflow-y: auto;">
        <div class="d-flex align-items-center justify-content-between mb-3 px-1">
            <h6 class="mb-0 fw-bold text-muted">Sections</h6>
        </div>
        <div class="d-flex flex-column gap-2 flex-grow-1 overflow-y-auto pe-1 pb-4" style="min-height: 50px;">
            <div class="w-100" v-for="(section, sIndex) in dynamicSections" :key="section.id + '-tab'" :data-section-tab-idx="sIndex">
                <BaseButton 
                    :variant="activeTabId === section.id ? 'primary' : 'outline-primary'"
                    class="w-100 d-flex align-items-center justify-content-start gap-2 text-start p-2 flex-shrink-0"
                    :class="{ 'custom-dragging': customDragState.isDragging && customDragState.type === 'section' && customDragState.sIndex === sIndex }"
                    @click="$emit('update:activeTabId', section.id)">
                    
                    <GripVertical class="drag-handle hover-opacity-100 flex-shrink-0" :class="activeTabId === section.id ? 'opacity-75 text-white' : 'opacity-50'" :size="14" @mousedown.stop.prevent="startCustomDrag($event, 'section', sIndex)" />
                    
                    <span class="text-truncate flex-grow-1 fw-medium" style="max-width: 100%;">{{ section.title || `Section ${sIndex + 1}` }}</span>
                    
                    <X :size="14" v-if="dynamicSections.length > 1" @click.stop="$emit('remove-section', sIndex)" class="ms-1 hover-opacity-100 rounded-circle flex-shrink-0" :class="activeTabId === section.id ? 'opacity-75 text-white' : 'opacity-50'" />
                </BaseButton>
            </div>
        </div>
        
        <hr class="my-1 text-muted opacity-25" />
        
        <BaseButton variant="outline-primary" class="w-100 d-flex align-items-center justify-content-center gap-2 mt-1" @click="$emit('add-section')" style="border-style: dashed; border-width: 2px;">
            <Plus :size="16" /> Add Section
        </BaseButton>
    </div>
</template>

<script setup>
import { Plus, X, GripVertical } from '@lucide/vue';

defineProps({
    dynamicSections: { type: Array, required: true },
    activeTabId: { type: String, default: null },
    customDragState: { type: Object, required: true },
    startCustomDrag: { type: Function, required: true }
});

defineEmits(['update:activeTabId', 'remove-section', 'add-section']);
</script>
