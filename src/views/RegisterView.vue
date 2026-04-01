<template>
  <DefaultLayout>
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <h1 class="text-2xl font-extrabold text-gray-900 mb-1">Daftar Akun</h1>
        <p class="text-gray-400 mb-6">Buat akun untuk mulai booking ⚽</p>

        <div v-if="errors.general" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
          {{ errors.general }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
            <input v-model="form.name" type="text" placeholder="Nama kamu"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input v-model="form.email" type="email" placeholder="contoh@email.com"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              No. HP <span class="text-gray-400 font-normal">(opsional)</span>
            </label>
            <input v-model="form.phone" type="tel" placeholder="08xxxxxxxxxx"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input v-model="form.password" type="password" placeholder="Min. 8 karakter"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password</label>
            <input v-model="form.password_confirmation" type="password" placeholder="Ulangi password"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
        </div>

        <button @click="handleRegister" :disabled="loading"
          class="w-full mt-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors">
          {{ loading ? 'Mendaftarkan...' : 'Daftar Sekarang' }}
        </button>

        <p class="text-center text-sm text-gray-400 mt-5">
          Sudah punya akun?
          <RouterLink to="/login" class="text-primary-500 font-semibold">Masuk</RouterLink>
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
const errors  = reactive({})
const form    = reactive({
  name: '', email: '', phone: '',
  password: '', password_confirmation: ''
})

async function handleRegister() {
  Object.keys(errors).forEach(k => delete errors[k])
  loading.value = true
  try {
    await auth.register(form)
    router.push('/courts')
  } catch (e) {
    if (e.response?.status === 422) {
      Object.assign(errors, e.response.data.errors ?? {})
    } else {
      errors.general = 'Registrasi gagal, coba lagi.'
    }
  } finally {
    loading.value = false
  }
}
</script>