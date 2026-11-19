<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center p-3" style="background: var(--storefront-bg, #FAF8F5);">
    <div class="card p-4 p-md-5 rounded-4 border shadow-sm w-100" style="max-width: 460px; background: var(--storefront-surface);">
      <router-link to="/login" class="text-decoration-none d-inline-flex align-items-center gap-2 mb-4 text-muted small">
        <ArrowLeft :size="15" />
        <span>Back to Sign In</span>
      </router-link>

      <h1 class="h3 fw-bold mb-1" style="color: var(--text-heading-color);">Create Account</h1>
      <p class="text-muted small mb-4">Join Tiki Tiki Beauty Salon for instant bookings &amp; VIP beauty rewards.</p>

      <form @submit.prevent="handleRegister" class="d-flex flex-column gap-3">
        <BaseInput v-model="form.name" label="Full Name" placeholder="e.g. Alisa Gitten" required />
        <BaseInput v-model="form.email" label="Email Address" type="email" placeholder="you@example.com" required />
        <BaseInput v-model="form.phone" label="Phone Number" type="tel" placeholder="+855 12 345 678" required />
        <BaseInput v-model="form.password" label="Password" type="password" placeholder="At least 6 characters" required />

        <BaseButton type="submit" variant="primary" class="w-100 justify-content-center mt-2">
          Create Account
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@lucide/vue'
import { useProfile } from '@/composables/useProfile'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const { updateAccount } = useProfile()
const toastStore = useToastStore()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: ''
})

const handleRegister = () => {
  if (form.password.length < 6) {
    toastStore.showToast('Password must be at least 6 characters.', 'danger')
    return
  }
  updateAccount({
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    tier: 'Member'
  })
  toastStore.showToast(`Welcome to Tiki Tiki, ${form.name.trim()}!`, 'success')
  router.push('/profile')
}
</script>
