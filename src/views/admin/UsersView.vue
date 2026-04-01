<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900">Pengguna</h1>
        <p class="text-gray-400 text-sm mt-0.5">{{ users.length }} pengguna terdaftar</p>
      </div>
    </div>

    <input v-model="search" type="text" placeholder="Cari nama atau email..."
      class="w-full md:w-80 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-6"/>

    <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div v-if="loading" class="p-10 text-center">
        <div class="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>

      <div v-else-if="!filtered.length" class="text-center py-12 text-gray-400">
        <div class="text-4xl mb-2">👥</div><p>Tidak ada pengguna ditemukan</p>
      </div>

      <table v-else class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <th class="text-left px-5 py-3 font-semibold">Pengguna</th>
            <th class="text-left px-5 py-3 font-semibold">No. HP</th>
            <th class="text-left px-5 py-3 font-semibold">Total Booking</th>
            <th class="text-left px-5 py-3 font-semibold">Bergabung</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="u in filtered" :key="u.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {{ u.name.charAt(0) }}
                </div>
                <div>
                  <div class="font-semibold text-gray-900">{{ u.name }}</div>
                  <div class="text-gray-400 text-xs">{{ u.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-5 py-4 text-gray-500">{{ u.phone ?? '-' }}</td>
            <td class="px-5 py-4">
              <span class="font-bold text-gray-900">{{ u.bookings_count }}</span>
              <span class="text-gray-400 text-xs ml-1">booking</span>
            </td>
            <td class="px-5 py-4 text-gray-400 text-xs">{{ u.joined }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api'

const users   = ref([])
const loading = ref(true)
const search  = ref('')

const filtered = computed(() =>
  users.value.filter(u =>
    u.name.toLowerCase().includes(search.value.toLowerCase()) ||
    u.email.toLowerCase().includes(search.value.toLowerCase())
  )
)

onMounted(async () => {
  try { const res = await api.get('/admin/users'); users.value = res.data.users }
  finally { loading.value = false }
})
</script>