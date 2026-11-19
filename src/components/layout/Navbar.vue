<template>
  <header>
    <nav
      aria-label="Primary"
      class="navbar-top-bar d-flex align-items-center justify-content-between gap-2 gap-md-3 px-3 px-md-4 py-2"
    >
      <!-- Left: Mobile Menu Button + Logo -->
      <div class="d-flex align-items-center gap-2 flex-shrink-0">
        <button
          ref="mobileMenuBtnRef"
          type="button"
          class="btn-action-circle rounded-circle d-flex d-md-none align-items-center justify-content-center border-0"
          :aria-label="t('nav.menu')"
          :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
          aria-controls="mobile-nav-drawer"
          @click="openMobileDrawer"
        >
          <Menu :size="18" />
        </button>

        <router-link to="/" class="brand-logo d-flex align-items-center text-decoration-none">
          <span class="brand-name fw-bolder">Tiki Tiki</span>
        </router-link>
      </div>

      <!-- Center: Desktop Navigation Links -->
      <div class="d-none d-md-flex align-items-center gap-1 gap-lg-2 nav-menu-links">
        <router-link
          v-for="item in navMenuItems"
          :key="item.to"
          :to="item.to"
          class="nav-link-item text-decoration-none rounded-pill"
          :class="{ active: isItemActive(item) }"
        >
          {{ item.label }}
        </router-link>
      </div>

      <!-- Right: Book Now CTA + Cart + Profile Dropdown -->
      <div class="d-flex align-items-center gap-2 flex-shrink-0">
        <router-link
          to="/booking"
          class="btn-book-nav d-inline-flex align-items-center justify-content-center gap-2 rounded-pill text-decoration-none fw-semibold"
        >
          <Sparkles :size="14" aria-hidden="true" />
          <span class="d-none d-sm-inline">{{ t('nav.bookNow') }}</span>
          <span class="d-sm-none">{{ t('nav.bookShort') }}</span>
        </router-link>

        <!-- Shopping Cart -->
        <router-link
          to="/cart"
          class="btn-action-circle rounded-circle d-flex align-items-center justify-content-center text-decoration-none position-relative"
          :class="{ active: route.path === '/cart' }"
          :aria-label="`${t('nav.cart')} (${totalQuantity})`"
        >
          <ShoppingBag :size="17" />
          <span class="appointments-badge-count" v-if="totalQuantity > 0">{{ totalQuantity }}</span>
        </router-link>

        <!-- Profile & Account Dropdown -->
        <div class="position-relative" ref="profileDropdownRef">
          <button
            type="button"
            class="btn-action-circle btn-profile-avatar rounded-circle d-flex align-items-center justify-content-center p-0 position-relative"
            :class="{
              active: route.path === '/profile' || isProfileDropdownOpen,
              'has-avatar': hasAvatarImage
            }"
            :aria-expanded="isProfileDropdownOpen ? 'true' : 'false'"
            aria-label="Profile & Account Menu"
            @click.stop="isProfileDropdownOpen = !isProfileDropdownOpen"
          >
            <span
              v-if="hasAvatarImage"
              class="profile-avatar-frame w-100 h-100 rounded-circle d-block"
            >
              <img
                :src="account.avatar"
                :alt="account.name"
                class="profile-avatar-img w-100 h-100 d-block"
                @error="avatarLoadError = true"
              />
            </span>
            <User v-else :size="17" />
            <span class="appointments-badge-count" v-if="activeBookingsCount > 0">{{ activeBookingsCount }}</span>
          </button>

          <!-- Profile Dropdown Card -->
          <div
            v-if="isProfileDropdownOpen"
            class="profile-dropdown-menu position-absolute end-0 mt-2 rounded-4 p-2 z-1060 animate-scale-down"
          >
            <!-- 1. Profile Header -->
            <router-link
              to="/profile"
              class="d-flex align-items-center gap-3 p-2 rounded-3 text-decoration-none user-header-hover mb-1"
              @click="isProfileDropdownOpen = false"
            >
              <div class="position-relative flex-shrink-0">
                <img
                  v-if="hasAvatarImage"
                  :src="account.avatar"
                  :alt="account.name"
                  class="dropdown-header-avatar rounded-circle object-fit-cover border d-block"
                  @error="avatarLoadError = true"
                />
                <span
                  v-else
                  class="dropdown-header-avatar rounded-circle border d-flex align-items-center justify-content-center bg-orange-soft text-orange"
                >
                  <User :size="18" />
                </span>
                <span class="badge-mini-gold position-absolute bottom-0 end-0 rounded-circle text-white d-flex align-items-center justify-content-center">★</span>
              </div>
              <div class="overflow-hidden">
                <div class="d-flex align-items-center gap-1">
                  <strong class="dropdown-user-name fs-6 text-truncate d-block">{{ account.name }}</strong>
                  <span class="badge bg-orange-soft text-orange fw-bold" style="font-size: 0.65rem;">{{ account.tier || 'VIP' }}</span>
                </div>
                <span class="text-muted small text-truncate d-block" style="font-size: 0.76rem;">{{ t('nav.profile') }}</span>
              </div>
            </router-link>

            <hr class="my-1 opacity-10" />

            <!-- 2. Language Selector -->
            <div class="px-2 py-1">
              <div class="d-flex align-items-center justify-content-between mb-1">
                <span class="small fw-semibold text-muted d-flex align-items-center gap-1">
                  <Globe :size="14" />
                  <span>{{ t('nav.language') }}</span>
                </span>
                <span class="small text-muted fw-medium" style="font-size: 0.75rem;">
                  {{ currentLang === 'en' ? 'English' : 'ភាសាខ្មែរ' }}
                </span>
              </div>
              <div class="d-flex gap-1 bg-toggle-wrap p-1 rounded-3">
                <button
                  type="button"
                  class="btn-toggle-option flex-grow-1 py-1 rounded-2 small fw-semibold border-0"
                  :class="{ active: currentLang === 'en' }"
                  @click="setLanguage('en')"
                >
                  🇺🇸 EN
                </button>
                <button
                  type="button"
                  class="btn-toggle-option flex-grow-1 py-1 rounded-2 small fw-semibold border-0"
                  :class="{ active: currentLang === 'kh' }"
                  @click="setLanguage('kh')"
                >
                  🇰🇭 KH
                </button>
              </div>
            </div>

            <!-- 3. Light / Dark Mode Switcher -->
            <div class="px-2 py-1">
              <div class="d-flex align-items-center justify-content-between mb-1">
                <span class="small fw-semibold text-muted d-flex align-items-center gap-1">
                  <Sun v-if="!isDarkMode" :size="14" />
                  <Moon v-else :size="14" />
                  <span>{{ t('nav.theme') }}</span>
                </span>
                <span class="small text-muted fw-medium" style="font-size: 0.75rem;">
                  {{ isDarkMode ? t('nav.darkMode') : t('nav.lightMode') }}
                </span>
              </div>
              <div class="d-flex gap-1 bg-toggle-wrap p-1 rounded-3">
                <button
                  type="button"
                  class="btn-toggle-option flex-grow-1 py-1 rounded-2 small fw-semibold border-0 d-flex align-items-center justify-content-center gap-1"
                  :class="{ active: !isDarkMode }"
                  @click="toggleTheme('light')"
                >
                  <Sun :size="13" />
                  <span>{{ t('nav.light') }}</span>
                </button>
                <button
                  type="button"
                  class="btn-toggle-option flex-grow-1 py-1 rounded-2 small fw-semibold border-0 d-flex align-items-center justify-content-center gap-1"
                  :class="{ active: isDarkMode }"
                  @click="toggleTheme('dark')"
                >
                  <Moon :size="13" />
                  <span>{{ t('nav.dark') }}</span>
                </button>
              </div>
            </div>

            <hr class="my-1 opacity-10" />

            <!-- 4. Quick Links: My Bookings, Admin Portal & Sign In -->
            <router-link
              to="/booking"
              class="profile-menu-item d-flex align-items-center justify-content-between p-2 rounded-3 text-decoration-none small"
              @click="isProfileDropdownOpen = false"
            >
              <div class="d-flex align-items-center gap-2">
                <CalendarCheck :size="15" class="text-orange" />
                <span class="fw-semibold">{{ t('nav.bookings') }}</span>
              </div>
              <span v-if="activeBookingsCount > 0" class="badge bg-orange-soft text-orange rounded-pill px-2">
                {{ activeBookingsCount }}
              </span>
            </router-link>

            <router-link
              to="/admin/dashboard"
              class="profile-menu-item d-flex align-items-center justify-content-between p-2 rounded-3 text-decoration-none small"
              @click="isProfileDropdownOpen = false"
            >
              <div class="d-flex align-items-center gap-2">
                <ShieldCheck :size="15" class="text-orange" />
                <span class="fw-semibold">{{ t('nav.adminPortal') }}</span>
              </div>
              <span class="badge bg-orange text-white rounded-pill px-2 py-0.5" style="font-size: 0.65rem;">Pro</span>
            </router-link>

            <router-link
              to="/login"
              class="profile-menu-item d-flex align-items-center gap-2 p-2 rounded-3 text-decoration-none small"
              @click="isProfileDropdownOpen = false"
            >
              <LogIn :size="15" class="text-muted" />
              <span class="fw-medium">{{ t('nav.signIn') }}</span>
            </router-link>

            <hr class="my-1 opacity-10" />

            <!-- 5. Log out -->
            <button
              type="button"
              class="profile-menu-item logout-btn d-flex align-items-center gap-2 p-2 rounded-3 text-danger small w-100 border-0 bg-transparent"
              @click="openLogoutConfirm"
            >
              <LogOut :size="15" />
              <span class="fw-medium">{{ t('nav.logout') }}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Native Modal <dialog> Mobile Navigation Drawer (Accessible, Escape/Light-dismiss) -->
    <dialog
      id="mobile-nav-drawer"
      ref="mobileDrawerRef"
      class="mobile-drawer"
      aria-label="Mobile Navigation"
      @click="onDrawerBackdropClick"
      @close="onDrawerClosed"
    >
      <div class="mobile-drawer-sheet d-flex flex-column justify-content-between p-4" @click.stop>
        <div>
          <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
            <router-link
              to="/"
              class="brand-logo d-flex align-items-center text-decoration-none"
              @click="closeMobileDrawer"
            >
              <span class="brand-name fw-bolder fs-5">Tiki Tiki</span>
            </router-link>

            <button
              type="button"
              class="btn-close-drawer border-0 rounded-circle d-flex align-items-center justify-content-center"
              aria-label="Close menu"
              autofocus
              @click="closeMobileDrawer"
            >
              <X :size="18" />
            </button>
          </div>

          <ul class="list-unstyled d-flex flex-column gap-1 mb-4">
            <li v-for="item in mobileMenuItems" :key="item.to">
              <router-link
                :to="item.to"
                class="mobile-nav-link d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 text-decoration-none fw-semibold"
                :class="{ active: isItemActive(item) }"
                @click="closeMobileDrawer"
              >
                <span class="d-flex align-items-center gap-2">
                  <component :is="item.icon" :size="17" />
                  <span>{{ item.label }}</span>
                </span>
                <span v-if="item.badge" class="badge bg-orange text-white rounded-pill">{{ item.badge }}</span>
              </router-link>
            </li>
          </ul>

          <div class="d-flex flex-column gap-2 pt-3 border-top">
            <div class="d-flex align-items-center justify-content-between">
              <span class="small fw-semibold text-muted">{{ t('nav.language') }}</span>
              <div class="d-flex gap-1 bg-toggle-wrap p-1 rounded-3">
                <button
                  type="button"
                  class="btn-toggle-option px-2 py-1 rounded-2 small fw-semibold border-0"
                  :class="{ active: currentLang === 'en' }"
                  @click="setLanguage('en')"
                >
                  EN
                </button>
                <button
                  type="button"
                  class="btn-toggle-option px-2 py-1 rounded-2 small fw-semibold border-0"
                  :class="{ active: currentLang === 'kh' }"
                  @click="setLanguage('kh')"
                >
                  KH
                </button>
              </div>
            </div>

            <div class="d-flex align-items-center justify-content-between">
              <span class="small fw-semibold text-muted">{{ t('nav.theme') }}</span>
              <div class="d-flex gap-1 bg-toggle-wrap p-1 rounded-3">
                <button
                  type="button"
                  class="btn-toggle-option px-2 py-1 rounded-2 small fw-semibold border-0"
                  :class="{ active: !isDarkMode }"
                  @click="toggleTheme('light')"
                >
                  {{ t('nav.light') }}
                </button>
                <button
                  type="button"
                  class="btn-toggle-option px-2 py-1 rounded-2 small fw-semibold border-0"
                  :class="{ active: isDarkMode }"
                  @click="toggleTheme('dark')"
                >
                  {{ t('nav.dark') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-3 border-top d-flex flex-column gap-2">
          <router-link
            to="/admin/dashboard"
            class="btn-tnak-outline text-center text-decoration-none d-flex align-items-center justify-content-center gap-2"
            @click="closeMobileDrawer"
          >
            <ShieldCheck :size="16" />
            <span>{{ t('nav.adminPortal') }}</span>
          </router-link>
          <router-link
            to="/login"
            class="btn-tnak-primary text-center text-decoration-none d-flex align-items-center justify-content-center gap-2"
            @click="closeMobileDrawer"
          >
            <LogIn :size="16" />
            <span>{{ t('nav.signIn') }}</span>
          </router-link>
        </div>
      </div>
    </dialog>

    <!-- Logout Confirmation Modal -->
    <BaseModal v-model="showLogoutModal" title="Confirm Logout" size="sm">
      <p class="mb-0 text-muted small">Are you sure you want to log out of your customer session?</p>
      <template #footer>
        <BaseButton variant="outline-secondary" class="flex-grow-1" @click="showLogoutModal = false">
          Cancel
        </BaseButton>
        <BaseButton variant="danger" class="flex-grow-1" @click="confirmLogout">
          Log out
        </BaseButton>
      </template>
    </BaseModal>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Menu, X, Sparkles, ShoppingBag, User, Globe, Sun, Moon,
  CalendarCheck, ShieldCheck, LogIn, LogOut, Home, Package, Scissors
} from '@lucide/vue'
import { useBooking } from '../../composables/useBooking'
import { useTheme } from '../../composables/useTheme'
import { useCart } from '../../composables/useCart'
import { useProfile } from '../../composables/useProfile'
import { useI18n } from '../../composables/useI18n'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'

const route = useRoute()
const router = useRouter()
const { activeBookingsCount } = useBooking()
const { isDarkMode, toggleTheme } = useTheme()
const { totalQuantity } = useCart()
const { account } = useProfile()
const { currentLang, setLanguage, t } = useI18n()
const authStore = useAuthStore()
const toastStore = useToastStore()

const isProfileDropdownOpen = ref(false)
const profileDropdownRef = ref(null)
const avatarLoadError = ref(false)
const hasAvatarImage = computed(() => Boolean(account.value?.avatar && !avatarLoadError.value))

watch(
  () => account.value?.avatar,
  () => {
    avatarLoadError.value = false
  }
)
const isMobileMenuOpen = ref(false)
const mobileDrawerRef = ref(null)
const mobileMenuBtnRef = ref(null)
const showLogoutModal = ref(false)

const navMenuItems = computed(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.products'), to: '/products' },
  { label: t('nav.services'), to: '/services' },
  { label: t('nav.bookings'), to: '/booking' }
])

const mobileMenuItems = computed(() => [
  { label: t('nav.home'), to: '/', icon: Home },
  { label: t('nav.products'), to: '/products', icon: Package },
  { label: t('nav.services'), to: '/services', icon: Scissors },
  { label: t('nav.bookings'), to: '/booking', icon: CalendarCheck, badge: activeBookingsCount.value || null },
  { label: t('nav.cart'), to: '/cart', icon: ShoppingBag, badge: totalQuantity.value || null },
  { label: t('profile.title'), to: '/profile', icon: User }
])

const isItemActive = (item) => {
  if (item.to === '/') {
    return route.path === '/' && !route.hash
  }
  return route.path === item.to || route.path.startsWith(item.to + '/')
}

const openMobileDrawer = () => {
  isMobileMenuOpen.value = true
  mobileDrawerRef.value?.showModal()
}

const closeMobileDrawer = () => {
  mobileDrawerRef.value?.close()
}

const onDrawerClosed = () => {
  isMobileMenuOpen.value = false
}

const onDrawerBackdropClick = (event) => {
  if (event.target === mobileDrawerRef.value) {
    closeMobileDrawer()
  }
}

const openLogoutConfirm = () => {
  isProfileDropdownOpen.value = false
  showLogoutModal.value = true
}

const confirmLogout = async () => {
  showLogoutModal.value = false
  await authStore.logout(false)
  toastStore.showToast('Signed out successfully.', 'info')
  router.push('/login')
}

const handleClickOutside = (event) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    isProfileDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar-top-bar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 1248px;
  z-index: 1050;
  background: color-mix(in srgb, var(--storefront-surface, #ffffff) 88%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-left: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  border-right: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  border-bottom: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  border-top: none;
  border-radius: 0 0 18px 18px;
  min-height: 58px;
  box-shadow: none !important;
  transition: background 0.2s ease, border-color 0.2s ease;
}

[data-theme="dark"] .navbar-top-bar {
  background: color-mix(in srgb, var(--storefront-surface, #131c31) 90%, transparent);
  border-color: var(--border-clr);
  box-shadow: none !important;
}

@media (max-width: 576px) {
  .navbar-top-bar {
    width: 100%;
    left: 0;
    transform: none;
    border-left: none;
    border-right: none;
    border-radius: 0 0 14px 14px;
  }
}

.brand-name {
  font-size: 1.35rem;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--text-heading-color, #0f172a);
}

.btn-book-nav {
  height: 36px;
  background-color: var(--primary-color, #EA7A38);
  border: var(--border-width, 1.5px) solid var(--primary-color, #EA7A38);
  color: #ffffff;
  font-size: 0.82rem;
  padding: 0 14px;
  box-shadow: none !important;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;
}

.btn-book-nav:hover {
  background-color: var(--primary-color-dark, #D46222);
  border-color: var(--primary-color-dark, #D46222);
  color: #ffffff;
}

.nav-link-item {
  color: var(--text-base, #334155);
  font-size: 0.84rem;
  font-weight: 500;
  padding: 0.38rem 0.95rem;
  border: var(--border-width, 1.5px) solid transparent;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.nav-link-item:hover {
  color: var(--text-heading-color, #0f172a);
  background-color: var(--surface-ground, #f1f5f9);
  border-color: var(--border-clr, #e2e8f0);
}

.nav-link-item.active {
  background-color: var(--primary-color-soft);
  color: var(--primary-color, #EA7A38);
  font-weight: 600;
  border: var(--border-width, 1.5px) solid var(--primary-color-border);
}

.btn-action-circle {
  width: 36px;
  height: 36px;
  padding: 0;
  flex-shrink: 0;
  background: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  color: var(--primary-color, #EA7A38);
  transition: border-color 0.18s ease, background-color 0.18s ease;
  cursor: pointer;
  box-shadow: none !important;
}

.btn-action-circle:hover {
  border-color: var(--primary-color, #EA7A38);
  background-color: var(--primary-color-soft);
}

.btn-action-circle.active {
  border-color: var(--primary-color, #EA7A38);
  background-color: var(--primary-color-soft);
  box-shadow: none !important;
}

.btn-profile-avatar.has-avatar,
.btn-profile-avatar.has-avatar:hover,
.btn-profile-avatar.has-avatar.active {
  background-color: transparent;
}

.profile-avatar-frame {
  overflow: hidden;
  overflow: clip;
}

.profile-avatar-img {
  object-fit: cover;
  object-position: center 20%;
}

.dropdown-header-avatar {
  width: 42px;
  height: 42px;
  object-position: center 20%;
}

.appointments-badge-count {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background-color: var(--primary-color, #EA7A38);
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--storefront-surface, #ffffff);
  padding: 0 4px;
}

.profile-dropdown-menu {
  width: 280px;
  top: calc(100% + 10px);
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0) !important;
  color: var(--text-base, #334155);
  box-shadow: none !important;
}

.dropdown-user-name {
  color: var(--text-heading-color, #0f172a);
}

.user-header-hover {
  background-color: var(--surface-ground, #f1f5f9);
  border: 1px solid var(--border-clr, #e2e8f0);
  transition: border-color 0.18s ease, background-color 0.18s ease;
}

.user-header-hover:hover {
  background-color: var(--primary-color-soft);
  border-color: var(--primary-color-border);
}

.badge-mini-gold {
  width: 15px;
  height: 15px;
  background: var(--primary-color, #EA7A38);
  font-size: 0.55rem;
  line-height: 1;
  border: 1.5px solid var(--storefront-surface, #ffffff);
}

.bg-orange-soft {
  background-color: var(--primary-color-soft) !important;
}

.text-orange {
  color: var(--primary-color, #EA7A38) !important;
}

.bg-orange {
  background-color: var(--primary-color, #EA7A38) !important;
}

.profile-menu-item {
  color: var(--text-base, #334155);
  border: 1px solid transparent;
  transition: all 0.18s ease;
}

.profile-menu-item:hover {
  background-color: var(--surface-ground, #f1f5f9);
  border-color: var(--border-clr, #e2e8f0);
  color: var(--text-heading-color, #0f172a);
}

.bg-toggle-wrap {
  background-color: var(--surface-ground, #f1f5f9);
  border: 1px solid var(--border-clr, #e2e8f0);
}

.btn-toggle-option {
  background: transparent;
  color: var(--secondary-color, #64748b);
  font-size: 0.78rem;
  border: 1px solid transparent !important;
  transition: all 0.16s ease;
  cursor: pointer;
}

.btn-toggle-option.active {
  background-color: var(--storefront-surface, #ffffff);
  color: var(--primary-color, #EA7A38);
  border-color: var(--primary-color-border) !important;
  box-shadow: none !important;
}

.logout-btn:hover {
  background-color: rgba(239, 68, 68, 0.1) !important;
}

/* Native Modal Mobile Drawer */
.mobile-drawer {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  width: min(20rem, 85vw);
  max-width: 100vw;
  height: 100svh;
  max-height: 100svh;
}

.mobile-drawer::backdrop {
  background: rgba(15, 23, 42, 0.52);
  backdrop-filter: blur(4px);
}

.mobile-drawer-sheet {
  width: 100%;
  height: 100%;
  background: var(--body-bg-color, #ffffff);
  color: var(--text-base, #334155);
  overflow-y: auto;
}

.btn-close-drawer {
  width: 34px;
  height: 34px;
  background: var(--surface-ground, #f1f5f9);
  color: var(--text-heading-color, #0f172a);
}

.mobile-nav-link {
  color: var(--text-base, #334155);
  padding: 10px 14px;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  background: var(--primary-color-soft, rgba(234, 122, 56, 0.12));
  color: var(--primary-color, #EA7A38);
}

.animate-scale-down {
  animation: scaleDown 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top right;
}

@keyframes scaleDown {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(-6px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 480px) {
  .brand-name {
    font-size: 1.18rem;
  }
}
</style>
