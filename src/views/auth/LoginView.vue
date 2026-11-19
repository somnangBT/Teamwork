<template>
  <div class="auth-page-wrapper p-3">
    <div class="auth-container">
      <!-- Left Showcase Panel (Desktop) -->
      <div class="auth-showcase d-none d-lg-flex">
        <div class="ambient-glow"></div>

        <div class="hero-badge">
          <span class="status-dot"></span>
          Tiki Tiki Beauty Salon &amp; Care
        </div>

        <div class="hero-body">
          <h2 class="hero-title">
            Luxury Hair Artistry &amp;<br />
            <span>Holistic Beauty Rituals</span>
          </h2>
          <p class="hero-desc">
            Book signature blowouts and head spas, manage your hair &amp; skin beauty profile, track orders, or step into the salon operations portal.
          </p>

          <div class="d-flex flex-column gap-3">
            <div class="feature-item">
              <div class="feature-icon-wrapper">
                <CalendarCheck :size="20" />
              </div>
              <div class="feature-info">
                <h4>Instant Online Booking</h4>
                <p>Choose your favorite stylist, date, and serene suite in seconds.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon-wrapper">
                <ShoppingBag :size="20" />
              </div>
              <div class="feature-info">
                <h4>Curated Beauty Store</h4>
                <p>Botanical shampoos, luxury argan oils, serums, and salon styling kits.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon-wrapper">
                <ShieldCheck :size="20" />
              </div>
              <div class="feature-info">
                <h4>Salon Management Portal</h4>
                <p>Full admin suite for appointments, inventory, orders, CRM, and staff.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="hero-footer">
          <div class="stat-box">
            <span class="stat-num">4.9★</span>
            <span class="stat-lbl">Client Rating</span>
          </div>
          <div class="stat-box">
            <span class="stat-num">100%</span>
            <span class="stat-lbl">Organic Botanicals</span>
          </div>
          <div class="stat-box">
            <span class="stat-num">Daily</span>
            <span class="stat-lbl">08:30 – 20:00</span>
          </div>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="auth-form-panel p-4 p-lg-5">
        <div class="auth-form-inner">
          <router-link to="/" class="text-decoration-none d-inline-flex align-items-center gap-2 mb-4 text-muted back-btn">
            <ArrowLeft :size="16" />
            <span>Back to Storefront</span>
          </router-link>

          <div class="d-flex align-items-center mb-2">
            <span class="fw-bolder fs-4" style="color: var(--text-heading-color);">Tiki Tiki</span>
          </div>

          <h1 class="h3 fw-bold mb-1" style="color: var(--text-heading-color);">Welcome back</h1>
          <p class="text-muted small mb-4">Sign in to manage bookings, orders, or the salon dashboard.</p>

          <LoginForm ref="loginFormRef" class="mb-3" @submit="handleValidSubmit" />

          <div class="d-flex justify-content-between align-items-center mb-3 small">
            <router-link to="/register" class="text-decoration-none fw-semibold text-primary">
              Create account
            </router-link>
            <router-link to="/forgot-password" class="text-decoration-none text-primary">
              Forgot Password?
            </router-link>
          </div>

          <BaseButton :isLoading="isLoading" type="submit" form="login-form" class="w-100 justify-content-center mb-3">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </BaseButton>

          <!-- Quick Demo Fill Helpers -->
          <div class="p-3 rounded-3 border" style="background: var(--surface-ground);">
            <div class="small fw-semibold mb-2 text-muted">Quick Demo Access</div>
            <div class="d-flex gap-2">
              <BaseButton type="button" variant="outline-primary" class="flex-grow-1 btn-sm" @click="quickDemo('customer')">
                Customer Demo
              </BaseButton>
              <BaseButton type="button" variant="outline-secondary" class="flex-grow-1 btn-sm" @click="quickDemo('admin')">
                Admin Demo
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, CalendarCheck, ShoppingBag, ShieldCheck } from '@lucide/vue'
import LoginForm from '@/components/forms/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'
import { useProfile } from '@/composables/useProfile'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { updateAccount } = useProfile()

const loginFormRef = ref(null)
const isLoading = ref(false)
const demoTarget = ref('customer')

const quickDemo = (target) => {
  demoTarget.value = target
  if (loginFormRef.value) {
    loginFormRef.value.setFieldValue('email', target === 'admin' ? 'admin@tikisalon.com' : 'alisa.gitten2910@gmail.com')
    loginFormRef.value.setFieldValue('password', 'password123')
  }
}

const handleValidSubmit = async (values) => {
  isLoading.value = true
  try {
    const result = await authStore.login({
      email: values.email.trim(),
      password: values.password.trim()
    })

    if (!result) return

    if (route.query.redirect) {
      router.push(String(route.query.redirect))
    } else if (demoTarget.value === 'admin' || values.email.includes('admin')) {
      router.push('/admin/dashboard')
    } else {
      updateAccount({ email: values.email.trim() })
      router.push('/profile')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page-wrapper {
  min-height: 100vh;
  background-color: var(--body-bg-color);
  display: flex;
}

.auth-container {
  width: 100%;
  display: flex;
  align-items: stretch;
  gap: 16px;
}

.auth-showcase {
  flex: 1.15;
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 16%, transparent) 0%, transparent 100%);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  flex-direction: column;
  justify-content: space-between;
  padding: 3.5rem;
}

.ambient-glow {
  position: absolute;
  top: -20%;
  left: -20%;
  width: 70%;
  height: 70%;
  background: radial-gradient(circle, color-mix(in srgb, var(--primary-color) 28%, transparent) 0%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary-color-soft);
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--primary-color);
  align-self: flex-start;
  position: relative;
  z-index: 1;
}

.status-dot {
  width: 7px;
  height: 7px;
  background-color: var(--primary-color);
  border-radius: 50%;
}

.hero-body {
  position: relative;
  z-index: 1;
  margin: auto 0;
}

.hero-title {
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 1rem;
  color: var(--text-heading-color);
}

.hero-title span {
  color: var(--primary-color);
}

.hero-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-base);
  margin-bottom: 2rem;
  max-width: 480px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.feature-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--primary-color-soft);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-info h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 2px 0;
  color: var(--text-heading-color);
}

.feature-info p {
  font-size: 0.84rem;
  margin: 0;
  color: var(--text-base);
  opacity: 0.85;
}

.hero-footer {
  display: flex;
  gap: 36px;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-clr);
  position: relative;
  z-index: 1;
}

.stat-box {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-heading-color);
}

.stat-lbl {
  font-size: 0.72rem;
  color: var(--secondary-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.auth-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form-inner {
  width: 100%;
  max-width: 420px;
}

.back-btn:hover {
  color: var(--primary-color) !important;
}
</style>
