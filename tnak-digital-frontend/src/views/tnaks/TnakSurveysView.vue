<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSurveyStudentStore } from '@/stores/surveys/surveyStudent'
import SurveyCard from './components/SurveyCard.vue'
import { Search, ListFilter } from '@lucide/vue'

const router = useRouter()
const surveyStudentStore = useSurveyStudentStore()

const searchText = ref('')
const statusFilter = ref('all')

const isPending = (survey) => {
  if (survey?.isCompleted === true || survey?.completedDate) return false
  return (survey?.status || 'Pending').toLowerCase() === 'pending'
}

onMounted(async () => {
  await surveyStudentStore.getAllSurveyStudent()
})

const totalCount = computed(() => surveyStudentStore.states.surveyStudent.length)
const pendingCount = computed(() => surveyStudentStore.states.surveyStudent.filter(s => isPending(s)).length)
const completedCount = computed(() => surveyStudentStore.states.surveyStudent.filter(s => !isPending(s)).length)
const completionRate = computed(() => totalCount.value === 0 ? 0 : Math.round((completedCount.value / totalCount.value) * 100))

const filteredSurveys = computed(() => {
  return surveyStudentStore.states.surveyStudent.filter(survey => {
    const matchesSearch = !searchText.value ||
      survey.title?.toLowerCase().includes(searchText.value.toLowerCase()) ||
      survey.description?.toLowerCase().includes(searchText.value.toLowerCase())
    const pendingStatus = isPending(survey)
    const matchesStatus = statusFilter.value === 'all' ||
      (statusFilter.value === 'pending' && pendingStatus) ||
      (statusFilter.value === 'completed' && !pendingStatus)
    return matchesSearch && matchesStatus
  })
})

const handleStartSurvey = (survey) => {
  router.push({ name: 'tnak-survey', params: { id: survey.id } })
}
</script>

<template>
  <div class="surveys-page container-lg container-fluid py-4">

    <!-- Page Header -->
    <div class="page-header mb-4">
      <h2 class="page-title mb-1">ការស្ទង់មតិ និង មតិកែលម្អ</h2>
      <p class="page-desc text-secondary mb-0">សូមចូលរួមចំណែកផ្ដល់មតិកែលម្អរបស់អ្នក ដើម្បីកែលម្អគុណភាពនៃការអប់រំ។</p>
    </div>

    <!-- Stats Row -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-sm-3">
        <div class="stat-card p-3 rounded-3">
          <span class="stat-label d-block mb-1">សរុប</span>
          <span class="stat-value">{{ totalCount }}</span>
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="stat-card p-3 rounded-3">
          <span class="stat-label d-block mb-1">កំពុងរង់ចាំ</span>
          <span class="stat-value">{{ pendingCount }}</span>
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="stat-card p-3 rounded-3">
          <span class="stat-label d-block mb-1">បានបញ្ចប់</span>
          <span class="stat-value">{{ completedCount }}</span>
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="stat-card p-3 rounded-3">
          <span class="stat-label d-block mb-1">អត្រាបញ្ចប់</span>
          <span class="stat-value">{{ completionRate }}%</span>
          <div class="progress mt-2" style="height: 3px;">
            <div class="progress-bar" role="progressbar" :style="{ width: completionRate + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
      <div class="search-wrapper position-relative" style="max-width: 340px; flex: 1;">
        <Search class="search-icon position-absolute text-muted" :size="16" />
        <input
          v-model="searchText"
          type="text"
          placeholder="ស្វែងរកការស្ទង់មតិ..."
          class="form-control ps-5 rounded-pill"
        />
      </div>
      <div class="d-flex gap-2">
        <button
          v-for="f in [
            { key: 'all', label: 'ទាំងអស់' },
            { key: 'pending', label: `កំពុងរង់ចាំ (${pendingCount})` },
            { key: 'completed', label: `បានបញ្ចប់ (${completedCount})` }
          ]"
          :key="f.key"
          @click="statusFilter = f.key"
          class="btn btn-sm rounded-pill filter-btn"
          :class="statusFilter === f.key ? 'btn-dark' : 'btn-outline-secondary'"
        >{{ f.label }}</button>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="surveyStudentStore.states.isLoading" class="d-flex flex-column align-items-center justify-content-center py-5">
      <div class="spinner-border text-secondary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted small mb-0">កំពុងទាញយកទិន្នន័យ...</p>
    </div>

    <!-- Grid -->
    <div v-else>
      <div v-if="filteredSurveys.length > 0" class="row g-3">
        <div v-for="survey in filteredSurveys" :key="survey.id" class="col-12 col-xl-6">
          <SurveyCard :survey="survey" @start="handleStartSurvey" />
        </div>
      </div>
      <div v-else class="empty-state rounded-3 p-5 text-center">
        <ListFilter :size="36" class="text-muted opacity-50 mb-3" />
        <p class="fw-medium mb-1">មិនមានទិន្នន័យ</p>
        <p class="text-muted small mb-0">គ្មានការស្ទង់មតិដែលត្រូវគ្នានឹងតម្រងរបស់អ្នក។</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.surveys-page {
  margin-top: 60px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-base);
}

.page-desc {
  font-size: 0.875rem;
  max-width: 520px;
}

.stat-card {
  background-color: var(--body-bg-color);
  border: 1px solid var(--border-clr);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--sidebar-text-muted);
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-base);
}

.progress {
  background-color: var(--border-clr);
}

.progress-bar {
  background-color: var(--primary-color);
}

.search-icon {
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
}

.form-control {
  height: 38px;
  font-size: 0.875rem;
  border-color: var(--border-clr);
  background-color: var(--body-bg-color);
  color: var(--text-base);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-color-soft);
  background-color: var(--body-bg-color);
  color: var(--text-base);
}

.filter-btn {
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
}

.btn-dark {
  background-color: var(--text-base) !important;
  border-color: var(--text-base) !important;
  color: var(--body-bg-color) !important;
}

.btn-outline-secondary {
  border-color: var(--border-clr) !important;
  color: var(--sidebar-text-muted) !important;
  background-color: transparent !important;
}

.btn-outline-secondary:hover {
  background-color: var(--primary-color-soft) !important;
  color: var(--primary-color) !important;
}

.empty-state {
  border: 1px dashed var(--border-clr);
  color: var(--text-base);
}
</style>