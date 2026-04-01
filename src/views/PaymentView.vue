<template>
  <DefaultLayout>
    <div class="max-w-lg mx-auto px-4 py-10">

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <template v-else-if="booking">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-extrabold text-gray-900">Pembayaran</h1>
          <p class="text-gray-400 mt-1">Selesaikan pembayaran untuk konfirmasi booking</p>
        </div>

        <!-- Detail Booking -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-5">
          <div class="bg-gray-50 px-5 py-3 border-b border-gray-100">
            <span class="text-xs text-gray-500 font-medium">Detail Booking</span>
          </div>
          <div class="px-5 py-4 space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Kode Booking</span>
              <span class="font-mono font-bold text-gray-900">{{ booking.booking_code }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Lapangan</span>
              <span class="font-semibold text-gray-900">{{ booking.court?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Tanggal</span>
              <span class="font-semibold text-gray-900">{{ booking.booking_date }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Jam</span>
              <span class="font-semibold text-gray-900">{{ booking.start_time }} – {{ booking.end_time }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Durasi</span>
              <span class="font-semibold text-gray-900">{{ booking.duration_hours }} jam</span>
            </div>
            <div class="border-t border-gray-100 pt-3 flex justify-between">
              <span class="font-bold text-gray-900">Total</span>
              <span class="font-extrabold text-primary-500 text-lg">{{ booking.total_formatted }}</span>
            </div>
          </div>
        </div>

        <!-- Status Payment -->
        <div v-if="paymentStatus" class="border rounded-2xl px-5 py-4 mb-5" :class="statusInfo.bg">
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ statusInfo.icon }}</span>
            <div>
              <div class="font-bold" :class="statusInfo.color">{{ statusInfo.label }}</div>
              <div v-if="paymentStatus.status === 'paid'" class="text-sm text-gray-500 mt-0.5">
                Via {{ paymentStatus.payment_method }} · {{ paymentStatus.paid_at }}
              </div>
              <div v-else-if="paymentStatus.status === 'pending'" class="text-sm text-amber-500 mt-0.5">
                Menunggu konfirmasi dari bank/dompet digital...
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{{ error }}</div>

        <!-- Tombol -->
        <template v-if="paymentStatus?.status === 'paid'">
          <div class="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-xl text-center text-sm mb-3">
            ✅ Pembayaran Lunas
          </div>
          <RouterLink to="/bookings"
            class="block w-full py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-center text-sm hover:bg-gray-50 transition-colors">
            Lihat Riwayat Booking
          </RouterLink>
        </template>

        <template v-else-if="booking.status !== 'cancelled'">
          <button @click="bayar" :disabled="loadingPay"
            class="w-full py-3.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/30 text-sm">
            <span v-if="loadingPay" class="flex items-center justify-center gap-2">
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Memuat...
            </span>
            <span v-else>💳 Bayar Sekarang — {{ booking.total_formatted }}</span>
          </button>

          <div class="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>🔒 Pembayaran aman</span>
            <span>•</span>
            <span>Didukung Midtrans</span>
            <span>•</span>
            <span>Berlaku 24 jam</span>
          </div>

          <div class="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span v-for="m in ['BCA','Mandiri','BNI','QRIS','GoPay','OVO','Dana']" :key="m"
              class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500">
              {{ m }}
            </span>
          </div>
        </template>

        <div v-else class="w-full py-3.5 bg-gray-100 text-gray-400 font-bold rounded-xl text-center text-sm">
          Booking Sudah Dibatalkan
        </div>
      </template>

    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'

const route       = useRoute()
const auth        = useAuthStore()
const booking     = ref(null)
const paymentStatus = ref(null)
const loading     = ref(true)
const loadingPay  = ref(false)
const error       = ref('')
let pollInterval  = null

const statusInfo = computed(() => ({
  paid:    { label: 'Pembayaran Berhasil', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: '✅' },
  pending: { label: 'Menunggu Pembayaran', color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200',     icon: '⏳' },
  failed:  { label: 'Pembayaran Gagal',    color: 'text-red-600',     bg: 'bg-red-50 border-red-200',         icon: '❌' },
  unpaid:  { label: 'Belum Dibayar',       color: 'text-gray-600',    bg: 'bg-gray-50 border-gray-200',       icon: '💳' },
}[paymentStatus.value?.status] ?? { label: '-', color: 'text-gray-600', bg: 'bg-gray-50', icon: '•' })
)

async function checkStatus() {
  try {
    const res = await api.get(`/payments/${route.params.bookingId}/status`)
    paymentStatus.value = res.data.payment
    if (paymentStatus.value?.status === 'paid') clearInterval(pollInterval)
  } catch {}
}

async function bayar() {
  loadingPay.value = true
  error.value      = ''
  try {
    const res = await api.post('/payments/snap-token', { booking_id: route.params.bookingId })
    const { snap_token, client_key } = res.data

    if (!window.snap) await loadMidtransScript(client_key)

    window.snap.pay(snap_token, {
      onSuccess: async () => {
        await checkStatus()
        pollInterval = setInterval(checkStatus, 3000)
      },
      onPending: () => {
        paymentStatus.value = { status: 'pending' }
        pollInterval = setInterval(checkStatus, 3000)
      },
      onError: () => { error.value = 'Pembayaran gagal. Silakan coba lagi.' },
    })
  } catch (e) {
    error.value = e.response?.data?.message || 'Gagal memproses pembayaran.'
  } finally {
    loadingPay.value = false
  }
}

function loadMidtransScript(clientKey) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    s.setAttribute('data-client-key', clientKey)
    s.onload = resolve; s.onerror = reject
    document.head.appendChild(s)
  })
}

onMounted(async () => {
  try {
    const res = await api.get(`/bookings/${route.params.bookingId}`)
    booking.value = res.data.booking
    await checkStatus()
  } finally {
    loading.value = false
  }
})

onUnmounted(() => clearInterval(pollInterval))
</script>