<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center p-3" style="background: var(--storefront-bg, #FAF8F5);">
    <div class="card p-4 p-md-5 rounded-4 border shadow-sm w-100" style="max-width: 440px; background: var(--storefront-surface);">
      <router-link to="/login" class="text-decoration-none d-inline-flex align-items-center gap-2 mb-4 text-muted small">
        <ArrowLeft :size="15" />
        <span>Back to Sign In</span>
      </router-link>

      <h1 class="h3 fw-bold mb-1" style="color: var(--text-heading-color);">Reset Password</h1>
      <p class="text-muted small mb-4">Enter your email address and we will send you a password reset link.</p>

      <form v-if="!sent" @submit.prevent="sendResetLink" class="d-flex flex-column gap-3">
        <BaseInput v-model="email" label="Email Address" type="email" placeholder="you@example.com" required />
        <BaseButton type="submit" variant="primary" class="w-100 justify-content-center">
          Send Reset Link
        </BaseButton>
      </form>

      <div v-else class="text-center py-3">
        <CheckCircle2 :size="48" class="text-success mb-3 mx-auto" />
        <h5 class="fw-bold mb-1">Check your inbox</h5>
        <p class="text-muted small mb-4">
          Reset instructions have been sent to <strong>{{ email }}</strong>.
        </p>
        <BaseButton variant="outline-primary" class="w-100 justify-content-center" @click="router.push('/login')">
          Return to Login
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, CheckCircle2 } from '@lucide/vue'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const toastStore = useToastStore()
const email = ref('')
const sent = ref(false)

const sendResetLink = () => {
  if (!email.value.trim()) return
  sent.value = true
  toastStore.showToast(`Password reset link sent to ${email.value}`, 'success')
}
</script>
