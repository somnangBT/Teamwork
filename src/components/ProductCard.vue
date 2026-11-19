<template>
  <article
    class="salon-product-card d-flex flex-column h-100"
    @click="$emit('view', product)"
  >
    <!-- Top Image Area -->
    <div class="card-thumb-wrap position-relative overflow-hidden mb-3">
      <img :src="product.image" :alt="product.name" class="w-100 h-100 card-thumb-img" loading="lazy" />

      <!-- Top-Right Favorite Circle Button (Reference Style) -->
      <button
        type="button"
        class="btn-card-fav position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
        @click.stop="$emit('favorite', product)"
        :class="{ 'is-fav': isFav }"
        :aria-pressed="isFav ? 'true' : 'false'"
        :aria-label="isFav ? 'Remove from favorites' : 'Save to favorites'"
      >
        <Heart :size="15" :fill="isFav ? 'currentColor' : 'none'" />
      </button>
    </div>

    <!-- Card Body -->
    <div class="d-flex flex-column flex-grow-1 px-1">
      <h3 class="product-name fw-bold mb-1" :title="product.name">
        {{ product.name }}
      </h3>

      <!-- Meta Line: Price | Stock | Category -->
      <div class="product-meta-line text-muted small mb-2">
        <span class="fw-bold text-primary">{{ product.price }}</span>
        <span class="mx-1">·</span>
        <span>{{ product.stock }} in stock</span>
      </div>

      <!-- Pastel Tag Pills (Reference Style) -->
      <div class="d-flex flex-wrap gap-1 mb-3">
        <span class="chip-pill chip-soft">{{ product.category }}</span>
        <span v-if="product.tag" class="chip-pill chip-accent">{{ product.tag }}</span>
        <span
          class="chip-pill"
          :class="product.status === 'Out of Stock' ? 'chip-danger' : (product.status === 'Low Stock' ? 'chip-warning' : 'chip-success')"
        >
          {{ product.status || 'In Stock' }}
        </span>
      </div>

      <!-- Full-Width Rounded CTA Button (Reference Style) -->
      <button
        type="button"
        class="btn-card-cta w-100 rounded-pill py-2 fw-semibold small mt-auto d-flex align-items-center justify-content-center gap-2"
        :disabled="product.stock <= 0"
        @click.stop="$emit('buy', product)"
      >
        <ShoppingBag :size="15" />
        <span>{{ product.stock <= 0 ? t('products.outOfStock') : t('products.addToBag') }}</span>
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { Heart, ShoppingBag } from '@lucide/vue'
import { useProfile } from '../composables/useProfile'
import { useI18n } from '../composables/useI18n'

const props = defineProps({
  product: { type: Object, required: true }
})

defineEmits(['buy', 'favorite', 'view'])

const { isProductFavorite } = useProfile()
const { t } = useI18n()

const isFav = computed(() => isProductFavorite(props.product.id))
</script>

<style scoped>
.salon-product-card {
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  border-radius: 16px;
  padding: 12px;
  box-shadow: none !important;
  transition: border-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.salon-product-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color, #EA7A38);
}

.card-thumb-wrap {
  aspect-ratio: 4 / 3;
  background-color: var(--surface-ground, #f1f5f9);
  border-radius: 12px;
  border: 1px solid var(--border-clr, #e2e8f0);
}

.card-thumb-img {
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

.salon-product-card:hover .card-thumb-img {
  transform: scale(1.03);
}

.btn-card-fav {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  color: var(--text-heading-color, #0f172a);
  transition: border-color 0.18s ease, color 0.18s ease;
  box-shadow: none !important;
}

.btn-card-fav:hover,
.btn-card-fav.is-fav {
  border-color: var(--danger-color, #ef4444);
  color: var(--danger-color, #ef4444);
}

.product-name {
  font-size: 0.96rem;
  line-height: 1.35;
  color: var(--text-heading-color, #0f172a);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta-line {
  font-size: 0.8rem;
}

.chip-pill {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 9999px;
  border: 1px solid transparent;
}

.chip-soft {
  background-color: var(--surface-ground, #f1f5f9);
  border-color: var(--border-clr, #e2e8f0);
  color: var(--text-base, #334155);
}

.chip-accent {
  background-color: var(--primary-color-soft);
  border-color: var(--primary-color-border);
  color: var(--primary-color, #EA7A38);
}

.chip-success {
  background-color: rgba(13, 148, 103, 0.1);
  border-color: rgba(13, 148, 103, 0.25);
  color: var(--success-color, #0d9467);
}

.chip-warning {
  background-color: rgba(217, 119, 6, 0.1);
  border-color: rgba(217, 119, 6, 0.25);
  color: var(--warning-color, #d97706);
}

.chip-danger {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.25);
  color: var(--danger-color, #ef4444);
}

.btn-card-cta {
  background-color: var(--primary-color, #EA7A38);
  border: var(--border-width, 1.5px) solid var(--primary-color, #EA7A38);
  color: #ffffff;
  transition: background-color 0.18s ease, border-color 0.18s ease;
  box-shadow: none !important;
}

.btn-card-cta:hover:not(:disabled) {
  background-color: var(--primary-color-dark, #D46222);
  border-color: var(--primary-color-dark, #D46222);
}

.btn-card-cta:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
