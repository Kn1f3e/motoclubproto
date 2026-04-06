import { createRouter, createWebHistory } from 'vue-router'
import { appStore } from '../state/AppStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: () => (appStore.state.isAuthenticated ? '/home' : '/auth')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../pages/AuthPage.vue'),
      meta: { public: true }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../pages/HomePage.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../pages/ProfilePage.vue')
    },
    {
      path: '/club',
      name: 'club',
      component: () => import('../pages/ClubPage.vue')
    },
    {
      path: '/club/charter',
      name: 'club-charter',
      component: () => import('../pages/ClubCharterPage.vue')
    },
    {
      path: '/club/partners',
      name: 'club-partners',
      component: () => import('../pages/ClubPartnersPage.vue')
    },
    {
      path: '/club/media',
      name: 'club-media',
      component: () => import('../pages/ClubMediaPage.vue')
    },
    {
      path: '/club/plans',
      name: 'club-plans',
      component: () => import('../pages/ClubPlansPage.vue')
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../pages/EventsPage.vue')
    },
    {
      path: '/routes',
      name: 'routes',
      component: () => import('../pages/RoutesPage.vue')
    },
    {
      path: '/moto-service',
      name: 'moto-service',
      component: () => import('../pages/MotoServicePage.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../pages/AdminPage.vue')
    },
    {
      path: '/:customSlug',
      name: 'custom-section',
      component: () => import('../pages/CustomSectionPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFoundPage.vue'),
      meta: { public: true }
    }
  ]
})

router.beforeEach((to) => {
  if (!to.meta.public && !appStore.state.isAuthenticated) {
    return '/auth'
  }

  if (to.path === '/auth' && appStore.state.isAuthenticated) {
    return '/home'
  }

  return true
})

export default router
