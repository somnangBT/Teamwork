<template>
  <section class="testimonials-faq-section py-5">
    <div class="container">
      <!-- Testimonials -->
      <div class="text-center mb-4">
        <span class="badge-tag-pill d-inline-block mb-2">{{ t('home.testimonialsBadge') }}</span>
        <h2 class="display-6 fw-bold mb-0 section-heading">{{ t('home.testimonialsTitle') }}</h2>
      </div>

      <div class="row g-4 mb-5">
        <div v-for="review in reviews" :key="review.author" class="col-12 col-md-4">
          <div class="review-card rounded-4 border p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex align-items-center gap-1 text-warning mb-3" aria-label="5 out of 5 stars">
                <Star v-for="n in 5" :key="n" :size="15" fill="currentColor" />
              </div>
              <p class="small mb-4" style="line-height: 1.65;">"{{ review.quote }}"</p>
            </div>
            <div class="d-flex align-items-center gap-3 pt-2 border-top">
              <img :src="review.avatar" :alt="review.author" class="rounded-circle object-fit-cover" style="width: 40px; height: 40px;" loading="lazy" />
              <div>
                <div class="fw-bold small review-author">{{ review.author }}</div>
                <div class="text-muted" style="font-size: 0.75rem;">{{ review.pet }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ & CTA Split -->
      <div class="row g-4 align-items-stretch mb-5">
        <div class="col-12 col-lg-7 d-flex flex-column">
          <div class="mb-3">
            <span class="badge-tag-pill d-inline-block mb-2">FAQ</span>
            <h3 class="h4 fw-bold mb-1 section-heading">{{ t('home.faqTitle') }}</h3>
            <p class="text-muted small mb-0">{{ t('home.faqSubtitle') }}</p>
          </div>

          <div class="faq-stack d-flex flex-column gap-2 flex-grow-1 justify-content-between">
            <details
              v-for="(item, idx) in faqs"
              :key="item.q"
              class="faq-details rounded-4 border"
              name="salon-faq"
              :open="idx === 0"
            >
              <summary class="faq-summary d-flex align-items-center justify-content-between gap-3 p-3 px-md-4 fw-semibold">
                <span class="d-flex align-items-center gap-3">
                  <span class="faq-num-badge">{{ String(idx + 1).padStart(2, '0') }}</span>
                  <span class="faq-question-text">{{ item.q }}</span>
                </span>
                <ChevronDown :size="18" class="faq-chevron text-muted" aria-hidden="true" />
              </summary>
              <div class="faq-answer px-4 pb-3 pt-0 text-muted small">
                {{ item.a }}
              </div>
            </details>
          </div>
        </div>

        <div class="col-12 col-lg-5 d-flex">
          <article class="cta-showcase-card rounded-4 border overflow-hidden w-100 d-flex flex-column justify-content-between">
            <div class="cta-media-wrap position-relative">
              <img
                src="/images/salon_hero.jpg"
                alt="Tiki Tiki VIP Spa Suite"
                class="cta-studio-img w-100 d-block"
                loading="lazy"
              />
              <div class="cta-media-overlay" aria-hidden="true"></div>
              <span class="cta-floating-pill position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill fw-semibold">
                ✨ Tiki Tiki VIP Spa
              </span>
            </div>

            <div class="p-4 d-flex flex-column flex-grow-1 justify-content-between gap-3">
              <div>
                <h3 class="h4 fw-bold mb-2 section-heading">{{ t('home.ctaTitle') }}</h3>
                <p class="text-muted small mb-3" style="line-height: 1.6;">
                  {{ t('home.ctaDesc') }}
                </p>

                <ul class="list-unstyled d-flex flex-column gap-2 mb-0 cta-perks-list">
                  <li class="d-flex align-items-center gap-2 small">
                    <CheckCircle2 :size="15" class="text-primary flex-shrink-0" aria-hidden="true" />
                    <span>{{ t('home.ctaStat1') }}</span>
                  </li>
                  <li class="d-flex align-items-center gap-2 small">
                    <CheckCircle2 :size="15" class="text-primary flex-shrink-0" aria-hidden="true" />
                    <span>{{ t('home.ctaStat2') }}</span>
                  </li>
                  <li class="d-flex align-items-center gap-2 small">
                    <CheckCircle2 :size="15" class="text-primary flex-shrink-0" aria-hidden="true" />
                    <span>{{ t('home.ctaStat3') }}</span>
                  </li>
                </ul>
              </div>

              <div class="cta-actions-grid pt-2 border-top">
                <router-link
                  to="/booking"
                  class="btn-cta-solid rounded-pill px-3 py-2 fw-bold text-decoration-none text-center"
                >
                  {{ t('home.ctaPrimary') }}
                </router-link>
                <router-link
                  to="/products"
                  class="btn-cta-outline rounded-pill px-3 py-2 fw-semibold text-decoration-none text-center"
                >
                  {{ t('home.ctaSecondary') }}
                </router-link>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Studio Location & Interactive Map -->
      <article class="location-map-card rounded-4 border overflow-hidden">
        <div class="row g-0 align-items-stretch">
          <div class="col-12 col-lg-5 p-4 p-md-5 d-flex flex-column justify-content-between gap-4">
            <div>
              <span class="badge-tag-pill d-inline-block mb-2">{{ t('home.visitBadge') }}</span>
              <h3 class="h4 fw-bold mb-2 section-heading">{{ t('home.visitTitle') }}</h3>
              <p class="text-muted small mb-4" style="line-height: 1.6;">
                {{ t('home.visitDesc') }}
              </p>

              <div class="d-flex flex-column gap-3">
                <div class="studio-info-row d-flex align-items-start gap-3 p-3 rounded-3">
                  <span class="studio-info-icon rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0">
                    <MapPin :size="16" />
                  </span>
                  <div>
                    <div class="text-muted fw-semibold" style="font-size: 0.72rem;">{{ t('home.visitAddressLabel') }}</div>
                    <div class="fw-semibold small section-heading">{{ t('home.visitAddress') }}</div>
                  </div>
                </div>

                <div class="studio-info-row d-flex align-items-start gap-3 p-3 rounded-3">
                  <span class="studio-info-icon rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0">
                    <Clock :size="16" />
                  </span>
                  <div>
                    <div class="text-muted fw-semibold" style="font-size: 0.72rem;">{{ t('home.visitHoursLabel') }}</div>
                    <div class="fw-semibold small section-heading">{{ t('home.visitHours') }}</div>
                  </div>
                </div>

                <div class="studio-info-row d-flex align-items-start gap-3 p-3 rounded-3">
                  <span class="studio-info-icon rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0">
                    <Phone :size="16" />
                  </span>
                  <div>
                    <div class="text-muted fw-semibold" style="font-size: 0.72rem;">{{ t('home.visitPhoneLabel') }}</div>
                    <a href="tel:+85523998412" class="fw-semibold small section-heading text-decoration-none">
                      {{ t('home.visitPhone') }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=11.5525,104.9225"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-cta-solid rounded-pill px-4 py-2 fw-bold text-decoration-none d-inline-flex align-items-center gap-2"
              >
                <Navigation :size="15" />
                <span>{{ t('home.getDirections') }}</span>
              </a>
              <router-link
                to="/booking"
                class="btn-cta-outline rounded-pill px-4 py-2 fw-semibold text-decoration-none d-inline-flex align-items-center gap-2"
              >
                <Calendar :size="15" />
                <span>{{ t('home.ctaPrimary') }}</span>
              </router-link>
            </div>
          </div>

          <div class="col-12 col-lg-7 position-relative map-embed-col">
            <iframe
              src="https://maps.google.com/maps?q=BKK1%20Phnom%20Penh&t=&z=15&ie=UTF8&iwloc=&output=embed"
              title="Tiki Tiki Beauty Salon Map Location in BKK1, Phnom Penh"
              class="salon-map-iframe"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            ></iframe>
            <div class="map-pin-chip position-absolute bottom-0 start-0 m-3 px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2">
              <MapPin :size="14" class="text-primary flex-shrink-0" />
              <span class="small fw-semibold">42 Orchid Blossom Ave · BKK1</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { Star, ChevronDown, CheckCircle2, MapPin, Clock, Phone, Navigation, Calendar } from '@lucide/vue'
import { useI18n } from '../../../../composables/useI18n'

const { t } = useI18n()

const reviews = [
  {
    quote: 'Elena gave me the softest layered blowout I have ever had! My hair feels weightless, silky, and smells faintly like rosemary and argan.',
    author: 'Alisa Gitten',
    pet: 'Signature Haircut & Blowout',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
  },
  {
    quote: 'The Herbal Botanical Head Spa with Sophia melted away an entire week of stress. Love that I can download the .ics calendar invite and track visits online.',
    author: 'Nadia Sokha',
    pet: 'Botanical Head Spa & Steam',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80'
  },
  {
    quote: 'The Radiance Facial and Aurélia Argan Hair Oil combo is unbeatable. Ordering my shampoo and glow moisturizer alongside booking saves so much time.',
    author: 'Clara Oswald',
    pet: 'VIP Bridal & Royal Spa',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  }
]

const faqs = [
  {
    q: 'How early should I arrive for my salon appointment?',
    a: 'Please arrive 5–10 minutes before your scheduled slot so you can enjoy herbal tea and complete a quick hair & skin consultation with your stylist.'
  },
  {
    q: 'Are your haircare and facial products safe for sensitive skin?',
    a: 'Yes! We exclusively formulate with sulfate-free, paraben-free botanical extracts including rosemary, rosehip, hyaluronic acid, and cold-pressed argan oil.'
  },
  {
    q: 'Can I reschedule or cancel my appointment online?',
    a: 'Yes, visit My Bookings anytime to reschedule to another open slot, download your calendar invite, or cancel your booking.'
  },
  {
    q: 'Do you offer free delivery for salon beauty products?',
    a: 'Orders over $100 qualify for complimentary express delivery, or you can pick up your order free at our salon counter during your visit.'
  }
]
</script>

<style scoped>
.testimonials-faq-section {
  background-color: color-mix(in srgb, var(--storefront-bg, #FAF8F5) 82%, transparent);
}

.section-heading,
.review-author {
  color: var(--text-heading-color, #0f172a);
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

.review-card,
.faq-details,
.cta-showcase-card,
.location-map-card {
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0) !important;
  color: var(--text-base, #334155);
  box-shadow: none !important;
  transition: border-color 0.2s ease;
}

.review-card:hover,
.faq-details:hover,
.faq-details[open],
.cta-showcase-card:hover,
.location-map-card:hover {
  border-color: var(--primary-color-border, var(--primary-color)) !important;
}

.faq-details[open] {
  border-color: var(--primary-color, #EA7A38) !important;
}

.faq-summary {
  list-style: none;
  cursor: pointer;
  color: var(--text-heading-color, #0f172a);
  font-size: 0.94rem;
}

.faq-summary::-webkit-details-marker {
  display: none;
}

.faq-summary:focus-visible {
  outline: 2px solid var(--primary-color, #EA7A38);
  outline-offset: -2px;
  border-radius: inherit;
}

.faq-num-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
  background-color: var(--primary-color-soft);
  color: var(--primary-color, #EA7A38);
  border: 1px solid var(--primary-color-border);
}

.faq-answer {
  line-height: 1.65;
}

.faq-chevron {
  flex-shrink: 0;
}

.faq-details[open] .faq-chevron {
  transform: rotate(180deg);
  color: var(--primary-color, #EA7A38) !important;
}

@media (prefers-reduced-motion: no-preference) {
  .faq-chevron {
    transition: transform 0.25s ease, color 0.2s ease;
  }

  .faq-details::details-content {
    transition: opacity 0.25s ease;
  }
}

.cta-media-wrap {
  aspect-ratio: 16 / 8;
  overflow: hidden;
  border-bottom: 1px solid var(--border-clr, #e2e8f0);
}

.cta-studio-img {
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
}

.cta-media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.28) 0%, transparent 65%);
  pointer-events: none;
}

.cta-floating-pill {
  background-color: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  font-size: 0.75rem;
  backdrop-filter: blur(8px);
}

.cta-perks-list li {
  color: var(--text-base, #334155);
  font-weight: 500;
}

.cta-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

@media (max-width: 480px) {
  .cta-actions-grid {
    grid-template-columns: 1fr;
  }
}

.btn-cta-solid {
  background-color: var(--primary-color, #EA7A38);
  border: 1.5px solid var(--primary-color, #EA7A38);
  color: #ffffff;
  font-size: 0.84rem;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn-cta-solid:hover {
  background-color: var(--primary-color-dark, #D46222);
  border-color: var(--primary-color-dark, #D46222);
  color: #ffffff;
}

.btn-cta-outline {
  background-color: transparent;
  border: 1.5px solid var(--border-clr, #cbd5e1);
  color: var(--text-heading-color, #0f172a);
  font-size: 0.84rem;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
}

.btn-cta-outline:hover {
  border-color: var(--primary-color, #EA7A38);
  color: var(--primary-color, #EA7A38);
  background-color: var(--primary-color-soft);
}

.studio-info-row {
  background-color: var(--surface-ground, #f8fafc);
  border: 1px solid var(--border-clr, #e2e8f0);
}

.studio-info-icon {
  width: 34px;
  height: 34px;
  background-color: var(--primary-color-soft);
  color: var(--primary-color, #EA7A38);
  border: 1px solid var(--primary-color-border);
}

.map-embed-col {
  min-block-size: 340px;
  background-color: var(--surface-ground, #f1f5f9);
  border-left: 1px solid var(--border-clr, #e2e8f0);
}

@media (max-width: 991.98px) {
  .map-embed-col {
    border-left: 0;
    border-top: 1px solid var(--border-clr, #e2e8f0);
  }
}

.salon-map-iframe {
  display: block;
  width: 100%;
  height: 100%;
  min-block-size: 340px;
  border: 0;
}

.map-pin-chip {
  background-color: var(--storefront-surface, #ffffff);
  color: var(--text-heading-color, #0f172a);
  border: 1px solid var(--border-clr, #e2e8f0);
}

[data-theme="dark"] .salon-map-iframe {
  filter: invert(90%) hue-rotate(180deg) contrast(95%);
}
</style>
