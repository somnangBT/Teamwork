<template>
  <div class="homepage-content">
    <!-- 1. Hero Section -->
    <HeroSection />

    <!-- 2. Products Section (Directly following the Hero Banner) -->
    <ProductsSection />
  </div>
</template>

<script setup>
import HeroSection from './components/HeroSection.vue'
import ProductsSection from './components/ProductsSection.vue'
</script>

<style scoped>
.homepage-content {
  width: 100%;
}
</style>
