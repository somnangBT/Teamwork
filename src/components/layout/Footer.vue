<template>
  <footer class="salon-footer border-top mt-auto">
    <div class="app-container py-5">
      <div class="row g-4">
        <!-- Brand & Newsletter -->
        <div class="col-12 col-lg-4">
          <router-link to="/" class="d-inline-flex align-items-center text-decoration-none mb-3">
            <span class="fw-bolder fs-4 footer-brand-name">Tiki Tiki</span>
          </router-link>
          <p class="text-muted small mb-4" style="max-width: 340px; line-height: 1.6;">
            {{ t('footer.tagline') }}
          </p>

          <form @submit.prevent="subscribeNewsletter" class="newsletter-box p-3 rounded-4 border">
            <label for="footer-newsletter-email" class="fw-semibold small d-block mb-1 footer-heading">
              {{ t('footer.newsletterTitle') }}
            </label>
            <p class="text-muted mb-2" style="font-size: 0.78rem;">
              {{ t('footer.newsletterDesc') }}
            </p>
            <div class="d-flex gap-2">
              <input
                id="footer-newsletter-email"
                v-model="newsletterEmail"
                type="email"
                required
                autocomplete="email"
                placeholder="you@example.com"
                class="form-control form-control-sm rounded-3"
              />
              <button type="submit" class="btn-tnak-primary btn-sm px-3 text-nowrap">
                {{ t('footer.subscribe') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Explore -->
        <div class="col-6 col-md-4 col-lg-2 offset-lg-1">
          <h6 class="fw-bold mb-3 footer-heading">{{ t('footer.explore') }}</h6>
          <ul class="list-unstyled d-flex flex-column gap-2 small">
            <li><router-link to="/" class="footer-link">{{ t('nav.home') }}</router-link></li>
            <li><router-link to="/services" class="footer-link">{{ t('nav.services') }}</router-link></li>
            <li><router-link to="/products" class="footer-link">{{ t('nav.products') }}</router-link></li>
            <li><router-link to="/booking" class="footer-link">{{ t('nav.bookings') }}</router-link></li>
            <li><router-link to="/cart" class="footer-link">{{ t('nav.cart') }}</router-link></li>
          </ul>
        </div>

        <!-- Customer Care -->
        <div class="col-6 col-md-4 col-lg-2">
          <h6 class="fw-bold mb-3 footer-heading">{{ t('footer.customerCare') }}</h6>
          <ul class="list-unstyled d-flex flex-column gap-2 small">
            <li><router-link to="/profile#account" class="footer-link">{{ t('profile.account') }}</router-link></li>
            <li><router-link to="/profile#pets" class="footer-link">{{ t('profile.pets') }}</router-link></li>
            <li><router-link to="/profile#orders" class="footer-link">{{ t('profile.orders') }}</router-link></li>
            <li><router-link to="/profile#vouchers" class="footer-link">{{ t('profile.vouchers') }}</router-link></li>
            <li><router-link to="/profile#support" class="footer-link">{{ t('profile.support') }}</router-link></li>
          </ul>
        </div>

        <!-- Salon Info -->
        <div class="col-12 col-md-4 col-lg-3">
          <h6 class="fw-bold mb-3 footer-heading">{{ t('footer.visitUs') }}</h6>
          <ul class="list-unstyled d-flex flex-column gap-2 small text-muted mb-3">
            <li class="d-flex align-items-start gap-2">
              <MapPin :size="15" class="text-primary mt-1 flex-shrink-0" />
              <span>42 Orchid Blossom Ave, BKK1, Phnom Penh</span>
            </li>
            <li class="d-flex align-items-center gap-2">
              <Clock :size="15" class="text-primary flex-shrink-0" />
              <span>Daily: 08:30 AM – 08:00 PM</span>
            </li>
            <li class="d-flex align-items-center gap-2">
              <Phone :size="15" class="text-primary flex-shrink-0" />
              <span>+855 23 998 412</span>
            </li>
          </ul>

          <router-link to="/admin/dashboard" class="footer-admin-pill d-inline-flex align-items-center gap-2 text-decoration-none small fw-semibold">
            <ShieldCheck :size="14" />
            <span>{{ t('nav.adminPortal') }}</span>
          </router-link>
        </div>
      </div>

      <div class="border-top mt-4 pt-4 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 small text-muted">
        <span>© {{ new Date().getFullYear() }} Tiki Tiki Beauty Salon &amp; Care. {{ t('footer.rights') }}</span>
        <div class="d-flex align-items-center gap-3">
          <span>Promo codes: <code class="px-2 py-0.5 rounded bg-light text-primary fw-semibold">TIKI10</code> <code class="px-2 py-0.5 rounded bg-light text-primary fw-semibold">GLOW15</code></span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { MapPin, Clock, Phone, ShieldCheck } from '@lucide/vue'
import { useI18n } from '../../composables/useI18n'
import { useToastStore } from '../../stores/toast'

const { t } = useI18n()
const toastStore = useToastStore()
const newsletterEmail = ref('')

const subscribeNewsletter = () => {
  if (!newsletterEmail.value.trim()) return
  toastStore.showToast(`Subscribed ${newsletterEmail.value}! Use code TIKI10 for $10 off.`, 'success')
  newsletterEmail.value = ''
}
</script>

<style scoped>
.salon-footer {
  background-color: var(--storefront-surface, #ffffff);
  border-color: var(--border-clr, rgba(15, 23, 42, 0.08)) !important;
}

.footer-brand-name,
.footer-heading {
  color: var(--text-heading-color, #0f172a);
}

.newsletter-box {
  background-color: var(--surface-ground, #f8fafc);
  border-color: var(--border-clr, rgba(15, 23, 42, 0.08)) !important;
}

.footer-link {
  color: var(--secondary-color, #64748b);
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-link:hover {
  color: var(--primary-color, #EA7A38);
}

.footer-admin-pill {
  padding: 6px 14px;
  border-radius: 9999px;
  background: var(--primary-color-soft, rgba(234, 122, 56, 0.12));
  color: var(--primary-color, #EA7A38);
}

.footer-admin-pill:hover {
  opacity: 0.85;
}
</style>
