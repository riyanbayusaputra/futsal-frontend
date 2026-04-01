import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/',            component: () => import('@/views/HomeView.vue')         },
    { path: '/courts',      component: () => import('@/views/CourtsView.vue')       },
    { path: '/courts/:id',  component: () => import('@/views/CourtDetailView.vue')  },
    { path: '/login',       component: () => import('@/views/LoginView.vue')        },
    { path: '/register',    component: () => import('@/views/RegisterView.vue')     },
    {
      path: '/bookings',
      component: () => import('@/views/BookingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/payment/:bookingId',
      component: () => import('@/views/PaymentView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '',         component: () => import('@/views/admin/DashboardView.vue') },
        { path: 'bookings', component: () => import('@/views/admin/BookingsView.vue')  },
        { path: 'courts',   component: () => import('@/views/admin/CourtsView.vue')    },
        { path: 'users',    component: () => import('@/views/admin/UsersView.vue')     },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  // Saat guard jalan, fetchUser() di main.js sudah selesai
  // jadi auth.isLoggedIn sudah akurat
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    // Simpan halaman tujuan untuk redirect setelah login
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return '/'
  }

  // Cegah user yang sudah login masuk ke halaman login/register
  if ((to.path === '/login' || to.path === '/register') && auth.isLoggedIn) {
    return auth.isAdmin ? '/admin' : '/'
  }
})

export default router
