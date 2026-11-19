<template>
  <section id="services" class="services-showcase py-5">
    <div class="container">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4 mb-lg-5">
        <div>
          <span class="badge-tag-pill d-inline-block mb-2">{{ t('home.servicesBadge') }}</span>
          <h2 class="display-6 fw-bold mb-2 section-heading">{{ t('home.servicesTitle') }}</h2>
          <p class="text-muted mb-0" style="max-width: 600px;">
            {{ t('home.servicesSubtitle') }}
          </p>
        </div>
        <div>
          <router-link to="/services" class="awwwards-pill text-decoration-none">
            <span>{{ t('home.viewAllServices') }}</span>
            <span>→</span>
          </router-link>
        </div>
      </div>

      <div class="row g-4">
        <div
          v-for="service in allServices.slice(0, 4)"
          :key="service.id"
          class="col-12 col-sm-6 col-lg-3"
        >
          <article class="service-showcase-card h-100 rounded-4 border p-3 d-flex flex-column">
            <div class="service-img-wrap rounded-3 overflow-hidden mb-3 position-relative">
              <img :src="service.image" :alt="service.title" class="w-100 h-100 object-fit-cover d-block" loading="lazy" />
              <span class="service-cat-badge position-absolute top-0 start-0 m-2 rounded-pill px-2 py-1 fw-semibold">
                {{ service.icon }} {{ service.category }}
              </span>
              <span v-if="service.badge" class="service-hot-badge position-absolute top-0 end-0 m-2 rounded-pill px-2 py-1 fw-bold">
                {{ service.badge }}
              </span>
            </div>

            <div class="flex-grow-1">
              <h3 class="h6 fw-bold mb-2 service-card-title">{{ service.title }}</h3>
              <p class="text-muted small mb-3" style="line-height: 1.5;">
                {{ service.description }}
              </p>

              <ul v-if="service.highlights?.length" class="list-unstyled d-flex flex-wrap gap-1 mb-3">
                <li
                  v-for="hl in service.highlights.slice(0, 3)"
                  :key="hl"
                  class="highlight-chip rounded-pill px-2 py-0.5"
                >
                  ✓ {{ hl }}
                </li>
              </ul>
            </div>

            <div class="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
              <div>
                <span class="fw-bolder fs-5 text-primary">${{ service.price }}</span>
                <span class="text-muted small ms-1">· {{ service.duration }}</span>
              </div>
              <router-link
                :to="{ path: '/booking', query: { service: service.id } }"
                class="btn-tnak-primary text-decoration-none py-1 px-3 small"
              >
                {{ t('home.bookService') }}
              </router-link>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useServices } from '../../../../composables/useServices'
import { useI18n } from '../../../../composables/useI18n'

const { allServices } = useServices()
const { t } = useI18n()
</script>

<style scoped>
.services-showcase {
  background-color: color-mix(in srgb, var(--storefront-bg, #FAF8F5) 78%, transparent);
}

.section-heading {
  color: var(--text-heading-color, #0f172a);
}

.badge-tag-pill {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.28rem 0.75rem;
  border-radius: 9999px;
  background: var(--primary-color-soft, rgba(234, 122, 56, 0.12));
  color: var(--primary-color, #EA7A38);
}

.service-showcase-card {
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0) !important;
  box-shadow: none !important;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.service-showcase-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color, #EA7A38) !important;
}

.service-img-wrap {
  inline-size: 100%;
  aspect-ratio: 16 / 10;
  flex-shrink: 0;
  border: 1px solid var(--border-clr, #e2e8f0);
}

.service-cat-badge {
  background: var(--storefront-surface, #ffffff);
  color: var(--text-heading-color, #0f172a);
  border: 1px solid var(--border-clr, #e2e8f0);
  font-size: 0.7rem;
}

.service-hot-badge {
  background: var(--primary-color, #EA7A38);
  color: #ffffff;
  font-size: 0.65rem;
}

.service-card-title {
  color: var(--text-heading-color, #0f172a);
}

.highlight-chip {
  font-size: 0.7rem;
  background: var(--surface-ground, #f1f5f9);
  border: 1px solid var(--border-clr, #e2e8f0);
  color: var(--text-base, #334155);
}
</style>
