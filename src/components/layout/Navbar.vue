<template>
  <div class="navbar-top-bar d-flex align-items-center justify-content-between gap-3 px-3 px-md-4 py-2">
    
    <!-- Left: Logo -->
    <div class="d-flex align-items-center flex-shrink-0">
      <!-- Logo -->
      <router-link to="/" class="brand-logo d-flex align-items-center gap-2 text-decoration-none">
        <div class="brand-icon">
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="22" r="12" fill="#EA7A38" />
            <circle cx="9" cy="11" r="5.5" fill="#EA7A38" />
            <circle cx="31" cy="11" r="5.5" fill="#EA7A38" />
            <circle cx="16" cy="20" r="2.2" fill="#fff" />
            <circle cx="24" cy="20" r="2.2" fill="#fff" />
            <path d="M16 26c1.2 1.6 6.8 1.6 8 0" stroke="#fff" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </div>
        <span class="brand-name fw-bolder text-dark">Tiki Tiki</span>
      </router-link>
    </div>

    <!-- Center: Navigation Links (Active item has Flat White Background without shadow) -->
    <div class="d-none d-md-flex align-items-center gap-2 nav-menu-links">
      <router-link 
        v-for="item in navMenuItems" 
        :key="item.name" 
        :to="item.to" 
        class="nav-link-item text-decoration-none rounded-pill"
        :class="{ 'active': isItemActive(item) }"
      >
        {{ item.name }}
      </router-link>
    </div>

    <!-- Right: Book Now CTA + Action Buttons (Cart, Appointments/Profile) -->
    <div class="d-flex align-items-center gap-2 flex-shrink-0">
      <!-- Book Now Button -->
      <router-link 
        to="/booking"
        class="btn-book-nav d-inline-flex align-items-center justify-content-center gap-2 rounded-pill text-decoration-none fw-semibold"
      >
        <span class="btn-book-icon">✨</span>
        <span class="d-none d-sm-inline">Book Now</span>
        <span class="d-sm-none">Book</span>
      </router-link>

      <!-- Shopping Cart -->
      <router-link 
        to="/cart" 
        class="btn-action-circle rounded-circle d-flex align-items-center justify-content-center text-decoration-none position-relative" 
        :class="{ 'active': route.path === '/cart' }"
        title="Shopping Cart"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#EA7A38">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        <span class="appointments-badge-count" v-if="totalQuantity > 0">{{ totalQuantity }}</span>
      </router-link>

      <!-- User Appointments / Profile Dropdown -->
      <div class="position-relative" ref="profileDropdownRef">
        <button 
          type="button"
          class="btn-action-circle rounded-circle d-flex align-items-center justify-content-center border-0 position-relative" 
          :class="{ 'active': route.path === '/profile' || isProfileDropdownOpen }"
          @click.stop="isProfileDropdownOpen = !isProfileDropdownOpen"
          title="Profile & Account Menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#EA7A38">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span class="appointments-badge-count" v-if="activeBookingsCount > 0">{{ activeBookingsCount }}</span>
        </button>

        <!-- Profile Dropdown Card -->
        <div 
          v-if="isProfileDropdownOpen" 
          class="profile-dropdown-menu position-absolute end-0 mt-2 bg-white rounded-4 border shadow-lg p-2.5 z-1060 animate-scale-down"
        >
          <!-- 1. Profile / Account Header -->
          <router-link 
            to="/profile" 
            class="d-flex align-items-center gap-3 p-2 rounded-3 text-decoration-none user-header-hover mb-1"
            @click="isProfileDropdownOpen = false"
          >
            <div class="position-relative">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80" 
                alt="Avatar" 
                class="rounded-circle object-fit-cover border"
                style="width: 42px; height: 42px;"
              />
              <span class="badge-mini-gold position-absolute bottom-0 end-0 rounded-circle text-white d-flex align-items-center justify-content-center">★</span>
            </div>
            <div class="overflow-hidden">
              <div class="d-flex align-items-center gap-1.5">
                <strong class="text-dark fs-6 text-truncate d-block">Alisa Gitten</strong>
                <span class="badge bg-orange-soft text-orange fw-bold" style="font-size: 0.65rem;">VIP</span>
              </div>
              <span class="text-muted small text-truncate d-block" style="font-size: 0.76rem;">View Profile &amp; Settings</span>
            </div>
          </router-link>

          <hr class="my-1.5 opacity-10" />

          <!-- 2. Language Selector -->
          <div class="px-2 py-1.5">
            <div class="d-flex align-items-center justify-content-between mb-1">
              <span class="small fw-semibold text-muted d-flex align-items-center gap-1.5">
                <span>🌐</span>
                <span>Language</span>
              </span>
              <span class="small text-muted fw-medium" style="font-size: 0.75rem;">{{ currentLanguage === 'en' ? 'English' : 'ភាសាខ្មែរ' }}</span>
            </div>
            <div class="d-flex gap-1 bg-toggle-wrap p-1 rounded-3">
              <button 
                type="button" 
                class="btn-toggle-option flex-grow-1 py-1 rounded-2 small fw-semibold border-0"
                :class="{ 'active': currentLanguage === 'en' }"
                @click="setLanguage('en')"
              >
                🇺🇸 EN
              </button>
              <button 
                type="button" 
                class="btn-toggle-option flex-grow-1 py-1 rounded-2 small fw-semibold border-0"
                :class="{ 'active': currentLanguage === 'kh' }"
                @click="setLanguage('kh')"
              >
                🇰🇭 KH
              </button>
            </div>
          </div>

          <!-- 3. Light / Dark Mode Switcher -->
          <div class="px-2 py-1.5">
            <div class="d-flex align-items-center justify-content-between mb-1">
              <span class="small fw-semibold text-muted d-flex align-items-center gap-1.5">
                <span>🌓</span>
                <span>Theme</span>
              </span>
              <span class="small text-muted fw-medium" style="font-size: 0.75rem;">{{ isDarkMode ? 'Dark Mode' : 'Light Mode' }}</span>
            </div>
            <div class="d-flex gap-1 bg-toggle-wrap p-1 rounded-3">
              <button 
                type="button" 
                class="btn-toggle-option flex-grow-1 py-1 rounded-2 small fw-semibold border-0 d-flex align-items-center justify-content-center gap-1"
                :class="{ 'active': !isDarkMode }"
                @click="toggleTheme('light')"
              >
                <span>☀️</span>
                <span>Light</span>
              </button>
              <button 
                type="button" 
                class="btn-toggle-option flex-grow-1 py-1 rounded-2 small fw-semibold border-0 d-flex align-items-center justify-content-center gap-1"
                :class="{ 'active': isDarkMode }"
                @click="toggleTheme('dark')"
              >
                <span>🌙</span>
                <span>Dark</span>
              </button>
            </div>
          </div>

          <hr class="my-1.5 opacity-10" />

          <!-- 4. Admin Management Portal Link -->
          <router-link 
            to="/admin/dashboard" 
            class="profile-menu-item d-flex align-items-center justify-content-between p-2 rounded-3 text-decoration-none small"
            @click="isProfileDropdownOpen = false"
          >
            <div class="d-flex align-items-center gap-2">
              <span>⚡</span>
              <span class="fw-semibold text-dark">Admin Portal</span>
            </div>
            <span class="badge bg-orange text-white rounded-pill px-2 py-0.5" style="font-size: 0.65rem;">Pro</span>
          </router-link>

          <hr class="my-1.5 opacity-10" />

          <!-- 5. Log out -->
          <button 
            type="button" 
            class="profile-menu-item logout-btn d-flex align-items-center gap-2 p-2 rounded-3 text-decoration-none text-danger small w-100 border-0 bg-transparent"
            @click="handleLogout"
          >
            <span>🚪</span>
            <span class="fw-medium">Log out</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooking } from '../../composables/useBooking'
import { useTheme } from '../../composables/useTheme'
import { useCart } from '../../composables/useCart'

const route = useRoute()
const router = useRouter()
const { activeBookingsCount } = useBooking()
const { isDarkMode, toggleTheme } = useTheme()
const { totalQuantity } = useCart()

const isProfileDropdownOpen = ref(false)
const profileDropdownRef = ref(null)
const currentLanguage = ref(localStorage.getItem('salon_lang') || 'en')

const setLanguage = (lang) => {
  currentLanguage.value = lang
  try {
    localStorage.setItem('salon_lang', lang)
  } catch (e) {
    console.error(e)
  }
}

const handleLogout = () => {
  isProfileDropdownOpen.value = false
  if (confirm('Are you sure you want to log out?')) {
    router.push('/')
  }
}

defineProps({
  cartCount: {
    type: Number,
    default: 0
  }
})

const navMenuItems = [
  { name: 'Home', to: '/' },
  { name: 'Products', to: '/products' },
  { name: 'Services', to: '/services' }
]

const isItemActive = (item) => {
  if (item.to === '/') {
    return route.path === '/' && !route.hash
  }
  return route.path === item.to || route.path.startsWith(item.to + '/')
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
/* 1. Navbar Container: Glassmorphism Effect, Flush to Top */
.navbar-top-bar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 1248px;
  z-index: 1050;
  
  /* Glassmorphism background */
  background: rgba(255, 255, 255, 0.62) !important;
  backdrop-filter: blur(18px) saturate(170%);
  -webkit-backdrop-filter: blur(18px) saturate(170%);
  
  border-left: 1px solid rgba(255, 255, 255, 0.85);
  border-right: 1px solid rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.7);
  border-top: none !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  border-bottom-left-radius: 24px !important;
  border-bottom-right-radius: 24px !important;
  min-height: 56px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05) !important;
  margin: 0 !important;
  transition: background 0.3s ease, border-color 0.3s ease;
}

@media (max-width: 576px) {
  .navbar-top-bar {
    width: 100%;
    left: 0;
    transform: none;
    border-radius: 0 0 16px 16px !important;
  }
}

/* Brand */
.brand-logo {
  cursor: pointer;
}

.brand-name {
  font-size: 1.45rem;
  letter-spacing: -0.03em;
  line-height: 1;
  color: #1a1a1a !important;
}

/* Book Now Pill Button (Reduced Size) */
.btn-book-nav {
  height: 36px;
  background: linear-gradient(135deg, #EA7A38 0%, #d96928 100%);
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0 14px;
  border-radius: 9999px;
  box-shadow: 0 3px 10px rgba(234, 122, 56, 0.25);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  white-space: nowrap;
}

.btn-book-nav:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 5px 14px rgba(234, 122, 56, 0.35);
  color: #ffffff;
}

.btn-book-icon {
  font-size: 0.8rem;
}

.nav-booking-badge {
  font-size: 0.7rem;
  background-color: #EA7A38;
  color: #ffffff;
  padding: 1px 6px;
  border-radius: 9999px;
  font-weight: 700;
}

.navbar-center-pill {
  height: auto;
}

/* Nav Links Styling */
.nav-link-item {
  color: #4b5563;
  font-size: 0.84rem;
  font-weight: 500;
  padding: 0.4rem 1.05rem;
  border-radius: 9999px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link-item:hover {
  color: #111827;
  background-color: rgba(0, 0, 0, 0.03);
}

.nav-link-item.active {
  background-color: #ffffff !important;
  color: #EA7A38 !important;
  box-shadow: none !important; /* No shadow */
  border: 1px solid rgba(255, 255, 255, 0.9);
}

/* 3. Action Circle Buttons */
.btn-action-circle {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  color: #EA7A38;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  box-shadow: none;
}

.btn-action-circle:hover {
  background-color: #ffffff;
  transform: scale(1.06);
}

.btn-action-circle.active {
  background-color: #ffffff !important;
  border-color: #EA7A38;
  box-shadow: 0 0 0 2px rgba(234, 122, 56, 0.25);
}

.appointments-badge-count {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 16px;
  height: 16px;
  background-color: #EA7A38;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #ffffff;
  padding: 0 3px;
}

.cart-badge-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 7px;
  height: 7px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 1.5px solid #ffffff;
}

/* 4. Profile Dropdown Menu Styling */
.profile-dropdown-menu {
  width: 275px;
  top: calc(100% + 10px);
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.04);
}

.user-header-hover {
  background-color: #f8fafc;
  transition: background-color 0.18s ease;
}

.user-header-hover:hover {
  background-color: #fff7ed;
}

.badge-mini-gold {
  width: 15px;
  height: 15px;
  background: #ea580c;
  font-size: 0.55rem;
  line-height: 1;
  border: 1.5px solid #ffffff;
}

.bg-orange-soft {
  background-color: rgba(234, 122, 56, 0.12) !important;
}

.text-orange {
  color: #ea580c !important;
}

.bg-orange {
  background-color: #ea580c !important;
}

.profile-menu-item {
  color: #334155;
  transition: all 0.18s ease;
}

.profile-menu-item:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.bg-toggle-wrap {
  background-color: #f1f5f9;
}

.btn-toggle-option {
  background: transparent;
  color: #64748b;
  font-size: 0.78rem;
  transition: all 0.16s ease;
  cursor: pointer;
}

.btn-toggle-option:hover:not(.active) {
  color: #0f172a;
}

.btn-toggle-option.active {
  background-color: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.logout-btn:hover {
  background-color: #fef2f2 !important;
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

@media (max-width: 640px) {
  .brand-name {
    display: none;
  }
}
</style>