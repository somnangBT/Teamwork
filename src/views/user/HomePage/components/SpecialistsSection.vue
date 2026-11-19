<template>
  <section id="specialists" class="specialists-section py-5">
    <div class="container">
      <!-- Trust Pillars -->
      <div class="row g-3 mb-5">
        <div v-for="pillar in trustPillars" :key="pillar.title" class="col-12 col-md-4">
          <div class="trust-card rounded-4 border p-4 h-100 d-flex align-items-start gap-3">
            <div class="trust-icon-box rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
              <component :is="pillar.icon" :size="20" />
            </div>
            <div>
              <h3 class="h6 fw-bold mb-1 trust-title">{{ pillar.title }}</h3>
              <p class="text-muted small mb-0" style="line-height: 1.5;">{{ pillar.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Specialists Header -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <span class="badge-tag-pill d-inline-block mb-2">{{ t('home.specialistsBadge') }}</span>
          <h2 class="display-6 fw-bold mb-2 section-heading">{{ t('home.specialistsTitle') }}</h2>
          <p class="text-muted mb-0" style="max-width: 580px;">
            {{ t('home.specialistsSubtitle') }}
          </p>
        </div>
      </div>

      <!-- Specialists Grid -->
      <div class="row g-4">
        <div
          v-for="spec in namedSpecialists"
          :key="spec.id"
          class="col-12 col-sm-6 col-lg-3"
        >
          <article class="specialist-card rounded-4 border p-3 h-100 d-flex flex-column">
            <div class="d-flex align-items-center gap-3 mb-3">
              <img
                :src="spec.avatar"
                :alt="spec.name"
                class="rounded-circle object-fit-cover border flex-shrink-0"
                style="width: 60px; height: 60px;"
                loading="lazy"
              />
              <div class="min-w-0">
                <span class="badge-role-pill d-inline-block mb-1">{{ spec.badge }}</span>
                <h3 class="h6 fw-bold mb-0 text-truncate spec-name">{{ spec.name }}</h3>
                <div class="small text-muted d-flex align-items-center gap-1">
                  <Star :size="13" class="text-warning" fill="currentColor" />
                  <span class="fw-semibold">{{ spec.rating }}</span>
                  <span>· {{ spec.experience }}</span>
                </div>
              </div>
            </div>

            <p class="text-muted small mb-3 flex-grow-1">{{ spec.role }}</p>

            <div v-if="spec.specialties?.length" class="d-flex flex-wrap gap-1 mb-3">
              <span
                v-for="tag in spec.specialties"
                :key="tag"
                class="spec-tag rounded-pill px-2 py-0.5"
              >
                {{ tag }}
              </span>
            </div>

            <router-link
              :to="{ path: '/booking', query: { specialist: spec.id } }"
              class="btn-tnak-outline text-decoration-none text-center w-100 py-2 small"
            >
              {{ t('home.bookWith') }} {{ spec.name.split(' ')[0] }}
            </router-link>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { Star, ShieldCheck, Leaf, HeartHandshake } from '@lucide/vue'
import { useBooking } from '../../../../composables/useBooking'
import { useI18n } from '../../../../composables/useI18n'

const { specialists } = useBooking()
const { t } = useI18n()

const namedSpecialists = computed(() => specialists.value.filter(s => s.id !== 'any'))

const trustPillars = [
  {
    icon: Leaf,
    title: '100% Botanical Formulas',
    desc: 'Sulfate-free rosemary, argan, rosewater, and camellia complexes gentle on delicate hair and skin.'
  },
  {
    icon: ShieldCheck,
    title: 'Hospital-Grade Hygiene',
    desc: 'UV-sterilized styling tools, fresh spa linens, and serene sanitized suites between every guest.'
  },
  {
    icon: HeartHandshake,
    title: 'Tailored Private Suites',
    desc: 'One-on-one unhurried beauty rituals so every woman leaves feeling relaxed, confident, and radiant.'
  }
]
</script>

<style scoped>
.specialists-section {
  background-color: color-mix(in srgb, var(--color-bg) 76%, transparent);
}

.section-heading,
.trust-title,
.spec-name {
  color: var(--text-heading-color, #0f172a);
}

.trust-card,
.specialist-card {
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0) !important;
  box-shadow: none !important;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.trust-card:hover,
.specialist-card:hover {
  border-color: var(--primary-color, #EA7A38) !important;
  transform: translateY(-2px);
}

.trust-icon-box {
  width: 44px;
  height: 44px;
  background: var(--primary-color-soft);
  border: 1px solid var(--primary-color-border);
  color: var(--primary-color, #EA7A38);
}

.badge-tag-pill {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.28rem 0.75rem;
  border-radius: 9999px;
  background: var(--primary-color-soft);
  border: 1px solid var(--primary-color-border);
  color: var(--primary-color, #EA7A38);
}

.badge-role-pill {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--primary-color-soft);
  border: 1px solid var(--primary-color-border);
  color: var(--primary-color, #EA7A38);
}

.spec-tag {
  font-size: 0.72rem;
  background: var(--surface-ground, #f1f5f9);
  border: 1px solid var(--border-clr, #e2e8f0);
  color: var(--text-base, #334155);
}
</style>
