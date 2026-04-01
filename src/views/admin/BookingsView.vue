<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/api'

const bookings = ref([])
const loading = ref(false)
const filterStatus = ref('all')
const selectedBooking = ref(null)
const meta = ref({})

const filters = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'cancelled', label: 'Cancelled' }
]

// fetch
async function fetchBookings() {
  loading.value = true
  try {
    const res = await api.get('/admin/bookings', {
      params: { status: filterStatus.value }
    })

    bookings.value = res.data.bookings || []
    meta.value     = res.data.meta || {}

  } catch (e) {
    console.error(e.response)
    bookings.value = []
  } finally {
    loading.value = false
  }
}

// action
async function confirmBooking(b) {
  await api.patch(`/admin/bookings/${b.id}/confirm`)
  await fetchBookings()
  selectedBooking.value = null
}

async function cancelBooking(b) {
  await api.patch(`/admin/bookings/${b.id}/cancel`)
  await fetchBookings()
  selectedBooking.value = null
}

// style
function statusClass(s) {
  return {
    pending: 'text-yellow-500',
    confirmed: 'text-green-500',
    cancelled: 'text-red-500'
  }[s] || ''
}

// lifecycle
onMounted(fetchBookings)

// auto refresh saat filter berubah
watch(filterStatus, fetchBookings)
</script>

<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Manajemen Booking</h1>

        <!-- Filter -->
        <div class="mb-4">
            <label class="block text-sm mb-1">Filter Status:</label>
            <select v-model="filterStatus" class="border rounded-lg px-3 py-2">
                <option v-for="f in filters" :key="f.key" :value="f.key">
                    {{ f.label }}
                </option>
            </select>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-10">Memuat booking...</div>

        <!-- Empty -->
        <div v-else-if="bookings.length === 0" class="text-center py-10">
            Tidak ada booking
        </div>

        <!-- Table -->
        <table v-else class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-100">
                    <th class="border px-4 py-2">ID</th>
                    <th class="border px-4 py-2">Penyewa</th>
                    <th class="border px-4 py-2">Lapangan</th>
                    <th class="border px-4 py-2">Waktu</th>
                    <th class="border px-4 py-2">Total</th>
                    <th class="border px-4 py-2">Status</th>
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="b in bookings"
                    :key="b.id"
                    @click="selectedBooking = b"
                    class="cursor-pointer hover:bg-gray-50"
                >
                    <td class="border px-4 py-2">{{ b.id }}</td>
                    <td class="border px-4 py-2">{{ b.user?.name || "-" }}</td>
                    <td class="border px-4 py-2">{{ b.court?.name || "-" }}</td>
                    <td class="border px-4 py-2">
                        {{ b.start_time }} - {{ b.end_time }}
                    </td>
                    <td class="border px-4 py-2">{{ b.total_formatted }}</td>
                    <td class="border px-4 py-2">
                        <span :class="statusClass(b.status)">
                            {{ b.status }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- MODAL -->
        <div
            v-if="selectedBooking"
            class="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
            <div class="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 class="font-bold text-lg mb-3">
                    Booking #{{ selectedBooking.id }}
                </h2>

                <p>👤 {{ selectedBooking.user?.name }}</p>
                <p>🏟️ {{ selectedBooking.court?.name }}</p>
                <p>
                    🕐 {{ selectedBooking.start_time }} -
                    {{ selectedBooking.end_time }}
                </p>
                <p>💰 {{ selectedBooking.total_formatted }}</p>
                <p>📌 {{ selectedBooking.status }}</p>

                <div class="flex gap-2 mt-4">
                    <button
                        v-if="selectedBooking.status === 'pending'"
                        @click="confirmBooking(selectedBooking)"
                        class="bg-green-500 text-white px-3 py-2 rounded"
                    >
                        Confirm
                    </button>

                    <button
                        v-if="selectedBooking.status !== 'cancelled'"
                        @click="cancelBooking(selectedBooking)"
                        class="bg-red-500 text-white px-3 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        @click="selectedBooking = null"
                        class="bg-gray-300 px-3 py-2 rounded"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
