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
          component: () => import('../views/admin/dashboard/OverviewView.vue')
        },
        {
          path: 'user',
          name: 'admin-user',
          meta: { title: 'Users Management' },
          component: () => import('../views/admin/dashboard/users/UserView.vue')
        },
        {
          path: 'report',
          name: 'admin-report',
          meta: { title: 'Feedback & Reports' },
          component: () => import('../views/admin/dashboard/reports/ReportView.vue')
        },
        {
          path: 'survey',
          name: 'admin-survey',
          meta: { title: 'Surveys Management' },
          component: () => import('../views/admin/dashboard/surveys/SurveyView.vue')
        },
        {
          path: 'room',
          name: 'admin-room',
          meta: { title: 'Rooms Management' },
          component: () => import('../views/admin/dashboard/rooms/RoomView.vue')
        },
        {
          path: 'settings',
          name: 'admin-settings',
          meta: { title: 'Profile Settings' },
          component: () => import('../views/admin/dashboard/SettingsView.vue')
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
