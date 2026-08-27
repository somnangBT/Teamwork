<template>
  <div class="app-layout min-vh-100 position-relative">
    <!-- Floating Glassmorphism Navbar for Customer Storefront -->
    <Navbar v-if="!isAdminRoute" />

    <!-- Main Page Content -->
    <main class="w-100">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'

const route = useRoute()

const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

watch(() => route.path, () => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.app-layout {
  background-color: var(--body-bg-color, #ffffff);
  min-height: 100vh;
  color: var(--text-base, #0f172a);
}
</style>
