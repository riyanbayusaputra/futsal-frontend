<template>
  <DefaultLayout>
    <div class="max-w-4xl mx-auto px-4 py-10">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">Booking Saya</h1>
          <p class="text-gray-500 mt-1">Riwayat semua booking kamu</p>
        </div>

        <RouterLink
          to="/courts"
          class="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl text-sm"
        >
          + Booking Baru
        </RouterLink>
      </div>

      <!-- Filter -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button
          v-for="f in filters"
          :key="f.key"
          @click="filterStatus = f.key"
          class="px-4 py-2 rounded-xl text-sm font-semibold border"
          :class="
            filterStatus === f.key
              ? 'bg-primary-500 text-white border-primary-500'
              : 'bg-white text-gray-500 border-gray-200'
          "
        >
          {{ f.label }}
          <span class="ml-1 text-xs opacity-70">
            ({{ countByStatus(f.key) }})
          </span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-gray-100 rounded-2xl h-28 animate-pulse"
        />
      </div>

      <!-- Empty -->
      <div v-else-if="!filtered.length" class="text-center py-20">
        <div class="text-6xl mb-4">📋</div>
        <p class="text-gray-500 font-medium text-lg">
          {{ filterStatus === "all"
            ? "Belum ada booking"
            : "Tidak ada booking dengan status ini" }}
        </p>

        <RouterLink
          v-if="filterStatus === 'all'"
          to="/courts"
          class="mt-6 inline-block px-6 py-3 bg-primary-500 text-white rounded-xl"
        >
          Cari Lapangan ⚽
        </RouterLink>
      </div>

      <!-- Booking List -->
      <div v-else class="space-y-4">

        <div
          v-for="booking in filtered"
          :key="booking.id"
          @click="openDetail(booking)"
          class="bg-white border rounded-2xl p-5 shadow-sm cursor-pointer"
        >

          <div class="flex justify-between">

            <div>
              <h3 class="font-bold">
                {{ booking.court?.name || "Lapangan" }}
              </h3>

              <p class="text-sm text-gray-500">
                📅 {{ booking.booking_date }}
              </p>

              <p class="text-sm text-gray-500">
                🕐 {{ booking.start_time }} - {{ booking.end_time }}
              </p>

              <p class="text-xs text-gray-400 mt-1">
                {{ booking.booking_code }}
              </p>
            </div>

            <div class="text-right">
              <span
                class="px-3 py-1 rounded-full text-xs font-bold"
                :class="statusClass(booking.status)"
              >
                {{ statusLabel(booking.status) }}
              </span>

              <p class="font-bold mt-2">
                {{ booking.total_formatted || "Rp 0" }}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Modal Detail -->
    <Teleport to="body">
      <div
        v-if="selectedBooking"
        class="fixed inset-0 bg-black/50 flex items-center justify-center"
        @click.self="selectedBooking = null"
      >
        <div class="bg-white rounded-2xl w-full max-w-md p-6">

          <h2 class="font-bold text-lg mb-4">Detail Booking</h2>

          <p>Kode: {{ selectedBooking.booking_code }}</p>
          <p>Status: {{ statusLabel(selectedBooking.status) }}</p>
          <p>Tanggal: {{ selectedBooking.booking_date }}</p>
          <p>Jam: {{ selectedBooking.start_time }} - {{ selectedBooking.end_time }}</p>

          <p class="font-bold mt-4">
            {{ selectedBooking.total_formatted }}
          </p>

          <div v-if="cancelSuccess" class="text-green-600 mt-2">
            {{ cancelSuccess }}
          </div>

          <div v-if="cancelError" class="text-red-500 mt-2">
            {{ cancelError }}
          </div>

          <div class="flex gap-3 mt-6">

            <button
              v-if="selectedBooking.status === 'pending'"
              @click="cancelBooking(selectedBooking)"
              :disabled="cancelling"
              class="flex-1 border border-red-300 text-red-500 py-2 rounded-xl"
            >
              {{ cancelling ? "Membatalkan..." : "Batalkan Booking" }}
            </button>

            <button
              @click="selectedBooking = null"
              class="flex-1 bg-primary-500 text-white py-2 rounded-xl"
            >
              Tutup
            </button>

          </div>

        </div>
      </div>
    </Teleport>

  </DefaultLayout>
</template>
<script setup>
import { ref, computed, onMounted } from "vue"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import api from "@/api"

const bookings = ref([])
const loading = ref(true)
const filterStatus = ref("all")
const selectedBooking = ref(null)

const cancelling = ref(false)
const cancelSuccess = ref("")
const cancelError = ref("")

const filters = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "⏳ Menunggu" },
  { key: "confirmed", label: "✅ Dikonfirmasi" },
  { key: "cancelled", label: "❌ Dibatalkan" },
]

// ✅ SAFE FILTER (anti error)
const filtered = computed(() => {
  if (!Array.isArray(bookings.value)) return []

  if (filterStatus.value === "all") return bookings.value
  return bookings.value.filter(b => b.status === filterStatus.value)
})

function countByStatus(key) {
  if (!Array.isArray(bookings.value)) return 0

  if (key === "all") return bookings.value.length
  return bookings.value.filter(b => b.status === key).length
}

function statusClass(s) {
  return {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
  }[s] || "bg-gray-100 text-gray-500"
}

function statusLabel(s) {
  return {
    pending: "⏳ Menunggu",
    confirmed: "✅ Dikonfirmasi",
    cancelled: "❌ Dibatalkan",
  }[s] || s
}

function openDetail(booking) {
  selectedBooking.value = booking
  cancelSuccess.value = ""
  cancelError.value = ""
}

async function fetchBookings() {
  loading.value = true
  try {
    const res = await api.get("/bookings")

    console.log("BOOKINGS:", res.data)

    // ✅ FIX UTAMA
    bookings.value = res.data.bookings || []

  } catch (e) {
    console.error("FETCH ERROR:", e.response)
    bookings.value = []
  } finally {
    loading.value = false
  }
}

async function cancelBooking(booking) {
  cancelling.value = true
  cancelError.value = ""
  cancelSuccess.value = ""

  try {
    await api.patch(`/admin/bookings/${booking.id}/cancel`)

    cancelSuccess.value = "Booking berhasil dibatalkan."

    await fetchBookings()

    selectedBooking.value =
      bookings.value.find(b => b.id === booking.id)

  } catch (e) {
    console.error("CANCEL ERROR:", e.response)

    cancelError.value =
      e.response?.data?.message || "Gagal membatalkan."
  } finally {
    cancelling.value = false
  }
}

onMounted(fetchBookings)
</script>