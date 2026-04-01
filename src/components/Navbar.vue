<template>
  <nav class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-gray-100">
    <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 font-bold text-xl text-primary-500">
        <span>⚽</span><span>FutsalKita</span>
      </RouterLink>

      <!-- Desktop menu -->
      <div class="hidden md:flex items-center gap-6">
        <RouterLink to="/courts"
          class="text-gray-600 hover:text-primary-500 font-medium transition-colors">
          Lapangan
        </RouterLink>

        <template v-if="auth.isLoggedIn">
          <RouterLink to="/bookings"
            class="text-gray-600 hover:text-primary-500 font-medium transition-colors">
            Booking Saya
          </RouterLink>
          <RouterLink v-if="auth.isAdmin" to="/admin"
            class="text-gray-600 hover:text-primary-500 font-medium transition-colors">
            Admin
          </RouterLink>

          <!-- User dropdown -->
          <div class="relative" ref="dropdownRef">
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {{ auth.user?.name?.charAt(0) }}
              </div>
              <span class="text-sm font-medium text-gray-700">{{ firstName }}</span>
              <span class="text-gray-400 text-xs">▾</span>
            </button>

            <!-- Dropdown -->
            <div v-if="dropdownOpen"
              class="absolute right-0 top-12 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-50">
              <div class="px-4 py-3 border-b border-gray-50">
                <div class="font-semibold text-gray-900 text-sm">{{ auth.user?.name }}</div>
                <div class="text-gray-400 text-xs mt-0.5">{{ auth.user?.email }}</div>
              </div>
              <RouterLink to="/bookings" @click="dropdownOpen = false"
                class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                📋 Booking Saya
              </RouterLink>
              <RouterLink v-if="auth.isAdmin" to="/admin" @click="dropdownOpen = false"
                class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                ⚙️ Dashboard Admin
              </RouterLink>
              <div class="border-t border-gray-50">
                <button @click="handleLogout"
                  class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  🚪 Keluar
                </button>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <RouterLink to="/login"
            class="text-gray-600 hover:text-primary-500 font-medium transition-colors">
            Masuk
          </RouterLink>
          <RouterLink to="/register"
            class="px-4 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors">
            Daftar
          </RouterLink>
        </template>
      </div>

      <!-- Mobile hamburger -->
      <button @click="menuOpen = !menuOpen" class="md:hidden p-2 space-y-1.5">
        <span class="block w-5 h-0.5 bg-gray-700 transition-all"
          :class="menuOpen ? 'rotate-45 translate-y-2' : ''"></span>
        <span class="block w-5 h-0.5 bg-gray-700 transition-all"
          :class="menuOpen ? 'opacity-0' : ''"></span>
        <span class="block w-5 h-0.5 bg-gray-700 transition-all"
          :class="menuOpen ? '-rotate-45 -translate-y-2' : ''"></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="menuOpen" class="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1">
        <RouterLink to="/courts" @click="menuOpen = false"
          class="px-3 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50">
          🏟️ Lapangan
        </RouterLink>

        <template v-if="auth.isLoggedIn">
          <RouterLink to="/bookings" @click="menuOpen = false"
            class="px-3 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50">
            📋 Booking Saya
          </RouterLink>
          <RouterLink v-if="auth.isAdmin" to="/admin" @click="menuOpen = false"
            class="px-3 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50">
            ⚙️ Dashboard Admin
          </RouterLink>

          <!-- User info mobile -->
          <div class="mx-3 my-2 p-3 bg-gray-50 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                {{ auth.user?.name?.charAt(0) }}
              </div>
              <div>
                <div class="font-semibold text-gray-900 text-sm">{{ auth.user?.name }}</div>
                <div class="text-gray-400 text-xs">{{ auth.user?.email }}</div>
              </div>
            </div>
          </div>

          <button @click="handleLogout"
            class="px-3 py-2.5 text-left text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors">
            🚪 Keluar
          </button>
        </template>

        <template v-else>
          <RouterLink to="/login" @click="menuOpen = false"
            class="px-3 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50">
            Masuk
          </RouterLink>
          <RouterLink to="/register" @click="menuOpen = false"
            class="mx-0 py-2.5 px-3 bg-primary-500 text-white font-semibold rounded-xl text-center hover:bg-primary-600">
            Daftar Sekarang
          </RouterLink>
        </template>
      </div>
    </Transition>
  </nav>

  <!-- Spacer navbar fixed -->
  <div class="h-16"></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth        = useAuthStore()
const router      = useRouter()
const menuOpen    = ref(false)
const dropdownOpen = ref(false)
const dropdownRef  = ref(null)

const firstName = computed(() => auth.user?.name?.split(' ')[0] ?? '')

async function handleLogout() {
  dropdownOpen.value = false
  menuOpen.value     = false
  auth.logout()
  router.push('/')
}

// Tutup dropdown kalau klik di luar
function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>