<style scoped>
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
}

.icon-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex: 1;
    overflow-y: auto;
}

.icon-btn {
    width: 100%;
    padding: 12px 0;
    display: flex;
    height: 46px;
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
    padding-inline: 12px;
}

.label-col {
    flex: 1;
    position: relative;
    overflow-y: auto;
}

.sidebar-decoration {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 220px;
    background-color: var(--primary-color);
    -webkit-mask-image: url('/sidebar-decoration.png');
    -webkit-mask-size: 100% auto;
    -webkit-mask-position: bottom;
    -webkit-mask-repeat: no-repeat;
    mask-image: url('/sidebar-decoration.png');
    mask-size: 100% auto;
    mask-position: bottom;
    mask-repeat: no-repeat;
    opacity: 0.35;
    pointer-events: none;
    user-select: none;
    display: block;
    z-index: 0;
}

.navbar-nav {
    position: relative;
    overflow: hidden;
}

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
    padding: 11px 22px;
    margin-left: 12px;
    color: var(--sidebar-text-hover);
    text-decoration: none;
    display: flex;
    align-items: center;
    border-radius: var(--border-radius) 0 0 var(--border-radius);
    font-weight: 500;
    z-index: 1;
    white-space: nowrap;
    box-sizing: border-box;
    font-size: 0.92rem;
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
    padding: 0.75rem 0;
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
    color: var(--body-bg-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

<template>
    <aside class="sidebar">
        <div class="main-sidebar">
            <div class="main-sidebar-brand mb-2">
                <router-link to="/" v-tooltip.right="'Back to Storefront'" aria-label="Tiki Tiki Storefront">
                    <Logo style="width: 34px; height: 34px; flex-shrink: 0;" />
                </router-link>
            </div>

            <div class="icon-col">
                <router-link v-for="item in navItems" :key="item.id" :to="item.link" class="icon-btn"
                    :class="{ 'is-active': isActive(item.link) }" v-tooltip.right="item.label">
                    <component :is="item.icon" :size="19" :stroke-width="1.75" />
                </router-link>
            </div>

            <div class="footer-col">
                <router-link to="/" class="icon-btn mb-2" style="height: 36px; border-left: none;" v-tooltip.right="t('admin.storefront')">
                    <Store :size="18" />
                </router-link>

                <div class="theme-switcher mb-2">
                    <button aria-label="Light theme" class="theme-btn" :class="{ active: !isDarkMode }"
                        @click="toggleTheme('light')" v-tooltip.right="'Light theme'">
                        <Sun :size="14" :stroke-width="2" />
                    </button>
                    <button aria-label="Dark theme" class="theme-btn" :class="{ active: isDarkMode }"
                        @click="toggleTheme('dark')" v-tooltip.right="'Dark theme'">
                        <Moon :size="14" :stroke-width="2" />
                    </button>
                </div>

                <button aria-label="Toggle sidebar" class="toggle-btn mt-1" @click="sidebar.toggle()"
                    v-tooltip.right="sidebar.isExpanded ? 'Collapse' : 'Expand'">
                    <PanelLeftClose v-if="sidebar.isExpanded" :size="20" :stroke-width="1.5" />
                    <PanelLeftOpen v-else :size="20" :stroke-width="1.5" />
                </button>
            </div>
        </div>

        <div class="second-sidebar" :class="{ collapsed: !sidebar.isExpanded }">
            <div class="sidebar-brand mb-2">
                <span class="fw-bold small text-truncate" style="color: var(--text-heading-color); letter-spacing: 0.02em;">
                    Tiki Salon Admin
                </span>
            </div>

            <div class="label-col">
                <div class="active-pill" :class="{ 'no-transition': !pillReady }"
                    :style="{ top: pillTop + 'px', height: pillHeight + 'px' }"></div>

                <ul class="navbar-nav">
                    <li class="nav-item" v-for="(item, index) in navItems" :key="item.id"
                        :ref="el => { if (el) itemRefs[index] = el }">
                        <router-link :to="item.link" class="nav-link" :class="{ 'is-active': isParentActive(item) }">
                            {{ item.label }}
                        </router-link>
                    </li>
                    <li class="nav-item d-lg-none mt-2 px-3">
                        <router-link to="/" class="btn-tnak-outline text-decoration-none w-100 text-center d-block small py-2">
                            ← {{ t('admin.storefront') }}
                        </router-link>
                    </li>
                </ul>

                <div class="sidebar-decoration" aria-hidden="true"></div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import {
    LayoutDashboard, CalendarCheck, Scissors, Package,
    ShoppingBag, Users, UserCheck, Settings,
    PanelLeftClose, PanelLeftOpen, Sun, Moon, Store
} from '@lucide/vue'
import Logo from '@/components/Logo.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from '@/composables/useI18n'

const sidebar = useSidebarStore()
const { isDarkMode, toggleTheme } = useTheme()
const { t } = useI18n()

const route = useRoute()
const itemRefs = ref([])
const pillTop = ref(0)
const pillHeight = ref(0)
const pillReady = ref(false)

const navItems = computed(() => [
    { id: 1, label: t('admin.dashboard'), link: '/admin/dashboard', icon: LayoutDashboard },
    { id: 2, label: t('admin.bookings'), link: '/admin/bookings', icon: CalendarCheck },
    { id: 3, label: t('admin.services'), link: '/admin/services', icon: Scissors },
    { id: 4, label: t('admin.products'), link: '/admin/products', icon: Package },
    { id: 5, label: t('admin.orders'), link: '/admin/orders', icon: ShoppingBag },
    { id: 6, label: t('admin.customers'), link: '/admin/customers', icon: Users },
    { id: 7, label: t('admin.staff'), link: '/admin/staff', icon: UserCheck },
    { id: 8, label: t('admin.settings'), link: '/admin/settings', icon: Settings }
])

function isActive(link) {
    return route.path === link || route.path.startsWith(link + '/')
}

function isParentActive(item) {
    return isActive(item.link)
}

function updatePill(animate = true) {
    const activeIndex = navItems.value.findIndex(item => isParentActive(item))
    const el = itemRefs.value[activeIndex]
    if (el) {
        pillTop.value = el.offsetTop
        const navLinkElement = el.querySelector('.nav-link')
        pillHeight.value = navLinkElement ? navLinkElement.offsetHeight : el.offsetHeight
    }
    if (animate) pillReady.value = true
}

onMounted(async () => {
    await nextTick()
    updatePill(false)
    await nextTick()
    pillReady.value = true
})

watch(() => route.path, async () => {
    await nextTick()
    updatePill(true)
})
</script>
