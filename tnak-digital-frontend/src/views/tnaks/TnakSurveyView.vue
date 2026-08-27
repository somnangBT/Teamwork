<template>
  <div class="pb-3">
    <div class="d-flex flex-column align-items-center">
      <div style="max-width: 800px; width: 100%;">

        <!-- Error -->
        <div v-if="pageError" class="page-error">
          <span class="err-icon">⚠</span>
          <p>{{ pageError }}</p>
        </div>

        <!-- Loading -->
        <div v-else-if="pageLoading && !survey" class="d-flex flex-column align-items-center justify-content-center py-5">
          <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
          <h5 class="text-muted fw-medium">Loading Survey...</h5>
        </div>

        <div v-else-if="survey">

          <div class="panel-card p-lg-4 p-3 mb-3">
            <h3 class="fw-medium mb-3" style="color: var(--text-heading-color);">{{ survey.title }}</h3>
            <p class="text-muted m-0">{{ survey.description }}</p>
            <hr class="main-divider my-3" />
            <p class="text-muted m-0" style="font-size: 0.9rem;">
              <span class="text-danger">* Indicates required question</span>
            </p>
          </div>

          <div class="sections-wrap" v-if="survey.sections?.length && !submitted">

            <div class="card px-lg-4 p-3  mb-0" style="background-color: var(--primary-color); border-bottom-left-radius: 0; border-bottom-right-radius: 0;">
              <div class="fw-medium" style="color: var(--text-white);">
                {{ survey.sections[currentSectionIndex].title }}
              </div>
            </div>

            <div class="d-flex flex-column gap-2 mb-3">
              <div v-for="(q, qIndex) in survey.sections[currentSectionIndex].questions" :key="q.questionId"
                class="panel-card p-lg-4 p-3"
                :style="qIndex === 0 ? 'border-top-left-radius: 0; border-top-right-radius: 0;' : ''">

                <div class="d-flex align-items-start gap-1 mb-3">
                  <span class="fw-medium" style="color: var(--text-base);">
                    {{ q.questionText }}
                  </span>
                  <span class="text-danger" v-if="q.isRequired">*</span>
                </div>

                <div class="q-body">
                  <!-- Text -->
                  <BaseInput type="textarea" :rows="2" v-if="q.questionType === 'TEXT'" v-model="answers[q.questionId]"
                    @blur="saveAnswer(q.questionId, answers[q.questionId], 'TEXT')"
                    placeholder="Type your answer here..." class="modern-textarea">
                  </BaseInput>

                  <!-- Choice -->
                  <div v-else-if="q.questionType === 'CHOICE'" class="d-flex flex-column gap-3">
                    <label v-for="opt in q.options" :key="opt"
                      class="modern-radio-opt d-flex align-items-center gap-3 ">
                      <input type="radio" :value="opt" v-model="answers[q.questionId]"
                        @change="saveAnswer(q.questionId, opt, 'CHOICE')" class="d-none" />

                      <div
                        class="radio-circle d-flex align-items-center justify-content-center rounded-circle"
                        :class="answers[q.questionId] === opt ? 'active' : 'inactive'">
                      </div>

                      <span class="text-base">{{ opt }}</span>
                    </label>
                  </div>

                  <!-- Rating -->
                  <div v-else-if="q.questionType === 'RATING'" class="d-flex gap-lg-4 gap-3 align-items-center justify-content-center flex-wrap mt-3">
                    <div v-for="n in (q.ratingMax || 5)" :key="n" 
                         class="d-flex flex-column align-items-center gap-3" 
                         style="cursor: pointer; min-width: 32px;"
                         @click="setRating(q.questionId, n)">
                      <span class="fw-medium" style="color: var(--text-base); font-size: 14px;">{{ n }}</span>
                      <Star :size="24" 
                            :class="answers[q.questionId] >= n ? 'text-warning' : 'text-muted'"
                            :fill="answers[q.questionId] >= n ? 'currentColor' : 'none'"
                            :stroke-width="answers[q.questionId] >= n ? 0 : 1.5" 
                            />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="d-flex justify-content-between align-items-center">
              <BaseButton variant="outline-primary" v-if="currentSectionIndex > 0" @click="prevSection"
                :disabled="loading">
                <ArrowLeft :size="18" class="me-2" /> Previous
              </BaseButton>
              <div v-else></div> <!-- Spacer -->

              <BaseButton v-if="currentSectionIndex < survey.sections.length - 1" variant="primary" @click="nextSection"
                :disabled="loading || !currentSectionAnswered">
                Next
                <ArrowRight :size="18" class="ms-2 d-flex align-items-center" />
              </BaseButton>

              <BaseButton v-else variant="primary" @click="submitSurvey" :disabled="loading || !allAnswered">
                {{ loading ? 'Submitting...' : 'Submit Survey' }}
              </BaseButton>
            </div>

          </div>

          <!-- Submitted state -->
          <div v-if="submitted" class="panel-card p-5 text-center mt-3">
            <div class="d-flex justify-content-center mb-3">
              <div class="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center"
                style="width: 80px; height: 80px;">
                <CheckCircle style="color: var(--text-white);" :size="40" />
              </div>
            </div>
            <h3 class="fw-bold mb-3" style="color: var(--text-heading-color);">Survey Submitted!</h3>
            <p class="text-muted fw-medium mb-4">Thank you! Your responses have been successfully recorded.</p>
            <BaseButton variant="primary" class="mx-auto" @click="router.push({ name: 'tnak-surveys' })">
              <Home />
              Back to your Surveys List
            </BaseButton>
          </div>

        </div>
      </div>
    </div>
    <BaseModal v-model="showUnlockModal" title="Unlock Survey" size="sm" :closeOnBackdrop="false" :showCloseButton="false">
      <p class="text-base mb-3">This survey requires an access code to participate.</p>
      <div class="d-flex flex-column gap-2">
        <BaseInput id="accessCode" required v-model="accessCode" label="Access Code" placeholder="Enter code..." class="w-100" @keyup.enter="submitUnlock" />
      </div>
      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100">
          <BaseButton variant="outline-primary" @click="router.push({ name: 'tnak-surveys' })">Back to List</BaseButton>
          <BaseButton variant="primary" @click="submitUnlock" :loading="isUnlocking" :disabled="!accessCode || isUnlocking">
            {{ isUnlocking ? 'Unlocking...' : 'Unlock' }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSurveyStudentStore } from '@/stores/surveys/surveyStudent'
import { useToastStore } from '@/stores/toast'
import { Star, CheckCircle, ArrowRight, ArrowLeft, Home } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const surveyStudentStore = useSurveyStudentStore()
const toastStore = useToastStore();

const responseId = ref(null)
const survey = ref(null)
const answers = ref({})
const submitted = ref(false)
const loading = ref(false)
const pageLoading = ref(false)
const pageError = ref(null)
const currentSectionIndex = ref(0)

const showUnlockModal = ref(false)
const accessCode = ref('')
const isUnlocking = ref(false)

const allAnswered = computed(() => {
  if (!survey.value) return false
  return survey.value.sections.every(section =>
    section.questions.every(q => {
      if (!q.isRequired) return true;
      return answers.value[q.questionId] !== undefined && answers.value[q.questionId] !== ''
    })
  )
})

const currentSectionAnswered = computed(() => {
  if (!survey.value) return false
  return survey.value.sections[currentSectionIndex.value].questions.every(q => {
    if (!q.isRequired) return true;
    return answers.value[q.questionId] !== undefined && answers.value[q.questionId] !== ''
  })
})

const progressPercent = computed(() => {
  if (!survey.value) return 0
  return Math.round(((currentSectionIndex.value + 1) / survey.value.sections.length) * 100)
})

onMounted(async () => {
  const surveyId = route.params.id
  const isShare = route.query.share === 'true'
  if (!surveyId) {
    pageError.value = 'No survey ID provided.'
    return
  }
  await loadSurvey(surveyId, isShare)
})

async function loadSurvey(surveyId, isShare = false, forceRefresh = false) {
  let data = surveyStudentStore.states.surveyStudentDetail;
  const shouldForceRefresh = forceRefresh || isShare;
  const params = isShare ? { share: 'true' } : {};

  const numericId = Number(surveyId);

  if (shouldForceRefresh || !data || data.id !== numericId) {
    pageLoading.value = true
    try {
      await surveyStudentStore.getSurveyStudentDetails(surveyId, shouldForceRefresh, params)
      data = surveyStudentStore.states.surveyStudentDetail;
    } catch (error) {
      pageError.value = 'Failed to load survey. Please try again.'
      pageLoading.value = false
      return
    }
  }

  if (!data) {
    pageError.value = 'Survey not found.'
    pageLoading.value = false
    return
  }

  if (data.requiresAccessCode && !data.isUnlocked) {
    showUnlockModal.value = true
    pageLoading.value = false
    return
  }

  pageLoading.value = true
  try {
    await initializeSurvey(surveyId, data)
  } catch (error) {
    pageError.value = 'Failed to load survey. Please try again.'
  } finally {
    pageLoading.value = false
  }
}

async function initializeSurvey(surveyId, data) {
    const initialAnswers = {};
    
    // Extract auto-saved answers synchronously from the fetched survey details
    if (data?.sections) {
      data.sections.forEach(section => {
        if (section.questions) {
          section.questions.forEach(q => {
            if (q.savedAnswer) {
              initialAnswers[q.questionId] = 
                q.savedAnswer.answerText || 
                q.savedAnswer.answerChoice || 
                q.savedAnswer.answerRating || 
                '';
            }
          });
        }
      });
    }

    answers.value = initialAnswers;
    survey.value = data;
    submitted.value = false;
    currentSectionIndex.value = 0;

    const res = await surveyStudentStore.startSurvey(surveyId);

    if (res?.isCompleted) {
      router.push({ name: 'tnak-surveys' })
      return
    }

    responseId.value = res?.id ?? res?.responseId ?? null

    // Fallback if startSurvey returned responses we missed
    if (res?.responses?.length) {
      res.responses.forEach(r => {
        if (answers.value[r.questionId] === undefined || answers.value[r.questionId] === '') {
          answers.value[r.questionId] = r.answerText || r.rating || (r.selectedOptions && r.selectedOptions[0]) || ''
        }
      })
    }
}

const submitUnlock = async () => {
    if (!accessCode.value) return;

    const surveyId = route.params.id;
    isUnlocking.value = true;
    const success = await surveyStudentStore.unlockSurvey(surveyId, accessCode.value);
    isUnlocking.value = false;

    if (success) {
        showUnlockModal.value = false;
        accessCode.value = '';
        await loadSurvey(surveyId, route.query.share === 'true', true);
    }
}

function nextSection() {
  if (currentSectionIndex.value < survey.value.sections.length - 1) {
    currentSectionIndex.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function prevSection() {
  if (currentSectionIndex.value > 0) {
    currentSectionIndex.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function saveAnswer(questionId, value, type) {
  if (!responseId.value) return
  try {
    let payload
    if (type === 'TEXT') payload = { questionId, answerText: value }
    else if (type === 'CHOICE') payload = { questionId, answerChoice: value }
    else payload = { questionId, answerRating: Number(value) }

    await surveyStudentStore.answerSurveyQuestion(responseId.value, payload)
  } catch (err) {
    console.error('Save answer error:', err)
  }
}

function setRating(questionId, value) {
  answers.value[questionId] = value
  saveAnswer(questionId, value, 'RATING')
}

async function submitSurvey() {
  if (!responseId.value) {
    toastStore.showToast('No response session found.', 'error')
    return
  }
  loading.value = true
  try {
    const updated = await surveyStudentStore.submitSurveyResponse(responseId.value)
    if (updated?.isCompleted) {
      submitted.value = true
    } else {
      toastStore.showToast('Survey submission failed.', 'danger')
    }
  } catch (err) {
    console.error('Submit error:', err)
    toastStore.showToast('Failed to submit survey.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.panel-card {
  background: var(--body-bg-color);
  border-radius: var(--border-radius);
}

.modern-radio-opt .radio-circle.inactive {
  border: var(--border-width) solid var(--border-hover-color);
  width: 20px;
  height: 20px;
}

.modern-radio-opt .radio-circle.active {
  border: var(--border-width) solid var(--primary-color);
  background-color: var(--primary-color);
  box-shadow: inset 0 0 0 4px var(--body-bg-color);
  width: 20px;
  height: 20px;
}

.page-error {
  text-align: center;
  padding: 60px 20px;
  color: var(--sidebar-text-muted);
}

.err-icon {
  font-size: 2rem;
  color: var(--danger-color);
}
</style>