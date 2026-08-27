import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { handleApiError } from '@/utils/apiError'

NProgress.configure({ showSpinner: false })

const routes = [
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/auth/LoginView.vue'),
		meta: { title: 'Login' }
	},
	{
		path: '/register',
		name: 'register',
		component: () => import('@/views/auth/RegisterUserView.vue'),
		meta: { title: 'Register' }
	},
	{
		path: '/forgot-password',
		name: 'forgot-password',
		component: () => import('@/views/auth/ForgotPasswordView.vue'),
		meta: { title: 'Forgot Password' }
	},
	{
		path: '/reset-password',
		name: 'reset-password',
		component: () => import('@/views/auth/ChangePasswordView.vue'),
		meta: { title: 'Reset Password' }
	},
	{
		path: '/otp',
		name: 'otp',
		component: () => import('@/views/auth/OTPView.vue'),
		meta: { title: 'OTP' }
	},
	{
		path: '/change-password',
		name: 'change-password',
		component: () => import('@/views/auth/ChangePasswordView.vue'),
		meta: { title: 'Change Password' }
	},
	{
		path: '/',
		component: () => import('@/layouts/landingLayouts/LandingShell.vue'),
		children: [
			{
				path: '',
				name: 'Home',
				component: () => import('@/views/landing/HomeView.vue')
			},
			{
				path: 'about',
				name: 'About Us',
				component: () => import('@/views/landing/AboutUsView.vue')
			}
		]
	},
	{
		path: '/tnak',
		component: () => import('@/layouts/tnakLayouts/TnakShell.vue'),
		meta: { requiresAuth: true, roles: ['TEACHER', 'STUDENT'] },
		children: [
			{
				path: '',
				name: 'tnak-overview',
				component: () => import('@/views/tnaks/TnakOverviewView.vue')
			},
			{
				path: 'report',
				name: 'tnak-reports',
				component: () => import('@/views/tnaks/TnakReportView.vue')
			},
			{
				path: 'surveys',
				name: 'tnak-surveys',
				component: () => import('@/views/tnaks/TnakSurveyListView.vue'),
				meta: { roles: ['STUDENT'] }
			},
			{
				path: 'survey/:id',
				name: 'tnak-survey',
				component: () => import('@/views/tnaks/TnakSurveyView.vue'),
				meta: { roles: ['STUDENT'] }
			},
			{
				path: 'room',
				name: 'tnak-rooms',
				component: () => import('@/views/tnaks/TnakRoomView.vue')
			},
			{
				path: 'room/:id',
				name: 'room-detail',
				component: () => import('@/views/tnaks/TnakRoomDetailsView.vue')
			},
			{
				path: 'my-bookings',
				name: 'tnak-my-bookings',
				component: () => import('@/views/tnaks/TnakMyBookingsView.vue'),
				meta: { title: 'My Bookings' }
			},
			{
				path: 'profile',
				name: 'tnak-profile',
				component: () => import('@/views/tnaks/TnakProfileView.vue')
			}
		]
	},
	{
		path: '/dashboard',
		component: () => import('@/layouts/dashboardLayouts/DashboardShell.vue'),
		meta: { requiresAuth: true, roles: ['ADMIN'] },
		children: [
			{
				path: '',
				name: 'dashboard',
				component: () => import('@/views/dashboard/OverviewView.vue'),
				meta: { title: 'Overview' }
			},
			{
				path: 'user',
				name: 'dashboard-user',
				component: () => import('@/views/dashboard/users/UserView.vue'),
				meta: { title: 'Users Management' }
			},
			{
				path: 'report',
				name: 'report',
				component: () => import('@/views/dashboard/reports/ReportView.vue'),
				meta: { title: 'Student Reports' }
			},
			{
				path: 'survey',
				name: 'survey',
				component: () => import('@/views/dashboard/surveys/SurveyView.vue'),
				meta: { title: 'Surveys Management' }
			},
			{
				path: 'room',
				name: 'room',
				component: () => import('@/views/dashboard/rooms/RoomView.vue'),
				meta: { title: 'Rooms Management' }
			},
			{
				path: 'settings',
				name: 'settings',
				component: () => import('@/views/dashboard/SettingsView.vue'),
				meta: { title: 'Profile Settings' }
			}
		]
	},
	{
		path: '/403',
		name: 'Forbidden',
		component: () => import('@/views/errors/ForbiddenView.vue'),
		meta: { title: '403 - Forbidden' }
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: () => import('@/views/errors/NotFoundView.vue'),
		meta: { title: '404 - Page Not Found' }
	}
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
	linkExactActiveClass: 'active'
});

router.beforeEach(async (to) => {
	NProgress.start()
	const authStore = useAuthStore()

	if (authStore.accessToken && !authStore.user) {
		try {
			await authStore.fetchProfile()
		} catch (e) {
			authStore.clearAuth()
			return { name: 'login' }
		}
	}

	const isAuthenticated = authStore.isAuthenticated
	const needsPasswordChange = !!localStorage.getItem('changePasswordToken');
	const needOtpVerify = !!localStorage.getItem('otpSessionToken');
	const authPages = ['login', 'otp', 'change-password', 'forgot-password', 'reset-password']

	if ((!needOtpVerify && to.name == 'otp') || (!needsPasswordChange && to.name == 'change-password')) {
		return { name: 'login' }
	}

	if (needsPasswordChange) {
		if (to.name === 'change-password') return true
		if (to.name === '' || to.name === 'login') return true
		return { name: 'change-password' }
	}

	if ((to.name == 'register' || to.name == 'reset-password') && !to.query.token) {
		return { name: 'login' }
	}

	if (authPages.includes(to.name)) {
		if (isAuthenticated) {
			if (authStore.isAdmin) return { name: 'dashboard' }
			return { name: 'tnak-overview' }
		}
		return true
	}

	if (!to.meta.requiresAuth) {
		return true
	}

	// 5. Protected routes — must be authenticated
	if (!isAuthenticated) {
		return { name: 'login', query: { redirect: to.fullPath } }
	}

	// 6. Role-based access control
	const requiredRoles = to.meta.roles
	if (requiredRoles && !authStore.hasRole(requiredRoles)) {
		const target = authStore.isAdmin ? 'dashboard' : 'tnak-overview'
		if (target && handleApiError() == 'Connection lost!') {
			return { name: '' }
		}
		if (to.name !== target) {
			return { name: target }
		}
	}

	return true
})

router.afterEach((to) => {
	NProgress.done()
	const suffix = to.path.startsWith('/dashboard') ? 'Admin' : 'Tnak Digital'
	document.title = to.meta.title ? `${to.meta.title} | ${suffix}` : suffix
})

router.onError(() => {
	NProgress.done()
})

export default router
