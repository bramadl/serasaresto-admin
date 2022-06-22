import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: {
      name: 'dashboard'
    }
  },
  {
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    },
    path: '/dashboard',
    name: 'dashboard',
    component: Home
  },
  {
    meta: {
      title: 'Daftar Pelanggan',
      requiresAuth: true
    },
    path: '/daftar-pelanggan',
    name: 'daftar-pelanggan',
    component: () => import('@/views/DaftarPelanggan.vue')
  },
  {
    meta: {
      title: 'Daftar Menu',
      requiresAuth: true
    },
    path: '/daftar-menu',
    name: 'daftar-menu',
    component: () => import('@/views/DaftarMenu.vue')
  },
  {
    meta: {
      title: 'Daftar Meja',
      requiresAuth: true
    },
    path: '/daftar-meja',
    name: 'daftar-meja',
    component: () => import('@/views/DaftarMeja.vue')
  },
  {
    meta: {
      title: 'Daftar Pemesanan',
      requiresAuth: true
    },
    path: '/daftar-pemesanan',
    name: 'daftar-pemesanan',
    component: () => import('@/views/DaftarPemesanan.vue')
  },
  {
    meta: {
      title: 'Profile',
      requiresAuth: true
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile.vue')
  },
  {
    meta: {
      title: 'Login',
      guest: true,
      fullScreen: true
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    meta: {
      title: 'Error',
      fullScreen: true
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/Error.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
