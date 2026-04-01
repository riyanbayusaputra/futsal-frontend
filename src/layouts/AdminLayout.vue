<template>
  <div class="flex min-h-screen bg-gray-50">

    <!-- Sidebar -->
    <aside class="hidden md:flex flex-col w-60 bg-gray-900 fixed left-0 top-0 h-screen z-40">
      <div class="px-6 py-5 border-b border-gray-800">
        <RouterLink to="/" class="flex items-center gap-2 text-white font-bold text-lg">
          <span>⚽</span><span>FutsalKita</span>
        </RouterLink>
        <div class="text-xs text-gray-500 mt-0.5">Admin Panel</div>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <RouterLink
          v-for="item in navItems" :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all"
          :class="isActive(item.to)
            ? 'bg-primary-500 text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
        >
          <span>{{ item.icon }}</span>
          {{ item.label }}
        </RouterLink>
      </nav>

      <!-- User info + logout -->
      <div class="px-4 py-4 border-t border-gray-800 space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {{ auth.user?.name?.charAt(0) }}
          </div>
          <div class="min-w-0">
            <div class="text-white text-sm font-medium truncate">{{ auth.user?.name }}</div>
            <div class="text-gray-500 text-xs">Administrator</div>
          </div>
        </div>

        <!-- Tombol logout -->
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-medium"
        >
          <span>🚪</span> Keluar
        </button>

        <!-- Tombol kembali ke site -->
        <RouterLink to="/"
          class="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-all text-sm">
          <span>←</span> Kembali ke Site
        </RouterLink>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 md:ml-60">

      <!-- Mobile top bar -->
      <div class="md:hidden flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
        <div class="flex items-center gap-3">
          <span class="font-bold text-gray-900">Admin Panel</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex gap-3 text-xl">
            <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
              :class="isActive(item.to) ? 'opacity-100' : 'opacity-30'">
              {{ item.icon }}
            </RouterLink>
          </div>
          <button @click="handleLogout" class="text-red-400 text-sm font-medium ml-2">
            Keluar
          </button>
        </div>
      </div>

      <div class="p-4 md:p-8">
        <RouterView />
      </div>
    </main>

  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth   = useAuthStore()
const route  = useRoute()
const router = useRouter()

const navItems = [
  { to: '/admin',          icon: '📊', label: 'Dashboard' },
  { to: '/admin/bookings', icon: '📋', label: 'Booking'   },
  { to: '/admin/courts',   icon: '🏟️', label: 'Lapangan' },
  { to: '/admin/users',    icon: '👥', label: 'Pengguna'  },
]

function isActive(path) {
  return path === '/admin'
    ? route.path === '/admin'
    : route.path.startsWith(path)
}

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>