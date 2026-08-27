<template>
  <div class="awwwards-card d-flex flex-column h-100">
    <!-- Thumbnail Area -->
    <div class="card-thumb-wrap position-relative overflow-hidden mb-3">
      <img :src="product.image" :alt="product.name" class="w-100 h-100 card-thumb-img" />
      
      <!-- Top Badges Overlay -->
      <div class="thumb-top-badges position-absolute top-0 start-0 w-100 p-2 d-flex justify-content-between align-items-center pointer-events-none">
        <span class="badge-tag badge-tag-orange fw-bold" v-if="product.badge || product.rating >= 4.8">
          SOTD
        </span>
        <span v-else></span>

        <button 
          class="btn-card-fav border-0 d-flex align-items-center justify-content-center pointer-events-auto"
          @click.stop="$emit('favorite', product)"
          :class="{ 'is-fav': isFav }"
          title="Save to collection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      <!-- Quick Action Overlay on Hover -->
      <div class="thumb-hover-action position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-between align-items-center">
        <span class="fw-bold text-white small">{{ product.price }}</span>
        <button 
          class="btn btn-sm btn-light rounded-pill px-3 py-1 fw-bold small d-flex align-items-center gap-1 shadow-sm"
          @click.stop="$emit('buy', product)"
        >
          <span>Add to Bag</span>
          <span>+</span>
        </button>
      </div>
    </div>

    <!-- Bottom Info (Awwwards Meta Row) -->
    <div class="card-meta-row d-flex align-items-center justify-content-between pt-1">
      <!-- Left: Avatar + Title + PRO -->
      <div class="d-flex align-items-center gap-2 overflow-hidden me-2">
        <div class="author-avatar d-flex align-items-center justify-content-center rounded-circle flex-shrink-0">
          <span class="fw-bold">{{ (product.name || 'W')[0] }}</span>
        </div>
        <div class="product-title-wrap text-truncate">
          <span class="product-name fw-semibold text-dark text-truncate d-inline-block align-middle me-1">
            {{ product.name }}
          </span>
          <span class="pro-tag text-uppercase align-middle">PRO</span>
        </div>
      </div>

      <!-- Right: Badges (DEV / SOTD / Price) -->
      <div class="d-flex align-items-center gap-1 flex-shrink-0">
        <span class="badge-tag badge-tag-dev">DEV</span>
        <span class="badge-tag" v-if="product.category">{{ product.category.slice(0, 4).toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ 
  product: { type: Object, required: true } 
})
defineEmits(['buy', 'favorite'])

const isFav = ref(false)
</script>

<style scoped>
.awwwards-card {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.awwwards-card:hover {
  transform: translateY(-4px);
}

/* Thumbnail */
.card-thumb-wrap {
  aspect-ratio: 16 / 11;
  background-color: var(--color-bg-alt);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.awwwards-card:hover .card-thumb-wrap {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-card);
}

.card-thumb-img {
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.awwwards-card:hover .card-thumb-img {
  transform: scale(1.04);
}

/* Favorite Icon Button */
.btn-card-fav {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  color: #111111;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

:root.dark-theme .btn-card-fav {
  background-color: rgba(24, 24, 28, 0.85);
  color: #f4f4f5;
}

.btn-card-fav:hover {
  transform: scale(1.1);
  background-color: #ffffff;
  color: var(--color-accent);
}

.btn-card-fav.is-fav {
  color: var(--color-accent);
}

/* Hover Action Bar */
.thumb-hover-action {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 100%);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.awwwards-card:hover .thumb-hover-action {
  opacity: 1;
  transform: translateY(0);
}

/* Author Avatar */
.author-avatar {
  width: 22px;
  height: 22px;
  background-color: var(--color-heading);
  color: var(--color-bg);
  font-size: 0.65rem;
}

/* Title & Pro Tag */
.product-name {
  font-size: 0.88rem;
  max-width: 140px;
}

.pro-tag {
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.4px;
  color: var(--color-text-lighter);
}

.pointer-events-none {
  pointer-events: none;
}

.pointer-events-auto {
  pointer-events: auto;
}
</style>
