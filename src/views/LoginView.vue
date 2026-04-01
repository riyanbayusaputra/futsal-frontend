<template>
  <DefaultLayout>
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <h1 class="text-2xl font-extrabold text-gray-900 mb-1">Masuk</h1>
        <p class="text-gray-400 mb-6">Selamat datang kembali 👋</p>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
          {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input v-model="form.email" type="email" placeholder="contoh@email.com"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input v-model="form.password" type="password" placeholder="Masukkan password"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
        </div>

        <button @click="handleLogin" :disabled="loading"
          class="w-full mt-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors">
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>

        <p class="text-center text-sm text-gray-400 mt-5">
          Belum punya akun?
          <RouterLink to="/register" class="text-primary-500 font-semibold">Daftar sekarang</RouterLink>
        </p>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const auth    = useAuthStore()
const router  = useRouter()
const loading = ref(false)
const error   = ref('')
const form    = reactive({ email: '', password: '' })

async function handleLogin() {
  error.value   = ''
  loading.value = true
  try {
    await auth.login(form.email, form.password)
    router.push(auth.isAdmin ? '/admin' : '/courts')
  } catch (e) {
    error.value = e.response?.data?.message || 'Login gagal, coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>