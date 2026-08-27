<template>
  <div class="hero-page-wrapper">
    <HeroBanner />
  </div>
</template>

<script setup>
import HeroBanner from '../../components/HeroBanner.vue'
</script>

<style scoped>
.hero-page-wrapper {
  min-height: 100vh;
  background-color: var(--color-bg);
}
</style>
