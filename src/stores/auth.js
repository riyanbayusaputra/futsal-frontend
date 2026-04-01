import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user       = ref(null)
  const token      = ref(localStorage.getItem('token'))
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')

  async function fetchUser() {
    if (!token.value) return
    try {
      const res  = await api.get('/me')
      user.value = res.data.user
    } catch {
      // Token tidak valid, bersihkan
      logout()
    }
  }

  async function login(email, password) {
    const res    = await api.post('/login', { email, password })
    token.value  = res.data.token
    user.value   = res.data.user
    localStorage.setItem('token', res.data.token)
    return res.data
  }

  async function register(payload) {
    const res    = await api.post('/register', payload)
    token.value  = res.data.token
    user.value   = res.data.user
    localStorage.setItem('token', res.data.token)
    return res.data
  }

  function logout() {
    // Hit API logout (tidak perlu tunggu)
    if (token.value) {
      api.post('/logout').catch(() => {})
    }
    // Bersihkan semua state
    token.value = null
    user.value  = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    fetchUser,
    login,
    register,
    logout,
  }
})