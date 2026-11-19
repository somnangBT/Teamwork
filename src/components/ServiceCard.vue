<template>
  <article
    class="template-service-card position-relative d-flex flex-column h-100 cursor-pointer"
    :class="{ 'is-selected': isSelected }"
    @click="$emit('preview', service)"
  >
    <!-- 1. Top Real Photo Box -->
    <div class="template-canvas-box position-relative overflow-hidden mb-3">
      <img
        :src="service.image || '/images/svc_salon_blowout.jpg'"
        :alt="service.title"
        class="service-photo-img w-100 h-100 d-block"
        loading="lazy"
      />
      <div class="service-photo-scrim position-absolute inset-0" aria-hidden="true"></div>

      <!-- Category Pill -->
      <div class="position-absolute top-0 end-0 m-2 z-2">
        <span class="badge-category-pill" :class="getCategoryTagClass(service.category)">
          {{ service.categoryBadge || service.category }}
        </span>
      </div>

      <!-- Featured / Popular Badge -->
      <div v-if="service.badge" class="position-absolute top-0 start-0 m-2 z-2">
        <span class="badge-hot-pill">{{ service.badge }}</span>
      </div>
    </div>

    <!-- 2. Inclusions Row -->
    <div class="d-flex justify-content-between align-items-center mb-2 px-1">
      <div class="d-flex align-items-center gap-1 tool-icons-group">
        <span class="tool-mini-icon" title="Consultation Included">
          <MessageCircle :size="12" class="text-muted" />
        </span>
        <span class="tool-mini-icon" title="Organic Botanicals">
          <Leaf :size="12" class="text-success" />
        </span>
        <span class="tool-mini-icon" title="Gentle Spa Care">
          <Sparkles :size="12" class="text-primary" />
        </span>
        <span class="tool-count-badge small">+{{ service.highlights?.length || 3 }}</span>
      </div>

      <div class="specialist-mini-profile d-flex align-items-center gap-1" :title="service.specialistName || 'Senior Stylist'">
        <img
          :src="service.specialistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80'"
          alt="Assigned specialist"
          class="mini-avatar-img rounded-circle object-fit-cover"
        />
      </div>
    </div>

    <!-- 3. Title & Description -->
    <div class="card-content-body flex-grow-1 px-1 mb-3">
      <h3 class="template-title fw-bold mb-1">{{ service.title }}</h3>
      <p class="template-desc text-muted small m-0 line-clamp-2">
        {{ service.description }}
      </p>
    </div>

    <!-- 4. Bottom Meta Bar & Book Button -->
    <div class="template-footer-bar d-flex justify-content-between align-items-center pt-2 border-top mt-auto px-1">
      <div class="d-flex align-items-center gap-1 template-meta-stats text-muted small">
        <span class="fw-bold text-primary">${{ service.price }}</span>
        <span class="opacity-60">•</span>
        <span>{{ service.duration }}</span>
      </div>

      <button
        type="button"
        class="btn-template-action rounded-2 px-3 py-1 fw-semibold small"
        :class="{ 'btn-template-active': isSelected }"
        @click.stop="$emit('select', service)"
      >
        <span>{{ isSelected ? t('services.selected') : t('services.bookNow') }}</span>
      </button>
    </div>
  </article>
</template>

<script setup>
import { MessageCircle, Leaf, Sparkles } from '@lucide/vue'
import { useI18n } from '../composables/useI18n'

defineProps({
  service: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select', 'preview'])

const { t } = useI18n()

const getCategoryTagClass = (category) => {
  if (!category) return 'cat-tag-default'
  const c = category.toLowerCase()
  if (c.includes('hair')) return 'cat-tag-blue'
  if (c.includes('head') || c.includes('scalp') || c.includes('spa')) return 'cat-tag-purple'
  if (c.includes('nail') || c.includes('beauty')) return 'cat-tag-pink'
  if (c.includes('facial') || c.includes('skin')) return 'cat-tag-green'
  if (c.includes('vip') || c.includes('package')) return 'cat-tag-orange'
  return 'cat-tag-default'
}
</script>

<style scoped>
.template-service-card {
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0) !important;
  border-radius: var(--border-radius, 12px);
  padding: 12px;
  box-shadow: none !important;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.template-service-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color, #EA7A38) !important;
}

.template-service-card.is-selected {
  border-color: var(--primary-color, #EA7A38) !important;
  background-color: var(--primary-color-soft);
}

.template-canvas-box {
  background-color: var(--surface-ground, #f1f5f9);
  aspect-ratio: 16 / 10;
  width: 100%;
  border-radius: var(--border-inner-radius, 8px);
  border: 1px solid var(--border-clr, #e2e8f0);
}

.service-photo-img {
  object-fit: cover;
  object-position: center;
}

@media (prefers-reduced-motion: no-preference) {
  .service-photo-img {
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .template-service-card:hover .service-photo-img {
    transform: scale(1.04);
  }
}

.service-photo-scrim {
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.28) 0%, transparent 55%);
  pointer-events: none;
}

.badge-category-pill {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.22rem 0.58rem;
  border-radius: 999px;
  background-color: var(--storefront-surface, #ffffff);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.badge-hot-pill {
  display: inline-block;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background-color: var(--primary-color, #EA7A38);
  color: #ffffff;
}

.cat-tag-blue { color: #2563eb; border: 1px solid rgba(37, 99, 235, 0.35); }
.cat-tag-purple { color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.35); }
.cat-tag-green { color: #16a34a; border: 1px solid rgba(22, 163, 74, 0.35); }
.cat-tag-pink { color: #db2777; border: 1px solid rgba(219, 39, 119, 0.35); }
.cat-tag-orange { color: var(--primary-color); border: 1px solid var(--primary-color-border); }
.cat-tag-default { color: var(--text-heading-color); border: 1px solid var(--border-clr); }

.tool-mini-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: var(--surface-ground, #f1f5f9);
  border: 1px solid var(--border-clr, #e2e8f0);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tool-count-badge {
  font-size: 0.68rem;
  color: var(--secondary-color, #64748b);
  font-weight: 600;
  margin-left: 2px;
}

.mini-avatar-img {
  width: 24px;
  height: 24px;
  border: 1.5px solid var(--border-clr, #e2e8f0);
  box-shadow: none !important;
}

.template-title {
  font-size: 0.94rem;
  color: var(--text-heading-color, #0f172a);
  line-height: 1.3;
}

.template-service-card:hover .template-title {
  color: var(--primary-color, #EA7A38);
}

.template-desc {
  font-size: 0.78rem;
  line-height: 1.45;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.template-meta-stats {
  font-size: 0.78rem;
}

.btn-template-action {
  background-color: var(--primary-color-soft);
  color: var(--primary-color, #EA7A38);
  border: 1px solid var(--primary-color-border);
  font-size: 0.78rem;
  transition: all 0.18s ease;
}

.btn-template-action:hover,
.btn-template-active {
  background-color: var(--primary-color, #EA7A38) !important;
  color: #ffffff !important;
  border-color: var(--primary-color, #EA7A38) !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
