<script setup>
import { computed } from 'vue'
import {
  BookOpen, User, Clock, Filter, Calendar, ArrowRight, CheckCircle
} from '@lucide/vue'
import { formatDate, formatTimeAgo } from '@/utils/dateFormat'

const props = defineProps({
  survey: {
    type: Object,
    required: true,
    default: () => ({}) // ✅ ensures survey is never null
  }
})

const emit = defineEmits(['start'])

const isCourse = computed(() =>
  props.survey?.target?.name?.toLowerCase() === 'course'
)

const isPending = computed(() => {
  // First check isCompleted field (most reliable)
  if (props.survey?.isCompleted === true || props.survey?.completedDate) {
    return false; // It's completed, not pending
  }

  // Then check status field
  const status = props.survey?.status || 'Pending';
  return status.toLowerCase() === 'pending';
})

const typeBadgeClass = computed(() =>
  isCourse.value ? 'bg-primary text-white-force' : 'bg-accent text-white-force'
)

const buttonClass = computed(() =>
  isCourse.value ? 'btn-dark hover-primary shadow-sm' : 'btn-dark hover-info shadow-sm'
)
</script>

<template>
  <div class="survey-card d-flex flex-column flex-md-row h-100 position-relative group hover-lift">
    <!-- Left body -->
    <div
      class="card-body-section flex-grow-1 bg-white rounded-top-4 rounded-md-start-4 p-4 border shadow-sm position-relative overflow-hidden d-flex flex-column justify-content-between">
      <div class="watermark position-absolute opacity-50">
        <component :is="isCourse ? BookOpen : User" :size="140" />
      </div>

      <div class="position-relative z-1 ps-md-3">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
          <span class="badge rounded-pill d-flex align-items-center gap-1 px-2 py-1 text-uppercase small fw-bold"
            :class="typeBadgeClass">
            <component :is="isCourse ? BookOpen : User" :size="12" />
            {{ survey.target?.name || 'ទូទៅ' }}
          </span>
          <span class="badge bg-light text-muted font-monospace border">{{ survey.ticketId }}</span>
        </div>

        <h5 class="fw-bold text-dark mb-2 lh-sm">{{ survey.title }}</h5>
        <p class="text-muted small mb-3 text-truncate-2">{{ survey.description }}</p>

        <div class="d-flex align-items-center gap-3 pt-3 border-top border-dashed">
          <div class="d-flex align-items-center gap-1 small text-muted fw-bold">
            <Clock :size="14" class="text-primary" /> {{ formatTimeAgo(survey.createdAt) }}
          </div>
          <div class="d-flex align-items-center gap-1 small text-muted fw-bold">
            <Filter :size="14" class="text-primary" /> {{ survey.questionCount }} សំណួរ
          </div>
        </div>
      </div>
    </div>

    <!-- Right stub -->
    <div
      class="card-stub-section w-100 w-md-auto bg-white rounded-bottom-4 rounded-md-end-4 p-4 border border-start-0 shadow-sm d-flex flex-column align-items-center justify-content-center gap-3 position-relative"
      style="min-width: 200px;">
      <div class="w-100 text-center position-relative z-1">
        <template v-if="isPending">
          <div class="mb-2">
            <span class="d-block text-uppercase text-muted fw-bold extra-small mb-1">កាលបរិច្ឆេទ</span>
            <span class="badge bg-danger-subtle text-danger d-inline-flex align-items-center gap-1">
              <Calendar :size="12" /> {{ formatDate(survey.expiryDate || survey.createdAt) }}
            </span>
          </div>

          <div class="barcode w-100 my-3 opacity-25"></div>

          <button @click="$emit('start', survey)"
            class="btn w-100 btn-sm fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2 py-2"
            :class="buttonClass">
            ចាប់ផ្តើម
            <ArrowRight :size="14" />
          </button>
        </template>

        <template v-else>
          <div class="text-center w-100">
            <span class="d-block text-uppercase text-secondary fw-bold extra-small mb-2 ls-1">បានបញ្ចប់</span>
            <h6 class="fw-bold text-dark mb-3">{{ formatDate(survey.completedDate) }}</h6>
          </div>

          <div class="barcode w-100 my-3"></div>

          <button @click="$emit('start', survey)"
            class="btn btn-sm btn-outline-primary w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 hover-primary">
            <CheckCircle :size="14" /> កែសម្រួលចម្លើយ
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.survey-card {
  --text: var(--text-base);
  --primary: var(--primary-color);
  --accent: #db6815;
  --secondary: var(--sidebar-text-muted);
  --background: var(--body-bg-color);
  --border-color: var(--border-clr);
  --sidebar-bg: var(--surface-ground);
}

.btn-outline-primary {
  border: 1px solid var(--text) !important;
  color: var(--text) !important;
}

.bg-primary {
  background-color: var(--primary) !important;
}

.bg-accent {
  background-color: var(--accent) !important;
}

.text-white-force {
  color: #fff !important;
}

.w-md-auto {
  width: auto !important;
}

@media (min-width: 768px) {
  .w-md-auto {
    width: 220px !important;
  }
}

.watermark {
  bottom: -20px;
  left: -20px;
  transform: rotate(12deg);
  transition: transform 0.5s ease;
  opacity: 1;
  z-index: 0;
  color: var(--secondary);
}

[data-theme="dark"] .watermark {
  color: rgba(255, 255, 255, 0.03);
}

.group:hover .watermark {
  transform: scale(1.1) rotate(12deg);
}

.bg-white {
  background-color: var(--background) !important;
}

[data-theme="dark"] .bg-white {
  background-color: var(--sidebar-bg) !important;
}

.border {
  border-color: var(--border-color) !important;
}

[data-theme="dark"] .border {
  border-color: var(--border-color) !important;
}

.bg-light {
  background-color: var(--border-color) !important;
}

[data-theme="dark"] .bg-light {
  background-color: var(--background) !important;
}

.text-dark {
  color: var(--text-heading-color) !important;
}

[data-theme="dark"] .text-dark {
  color: var(--text) !important;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.barcode {
  height: 30px;
  background: repeating-linear-gradient(90deg,
      currentColor,
      currentColor 1px,
      transparent 1px,
      transparent 3px);
}

.hover-lift {
  transition: transform 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
}

.hover-primary:hover {
  background-color: var(--primary) !important;
  border-color: var(--primary) !important;
  color: #fff !important;
}

.hover-info:hover {
  background-color: var(--accent) !important;
  border-color: var(--accent) !important;
  color: #fff !important;
}

.extra-small {
  font-size: 0.65rem;
  letter-spacing: 1px;
}

.bg-info-subtle {
  background-color: rgba(13, 202, 240, 0.1);
}

.border-dashed {
  border-style: dashed !important;
}

[data-theme="dark"] .border-dashed {
  border-color: var(--border-color) !important;
}

.btn-dark {
  background-color: var(--text-heading-color);
  color: #fff;
  border-color: var(--text-heading-color);
}

[data-theme="dark"] .btn-dark {
  background-color: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
</style>
