<template>
  <div class="app-layout min-vh-100 d-flex flex-column position-relative">
    <StorefrontMotionBackground v-if="showStorefrontChrome" />

    <a v-if="showStorefrontChrome" href="#main-content" class="skip-link visually-hidden">
      Skip to main content
    </a>

    <!-- Global Animated Toast Notifications -->
    <BaseToast />

    <!-- Floating Glassmorphism Navbar for Customer Storefront -->
    <Navbar v-if="showStorefrontChrome" />

    <!-- Main Page Content -->
    <main id="main-content" tabindex="-1" class="w-100 flex-grow-1 position-relative" style="z-index: 1;">
      <router-view />
    </main>

    <!-- Storefront Footer -->
    <Footer v-if="showStorefrontChrome" class="position-relative" style="z-index: 1;" />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import StorefrontMotionBackground from './components/StorefrontMotionBackground.vue'
import { useTheme } from './composables/useTheme'

// Initialize synchronized light/dark theme on startup
useTheme()

const route = useRoute()

const showStorefrontChrome = computed(() => {
  if (route.path.startsWith('/admin')) return false
  if (route.meta?.hideChrome) return false
  return true
})

watch(() => route.path, () => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.app-layout {
  background-color: var(--body-bg-color, #ffffff);
  isolation: isolate;
  min-height: 100vh;
  color: var(--text-base, #0f172a);
}
</style>
