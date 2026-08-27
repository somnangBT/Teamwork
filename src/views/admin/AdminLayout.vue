<template>
  <div class="dashboard-shell-container">
    
    <!-- Mobile Sidebar Backdrop Overlay -->
    <div 
      class="sidebar-backdrop d-lg-none" 
      :class="{ 'show': isMobileOpen }"
      @click="closeMobile()"
    ></div>

    <!-- 1. Exact tnak-digital-frontend Dual Sidebar -->
    <div class="content-sidebar" :class="{ 'mobile-show': isMobileOpen }">
      <aside class="sidebar">

        <!-- Column 1: Main Sidebar (62px) -->
        <div class="main-sidebar">
          <!-- Main Brand Logo -->
          <div class="main-sidebar-brand mb-3">
            <router-link to="/admin/dashboard" class="d-flex align-items-center justify-content-center text-decoration-none">
              <svg style="width: 35px; height: 35px; flex-shrink: 0;" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="22" r="12" fill="#EA7A38" />
                <circle cx="9" cy="11" r="5.5" fill="#EA7A38" />
                <circle cx="31" cy="11" r="5.5" fill="#EA7A38" />
                <circle cx="16" cy="20" r="2.2" fill="#ffffff" />
                <circle cx="24" cy="20" r="2.2" fill="#ffffff" />
                <path d="M16 26c1.2 1.6 6.8 1.6 8 0" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </router-link>
          </div>

          <!-- Main Sidebar Icons Column -->
          <div class="icon-col">
            <router-link 
              v-for="item in navItems" 
              :key="item.id" 
              :to="item.link" 
              class="icon-btn"
              :class="{ 'is-active': isActive(item.link) }" 
              :title="item.label"
              @click="closeMobile()"
            >
              <span v-html="item.iconSvg"></span>
            </router-link>
          </div>

          <!-- Main Sidebar Footer Column: Theme Switcher & Collapse Toggle -->
          <div class="footer-col">
            <div class="theme-switcher mb-3">
              <button 
                type="button"
                aria-label="Light theme" 
                class="theme-btn" 
                :class="{ active: !isDarkMode }"
                @click="setThemeMode('light')" 
                title="Light theme"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              </button>
              <button 
                type="button"
                aria-label="Dark theme" 
                class="theme-btn" 
                :class="{ active: isDarkMode }"
                @click="setThemeMode('dark')" 
                title="Dark theme"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </button>
            </div>
            
            <button 
              type="button"
              aria-label="Toggle sidebar" 
              class="toggle-btn mt-2" 
              @click="toggleSidebar()"
              :title="isExpanded ? 'Collapse' : 'Expand'"
            >
              <svg v-if="isExpanded" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <path d="M14 9l-3 3 3 3"></path>
              </svg>
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <path d="M12 9l3 3-3 3"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Column 2: Second Expandable Sidebar (180px) -->
        <div class="second-sidebar" :class="{ collapsed: !isExpanded }">
          <div class="sidebar-brand mb-3">
            <span class="brand-title-text fw-bold" style="color: var(--text-heading-color); font-size: 1.05rem;">
              Tiki Salon
            </span>
          </div>

          <div class="label-col">
            <!-- Iconic sliding active pill with inverse curved corners -->
            <div 
              class="active-pill" 
              :class="{ 'no-transition': !pillReady }"
              :style="{ top: pillTop + 'px', height: pillHeight + 'px' }"
            ></div>

            <ul class="navbar-nav">
              <li 
                class="nav-item" 
                v-for="(item, index) in navItems" 
                :key="item.id"
                :ref="el => { if (el) itemRefs[index] = el }"
              >
                <router-link 
                  :to="item.link" 
                  class="nav-link d-flex align-items-center justify-content-between pe-3" 
                  :class="{ 'is-active': isActive(item.link) }"
                  @click="closeMobile()"
                >
                  <span class="text-truncate">{{ item.label }}</span>
                  <span 
                    v-if="item.badge" 
                    class="badge rounded-pill fw-bold"
                    :style="isActive(item.link) ? 'background-color: var(--primary-color); color: #fff;' : 'background-color: rgba(0,0,0,0.06); color: var(--sidebar-text-muted);'"
                    style="font-size: 0.65rem; padding: 0.2rem 0.45rem;"
                  >
                    {{ item.badge }}
                  </span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>

      </aside>
    </div>

    <!-- 2. Content Wrapper with DashboardHeader -->
    <main class="content-wrapper" :class="{ collapsed: !isExpanded }">
      
      <!-- Exact tnak-digital-frontend Header -->
      <header class="dashboard-header d-flex align-items-center justify-content-between px-lg-4 px-3 border-bottom">
        <div class="header-left d-flex align-items-center gap-3">
          <!-- Mobile Sidebar Toggle -->
          <button 
            type="button"
            class="btn btn-light d-lg-none p-2 rounded d-flex align-items-center justify-content-center" 
            @click="toggleMobile()"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <h5 class="mb-0 fw-medium d-none d-lg-block">{{ currentTitle }}</h5>
        </div>

        <!-- Mobile Centered Title -->
        <div class="header-center position-absolute start-50 translate-middle-x d-lg-none">
          <h6 class="mb-0 fw-medium">{{ currentTitle }}</h6>
        </div>
        
        <!-- Header Right: Live Storefront link & Profile Dropdown -->
        <div class="header-right d-flex align-items-center gap-3">
          
          <!-- Storefront Quick Link -->
          <router-link 
            to="/" 
            target="_blank"
            class="btn btn-sm btn-light border rounded-pill px-3 py-1.5 fw-medium d-none d-sm-inline-flex align-items-center gap-1.5 text-decoration-none"
            style="font-size: 0.78rem; color: var(--text-base);"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span>Live Storefront</span>
          </router-link>

          <!-- Profile Info Pill with Avatar Ring -->
          <div class="position-relative" ref="profileDropdownRef">
            <div 
              class="d-flex align-items-center gap-2.5 p-1 pe-2 rounded-pill" 
              @click="isProfileOpen = !isProfileOpen" 
              style="cursor: pointer;"
            >
              <span class="fw-medium d-none d-sm-block small text-heading" style="font-size: 0.84rem;">Elena Rostova</span>
              
              <div class="avatar-ring-container">
                <div class="user-avatar overflow-hidden rounded-circle bg-light border position-relative" :class="{ 'active-profile': isProfileOpen }">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80" 
                    alt="Elena Rostova" 
                    class="w-100 h-100 object-fit-cover" 
                  />
                </div>
              </div>
            </div>

            <!-- Profile Dropdown Menu -->
            <div 
              v-if="isProfileOpen" 
              class="profile-dropdown-menu position-absolute end-0 mt-2 bg-white rounded-3 border shadow-lg p-2 z-1060"
              style="min-width: 220px; background-color: var(--card-bg-color) !important;"
            >
              <div class="px-2.5 py-2 border-bottom mb-1">
                <div class="fw-bold text-truncate" style="color: var(--text-heading-color); font-size: 0.88rem;">Elena Rostova</div>
                <div class="small text-muted text-truncate" style="font-size: 0.74rem;">Salon Director / Admin</div>
              </div>

              <router-link 
                to="/profile" 
                class="dropdown-item-link d-flex align-items-center gap-2 px-2.5 py-2 rounded-2 text-decoration-none"
                style="color: var(--text-base); font-size: 0.84rem;"
                @click="isProfileOpen = false"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Profile &amp; Settings</span>
              </router-link>

              <router-link 
                to="/" 
                class="dropdown-item-link d-flex align-items-center gap-2 px-2.5 py-2 rounded-2 text-decoration-none"
                style="color: var(--text-base); font-size: 0.84rem;"
                @click="isProfileOpen = false"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <span>Exit to Storefront</span>
              </router-link>
            </div>
          </div>

        </div>
      </header>

      <!-- Main Body Container -->
      <div class="container-fluid p-lg-4 p-3">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../../composables/useTheme'
import { useBooking } from '../../composables/useBooking'
import { useAdmin } from '../../composables/useAdmin'

const route = useRoute()
const { isDarkMode, setTheme } = useTheme()
const { activeBookingsCount } = useBooking()
const { pendingOrdersCount, lowStockCount, staffList, customers } = useAdmin()

const isExpanded = ref(true)
const isMobileOpen = ref(false)
const isProfileOpen = ref(false)
const profileDropdownRef = ref(null)

const itemRefs = ref([])
const pillTop = ref(0)
const pillHeight = ref(0)
const pillReady = ref(false)

const currentTitle = computed(() => {
  return route.meta?.title || 'Dashboard'
})

const navItems = computed(() => [
  {
    id: 1,
    label: 'Dashboard',
    link: '/admin/dashboard',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`
  },
  {
    id: 2,
    label: 'Appointments',
    link: '/admin/bookings',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
  },
  {
    id: 3,
    label: 'Services & Care',
    link: '/admin/services',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>`
  },
  {
    id: 4,
    label: 'Patients & Pets',
    link: '/admin/customers',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
  },
  {
    id: 5,
    label: 'Orders & Sales',
    link: '/admin/orders',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>`
  },
  {
    id: 6,
    label: 'Supplies & Retail',
    link: '/admin/products',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`
  },
  {
    id: 7,
    label: 'Specialists & Staff',
    link: '/admin/staff',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>`
  }
])

function isActive(link) {
  if (link === '/admin/dashboard') {
    return route.path === '/admin' || route.path === '/admin/dashboard'
  }
  return route.path.startsWith(link)
}

function toggleSidebar() {
  isExpanded.value = !isExpanded.value
  nextTick(() => updatePill(true))
}

function toggleMobile() {
  isMobileOpen.value = !isMobileOpen.value
}

function closeMobile() {
  isMobileOpen.value = false
}

function setThemeMode(val) {
  setTheme(val === 'dark')
}

function updatePill(animate = true) {
  const activeIndex = navItems.value.findIndex(item => isActive(item.link))
  const el = itemRefs.value[activeIndex]
  if (el) {
    pillTop.value = el.offsetTop
    const navLinkElement = el.querySelector('.nav-link')
    pillHeight.value = navLinkElement ? navLinkElement.offsetHeight : el.offsetHeight
  }
  if (animate) pillReady.value = true
}

const handleClickOutside = (e) => {
  if (isProfileOpen.value && profileDropdownRef.value && !profileDropdownRef.value.contains(e.target)) {
    isProfileOpen.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await nextTick()
  updatePill(false)
  await nextTick()
  pillReady.value = true
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(() => route.path, async () => {
  closeMobile()
  await nextTick()
  updatePill(true)
})
</script>

<style scoped>
/* ==========================================================================
   Exact tnak-digital-frontend Dual Sidebar Styles
   ========================================================================== */
.sidebar-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1005;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s;
    will-change: opacity;
}

.sidebar-backdrop.show {
    opacity: 1;
    visibility: visible;
}

.content-wrapper {
    margin-left: calc(var(--sidebar-width) + var(--main-sidebar-width));
    transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 100vh;
    background-color: var(--body-bg-color);
}

.content-wrapper.collapsed {
    margin-left: var(--main-sidebar-width);
}

.sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: var(--sidebar-bg-color);
    z-index: 1000;
    display: flex;
}

@media (max-width: 991.98px) {
    .sidebar {
        position: static;
        height: 100%;
    }
}

.main-sidebar {
    width: var(--main-sidebar-width);
    flex-shrink: 0;
    height: 100%;
    background-color: var(--main-sidebar-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
}

@media (max-width: 991.98px) {
    .main-sidebar {
        display: none !important;
    }
}

.main-sidebar-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-shrink: 0;
    border-bottom: 1px solid var(--sidebar-border-color);
    height: var(--sidebar-header-height);
}

.toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: transparent;
    color: var(--sidebar-text-active);
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.15s ease;
}

.toggle-btn:hover {
    transform: scale(1.1);
}

.icon-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex: 1;
}

.icon-btn {
    width: 100%;
    padding: 12px 0;
    display: flex;
    height: 48px;
    align-items: center;
    justify-content: center;
    color: var(--sidebar-text-muted);
    text-decoration: none;
    flex-shrink: 0;
    border-left: 3px solid transparent;
    transition: color 0.15s, border-color 0.15s;
    box-sizing: border-box;
}

.icon-btn:hover {
    color: var(--sidebar-text-hover);
}

.icon-btn.is-active {
    color: var(--sidebar-text-active);
    border-left-color: var(--sidebar-text-active);
}

.second-sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.second-sidebar.collapsed {
    width: 0;
}

@media (max-width: 991.98px) {
    .second-sidebar.collapsed {
        width: var(--sidebar-width);
    }
}

.sidebar-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--sidebar-header-height);
    border-bottom: 1px solid var(--sidebar-border-color);
}

.label-col {
    flex: 1;
    position: relative;
}

.navbar-nav {
    position: relative;
    overflow: hidden;
    list-style: none;
    padding-left: 0;
    margin-bottom: 0;
}

/* ==========================================================================
   Iconic Inverse-Curved Active Pill Transition
   ========================================================================== */
.active-pill {
    position: absolute;
    left: 12px;
    right: 0;
    background-color: var(--body-bg-color);
    border-radius: 50px 0 0 50px;
    pointer-events: none;
    transition: top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.active-pill.no-transition {
    transition: none;
}

.active-pill::before,
.active-pill::after {
    content: '';
    position: absolute;
    width: var(--border-radius);
    height: var(--border-radius);
    right: 0;
    background-color: transparent;
    pointer-events: none;
}

.active-pill::before {
    top: calc(-1 * var(--border-radius));
    border-bottom-right-radius: var(--border-radius);
    box-shadow: 5px 5px 0 5px var(--body-bg-color);
}

.active-pill::after {
    bottom: calc(-1 * var(--border-radius));
    border-top-right-radius: var(--border-radius);
    box-shadow: 5px -5px 0 5px var(--body-bg-color);
}

.nav-link {
    position: relative;
    padding: 12px 20px;
    margin-left: 12px;
    color: var(--sidebar-text-hover);
    text-decoration: none;
    display: flex;
    align-items: center;
    border-radius: var(--border-radius) 0 0 var(--border-radius);
    font-weight: 500;
    font-size: 0.88rem;
    z-index: 1;
    white-space: nowrap;
    box-sizing: border-box;
    transition: color 0.15s ease;
}

.nav-link:hover {
    color: var(--sidebar-text-active);
}

.nav-link.is-active {
    color: var(--primary-color);
    font-weight: 600;
}

.footer-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;
    width: 100%;
}

.theme-switcher {
    background-color: var(--sidebar-element-bg);
    border-radius: 50px;
    display: flex;
    flex-direction: column;
    padding: 2px;
    gap: 2px;
}

.theme-btn {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--sidebar-text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    cursor: pointer;
}

.theme-btn:hover {
    color: var(--sidebar-text-active);
}

.theme-btn.active {
    background-color: var(--primary-color);
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ==========================================================================
   Exact DashboardHeader Styles
   ========================================================================== */
.dashboard-header {
    background: color-mix(in srgb, var(--body-bg-color) 75%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-clr) !important;
    height: var(--sidebar-header-height);
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.user-avatar {
    width: 36px; 
    height: 36px;
    transition: all 0.2s ease;
}

.user-avatar.active-profile {
    border-color: var(--primary-color) !important;
    transform: scale(1.05);
}

.avatar-ring-container {
    position: relative;
    border-radius: 50%;
    padding: 2px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.dropdown-item-link:hover {
    background-color: var(--surface-ground);
    color: var(--primary-color) !important;
}

/* ==========================================================================
   Mobile Drawer & Media Queries
   ========================================================================== */
@media (max-width: 991.98px) {
    .content-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 1011;
        transform: translateX(-100%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
    }

    .content-sidebar.mobile-show {
        transform: translateX(0);
    }

    .content-wrapper {
        margin-left: 0 !important;
        min-height: calc(100vh - var(--sidebar-header-height));
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(4px);
}
</style>
