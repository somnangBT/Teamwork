import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/user/HomePage/HomeView.vue'
import ProductPage from '../views/user/products/Productpage.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Customer Storefront Routes
    {
      path: '/',
      name: 'home',
      meta: { title: 'Home' },
      component: HomePage
    },
    {
      path: '/hero',
      name: 'hero',
      meta: { title: 'Hero' },
      component: () => import('../views/user/HeroPage.vue')
    },
    {
      path: '/products',
      name: 'products',
      meta: { title: 'Products' },
      component: ProductPage
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      meta: { title: 'Product Details' },
      component: () => import('../views/user/products/ProductDetailPage.vue')
    },
    {
      path: '/services',
      name: 'services',
      meta: { title: 'Services' },
      component: () => import('../views/user/services/ServicesPage.vue')
    },
    {
      path: '/booking',
      name: 'booking',
      meta: { title: 'My Bookings' },
      component: () => import('../views/user/booking/BookingPage.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      meta: { title: 'My Profile' },
      component: () => import('../views/user/profile/ProfilePage.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      meta: { title: 'Shopping Cart' },
      component: () => import('../views/user/cart/CartPage.vue')
    },

    // Auth Routes
    {
      path: '/login',
      name: 'login',
      meta: { title: 'Sign In', hideChrome: true },
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      meta: { title: 'Create Account', hideChrome: true },
      component: () => import('../views/auth/RegisterView.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      meta: { title: 'Reset Password', hideChrome: true },
      component: () => import('../views/auth/ForgotPasswordView.vue')
    },

    // Admin Portal Management Routes (Salon Operations)
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          meta: { title: 'Dashboard' },
          component: () => import('../views/admin/salon/AdminDashboardView.vue')
        },
        {
          path: 'bookings',
          name: 'admin-bookings',
          meta: { title: 'Appointments & Bookings' },
          component: () => import('../views/admin/salon/AdminBookingsView.vue')
        },
        {
          path: 'services',
          name: 'admin-services',
          meta: { title: 'Services Catalog' },
          component: () => import('../views/admin/salon/AdminServicesView.vue')
        },
        {
          path: 'products',
          name: 'admin-products',
          meta: { title: 'Products & Inventory' },
          component: () => import('../views/admin/salon/AdminProductsView.vue')
        },
        {
          path: 'orders',
          name: 'admin-orders',
          meta: { title: 'Orders & Sales' },
          component: () => import('../views/admin/salon/AdminOrdersView.vue')
        },
        {
          path: 'customers',
          name: 'admin-customers',
          meta: { title: 'Customers & Profiles' },
          component: () => import('../views/admin/salon/AdminCustomersView.vue')
        },
        {
          path: 'staff',
          name: 'admin-staff',
          meta: { title: 'Specialists & Staff' },
          component: () => import('../views/admin/salon/AdminStaffView.vue')
        },
        {
          path: 'settings',
          name: 'admin-settings',
          meta: { title: 'Profile Settings' },
          component: () => import('../views/admin/dashboard/SettingsView.vue')
        }
      ]
    },

    // Error Pages
    {
      path: '/403',
      name: 'forbidden',
      meta: { title: 'Access Denied', hideChrome: true },
      component: () => import('../views/errors/ForbiddenView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      meta: { title: 'Page Not Found', hideChrome: true },
      component: () => import('../views/errors/NotFoundView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return savedPosition || { top: 0 }
  }
})

router.afterEach((to) => {
  const pageTitle = to.meta?.title
  document.title = pageTitle ? `${pageTitle} | Tiki Tiki Beauty Salon` : 'Tiki Tiki — Beauty Salon & Care Store'
})

export default router
