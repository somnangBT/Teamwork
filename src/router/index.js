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
      component: HomePage
    },
    {
      path: '/hero',
      name: 'hero',
      component: () => import('../views/user/HeroPage.vue')
    },
    {
      path: '/products',
      name: 'products',
      component: ProductPage
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/user/services/ServicesPage.vue')
    },
    {
      path: '/booking',
      name: 'booking',
      component: () => import('../views/user/booking/BookingPage.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/user/profile/ProfilePage.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/user/cart/CartPage.vue')
    },

    // Admin Portal Management Routes
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
          component: () => import('../views/admin/AdminDashboard.vue')
        },
        {
          path: 'bookings',
          name: 'admin-bookings',
          meta: { title: 'Appointments' },
          component: () => import('../views/admin/AdminBookings.vue')
        },
        {
          path: 'services',
          name: 'admin-services',
          meta: { title: 'Services & Care' },
          component: () => import('../views/admin/AdminServices.vue')
        },
        {
          path: 'products',
          name: 'admin-products',
          meta: { title: 'Supplies & Retail' },
          component: () => import('../views/admin/AdminProducts.vue')
        },
        {
          path: 'orders',
          name: 'admin-orders',
          meta: { title: 'Orders & Sales' },
          component: () => import('../views/admin/AdminOrders.vue')
        },
        {
          path: 'customers',
          name: 'admin-customers',
          meta: { title: 'Patients & Pets' },
          component: () => import('../views/admin/AdminCustomers.vue')
        },
        {
          path: 'staff',
          name: 'admin-staff',
          meta: { title: 'Specialists & Staff' },
          component: () => import('../views/admin/AdminStaff.vue')
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return savedPosition || { top: 0 }
  }
})

export default router
