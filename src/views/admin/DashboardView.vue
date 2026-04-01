<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-extrabold text-gray-900">Dashboard</h1>
      <p class="text-gray-400 mt-1">Selamat datang kembali, {{ auth.user?.name }}!</p>
    </div>

    <!-- Stat cards skeleton -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div v-for="i in 4" :key="i" class="bg-gray-100 rounded-2xl h-28 animate-pulse"></div>
    </div>

    <template v-else>
      <!-- Stat Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div class="text-2xl mb-1">📋</div>
          <div class="text-2xl font-extrabold text-gray-900">{{ stats.total_bookings }}</div>
          <div class="text-sm text-gray-400 mt-0.5">Total Booking</div>
        </div>
        <div class="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <div class="text-2xl mb-1">⏳</div>
          <div class="text-2xl font-extrabold text-amber-600">{{ stats.pending_bookings }}</div>
          <div class="text-sm text-amber-400 mt-0.5">Menunggu</div>
        </div>
        <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
          <div class="text-2xl mb-1">✅</div>
          <div class="text-2xl font-extrabold text-emerald-600">{{ stats.confirmed_bookings }}</div>
          <div class="text-sm text-emerald-400 mt-0.5">Dikonfirmasi</div>
        </div>
        <div class="bg-primary-50 border border-primary-100 rounded-2xl p-5">
          <div class="text-2xl mb-1">💰</div>
          <div class="text-base font-extrabold text-primary-600 leading-tight">{{ stats.revenue_formatted }}</div>
          <div class="text-sm text-primary-400 mt-0.5">Pendapatan</div>
        </div>
      </div>

      <!-- Chart + Info -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">

        <!-- Bar chart -->
        <div class="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 class="font-bold text-gray-900 mb-1">Booking 7 Hari Terakhir</h2>
          <p class="text-sm text-gray-400 mb-5">Jumlah booking per hari</p>
          <div v-if="weeklyBookings.length" class="flex items-end gap-2 h-32">
            <div
              v-for="day in weeklyBookings" :key="day.date"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <span class="text-xs font-bold text-gray-700">{{ day.total }}</span>
              <div
                class="w-full bg-primary-500 hover:bg-primary-600 rounded-t-md transition-all duration-500"
                :style="{ height: Math.max((day.total / maxBooking) * 100, 6) + '%' }"
              ></div>
              <span class="text-xs text-gray-400">
                {{ new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' }) }}
              </span>
            </div>
          </div>
          <div v-else class="text-center text-gray-300 py-8 text-sm">Belum ada data</div>
        </div>

        <!-- Info singkat -->
        <div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h2 class="font-bold text-gray-900">Info Singkat</h2>
          <div class="flex justify-between py-3 border-b border-gray-50 text-sm">
            <span class="text-gray-500">🏟️ Total Lapangan</span>
            <span class="font-bold text-gray-900">{{ stats.total_courts }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-gray-50 text-sm">
            <span class="text-gray-500">👥 Total Pengguna</span>
            <span class="font-bold text-gray-900">{{ stats.total_users }}</span>
          </div>
          <div class="flex justify-between py-3 text-sm">
            <span class="text-gray-500">❌ Dibatalkan</span>
            <span class="font-bold text-red-400">
              {{ stats.total_bookings - stats.confirmed_bookings - stats.pending_bookings }}
            </span>
          </div>
          <RouterLink to="/admin/bookings"
            class="mt-auto block text-center py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl text-sm transition-colors">
            Kelola Booking →
          </RouterLink>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 class="font-bold text-gray-900">Booking Terbaru</h2>
          <RouterLink to="/admin/bookings" class="text-sm text-primary-500 font-semibold hover:underline">
            Lihat semua →
          </RouterLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th class="text-left px-5 py-3 font-semibold">Kode</th>
                <th class="text-left px-5 py-3 font-semibold">Pemesan</th>
                <th class="text-left px-5 py-3 font-semibold">Lapangan</th>
                <th class="text-left px-5 py-3 font-semibold">Tanggal</th>
                <th class="text-left px-5 py-3 font-semibold">Total</th>
                <th class="text-left px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="b in recentBookings" :key="b.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-5 py-4 font-mono text-xs text-gray-400">{{ b.booking_code }}</td>
                <td class="px-5 py-4">
                  <div class="font-semibold text-gray-900">{{ b.user?.name }}</div>
                  <div class="text-gray-400 text-xs">{{ b.user?.email }}</div>
                </td>
                <td class="px-5 py-4 text-gray-700">{{ b.court?.name }}</td>
                <td class="px-5 py-4 text-gray-500">
                  <div>{{ b.booking_date }}</div>
                  <div class="text-xs">{{ b.start_time }} – {{ b.end_time }}</div>
                </td>
                <td class="px-5 py-4 font-bold text-gray-900">{{ b.total_formatted }}</td>
                <td class="px-5 py-4">
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold" :class="statusClass(b.status)">
                    {{ statusLabel(b.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'

const auth           = useAuthStore()
const loading        = ref(true)
const stats          = ref({})
const weeklyBookings = ref([])
const recentBookings = ref([])

const maxBooking = computed(() =>
  Math.max(...weeklyBookings.value.map(w => w.total), 1)
)

onMounted(async () => {
  try {
    const [statsRes, bookingsRes] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/bookings', { params: { per_page: 5 } }),
    ])
    stats.value          = statsRes.data.stats
    weeklyBookings.value = statsRes.data.weekly_bookings
    recentBookings.value = bookingsRes.data.bookings
  } finally {
    loading.value = false
  }
})

function statusClass(s) {
  return {
    pending:   'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-500',
  }[s] ?? 'bg-gray-100 text-gray-500'
}

function statusLabel(s) {
  return { pending: 'Menunggu', confirmed: 'Dikonfirmasi', cancelled: 'Dibatalkan' }[s] ?? s
}
</script>