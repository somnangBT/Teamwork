<template>
  <div class="homepage-content">
    <!-- 1. Hero Section -->
    <HeroSection />

    <!-- 2. Signature Salon Services -->
    <ServicesShowcaseSection />

    <!-- 3. Products Section -->
    <ProductsSection />

    <!-- 4. Certified Groomers & Trust Pillars -->
    <SpecialistsSection />

    <!-- 5. Reviews, FAQ & Booking CTA -->
    <TestimonialsFaqSection />
  </div>
</template>

<script setup>
import HeroSection from './components/HeroSection.vue'
import ServicesShowcaseSection from './components/ServicesShowcaseSection.vue'
import ProductsSection from './components/ProductsSection.vue'
import SpecialistsSection from './components/SpecialistsSection.vue'
import TestimonialsFaqSection from './components/TestimonialsFaqSection.vue'
</script>

<style scoped>
.homepage-content {
  width: 100%;
}
</style>
