import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'


async function bootstrap() {
  const app   = createApp(App)
  const pinia = createPinia()

  // Urutan wajib: pinia dulu sebelum dipakai
  app.use(pinia)

  // Import store SETELAH pinia terpasang
  const { useAuthStore } = await import('@/stores/auth')
  const auth = useAuthStore()

  // Fetch user SEBELUM router & mount aktif
  if (auth.token) {
    await auth.fetchUser() // tunggu sampai selesai
  }

  // Baru pasang router dan mount
  app.use(router)
  app.mount('#app')
}

bootstrap()