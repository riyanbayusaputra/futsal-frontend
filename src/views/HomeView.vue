<template>
  <DefaultLayout>

    <!-- ===== HERO ===== -->
    <section class="relative min-h-[92vh] flex items-center overflow-hidden bg-gray-950">
      <div class="absolute inset-0 opacity-10"
        style="background-image: repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.05) 60px,rgba(255,255,255,.05) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.05) 60px,rgba(255,255,255,.05) 61px)">
      </div>
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500 rounded-full opacity-10 blur-3xl"></div>
      <div class="absolute bottom-1/4 left-1/4 w-64 h-64 bg-emerald-400 rounded-full opacity-5 blur-3xl"></div>

      <div class="relative max-w-6xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-500 text-sm font-medium mb-6">
            <span class="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
            Slot tersedia hari ini
          </div>
          <h1 class="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Booking Futsal<br/>
            <span class="text-primary-500">Lebih Mudah</span><br/>
            dari Sebelumnya
          </h1>
          <p class="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
            Pilih lapangan, tentukan jadwal, bayar online — selesai dalam 2 menit.
          </p>
          <div class="flex flex-wrap gap-3">
            <RouterLink to="/courts"
              class="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-primary-500/30">
              Booking Sekarang ⚽
            </RouterLink>
            <a href="#cara-kerja"
              class="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 font-semibold rounded-xl transition-colors">
              Cara Kerja →
            </a>
          </div>
        </div>

        <!-- Mock booking card -->
        <div class="hidden md:block">
          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl max-w-sm ml-auto">
            <div class="flex items-center justify-between mb-4">
              <span class="font-bold text-white text-sm">Booking Lapangan A</span>
              <span class="text-xs bg-primary-500/20 text-primary-500 px-2 py-0.5 rounded-full font-medium">Indoor</span>
            </div>
            <div class="text-gray-400 text-sm mb-4">📅 Sabtu, 28 Juni 2025</div>
            <div class="grid grid-cols-4 gap-1.5 mb-5">
              <div v-for="(slot, i) in mockSlots" :key="i"
                class="py-1.5 rounded-lg text-center text-xs font-medium"
                :class="i === 2 || i === 3
                  ? 'bg-primary-500 text-white'
                  : i === 0 || i === 4
                    ? 'bg-gray-700 text-gray-500 line-through'
                    : 'bg-gray-800 text-gray-400'">
                {{ slot }}
              </div>
            </div>
            <div class="border-t border-gray-800 pt-4 flex items-center justify-between">
              <div>
                <div class="text-xs text-gray-500">Total</div>
                <div class="text-white font-bold">Rp 200.000</div>
              </div>
              <button class="px-4 py-2 bg-primary-500 text-white text-sm font-bold rounded-lg">
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== STATS ===== -->
    <section class="bg-primary-500 py-12">
      <div class="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center text-white">
        <div>
          <div class="text-4xl font-extrabold">{{ animatedStats.courts }}+</div>
          <div class="text-primary-100 mt-1 font-medium">Lapangan</div>
        </div>
        <div>
          <div class="text-4xl font-extrabold">{{ animatedStats.bookings }}+</div>
          <div class="text-primary-100 mt-1 font-medium">Total Booking</div>
        </div>
        <div>
          <div class="text-4xl font-extrabold">{{ animatedStats.users }}+</div>
          <div class="text-primary-100 mt-1 font-medium">Pengguna Aktif</div>
        </div>
      </div>
    </section>

    <!-- ===== CARA KERJA ===== -->
    <section id="cara-kerja" class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900">Cara Kerjanya Simpel</h2>
          <p class="text-gray-500 mt-3 text-lg">3 langkah dan lapangan siap kamu pakai</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="step in steps" :key="step.step" class="text-center relative">
            <div class="w-20 h-20 bg-primary-50 border-2 border-primary-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              {{ step.icon }}
            </div>
            <div class="absolute top-0 right-1/4 bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {{ step.step }}
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ step.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== LAPANGAN PILIHAN ===== -->
    <section v-if="courts.length" class="py-20 bg-gray-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900">Lapangan Pilihan</h2>
            <p class="text-gray-500 mt-2">Lapangan terbaik yang siap kamu booking</p>
          </div>
          <RouterLink to="/courts" class="text-primary-500 font-semibold hover:underline hidden md:block">
            Lihat semua →
          </RouterLink>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <RouterLink
            v-for="court in courts" :key="court.id"
            :to="`/courts/${court.id}`"
            class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 block group"
          >
            <div class="h-44 bg-primary-50 flex items-center justify-center relative overflow-hidden">
              <img v-if="court.photo_url" :src="court.photo_url" :alt="court.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
              <span v-else class="text-6xl">⚽</span>
              <span class="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                :class="court.type === 'indoor' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'">
                {{ court.type }}
              </span>
            </div>
            <div class="p-5">
              <h3 class="font-bold text-gray-900 text-lg mb-1">{{ court.name }}</h3>
              <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ court.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-primary-500 font-extrabold">
                  {{ court.price_formatted }}<span class="text-gray-400 font-normal text-sm">/jam</span>
                </span>
                <span class="bg-primary-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">Booking</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ===== FITUR ===== -->
    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900">Kenapa FutsalKita?</h2>
          <p class="text-gray-500 mt-3 text-lg">Fitur lengkap untuk pengalaman booking terbaik</p>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="feat in features" :key="feat.title"
            class="p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200 group">
            <div class="text-3xl mb-4">{{ feat.icon }}</div>
            <h3 class="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors">
              {{ feat.title }}
            </h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONI ===== -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900">Kata Mereka</h2>
          <p class="text-gray-500 mt-3">Ribuan pengguna sudah percaya FutsalKita</p>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="t in testimonials" :key="t.name"
            class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center gap-1 text-amber-400 mb-4">⭐⭐⭐⭐⭐</div>
            <p class="text-gray-600 text-sm leading-relaxed mb-5">"{{ t.text }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                {{ t.avatar }}
              </div>
              <div>
                <div class="font-semibold text-gray-900 text-sm">{{ t.name }}</div>
                <div class="text-gray-400 text-xs">{{ t.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section class="py-20 bg-gray-950 relative overflow-hidden">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500 rounded-full opacity-10 blur-3xl"></div>
      <div class="relative max-w-2xl mx-auto px-4 text-center">
        <div class="text-5xl mb-6">⚽</div>
        <h2 class="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Siap Main Futsal<br/>Hari Ini?
        </h2>
        <p class="text-gray-400 text-lg mb-8">Daftar gratis dan langsung booking lapangan favoritmu.</p>
        <div class="flex flex-wrap gap-3 justify-center">
          <RouterLink to="/register"
            class="px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-primary-500/30">
            Daftar Gratis
          </RouterLink>
          <RouterLink to="/courts"
            class="px-8 py-3.5 border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold rounded-xl transition-colors">
            Lihat Lapangan
          </RouterLink>
        </div>
      </div>
    </section>

  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import api from '@/api'

const courts        = ref([])
const animatedStats = ref({ courts: 0, bookings: 0, users: 0 })

const mockSlots  = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00']

const steps = [
  { step: '01', icon: '🏟️', title: 'Pilih Lapangan', desc: 'Browse lapangan yang tersedia, lihat foto, fasilitas, dan harga per jam.' },
  { step: '02', icon: '🗓️', title: 'Tentukan Jadwal', desc: 'Pilih tanggal dan slot waktu yang masih kosong secara real-time.' },
  { step: '03', icon: '✅', title: 'Bayar & Konfirmasi', desc: 'Selesaikan pembayaran online dan konfirmasi langsung dikirim ke kamu.' },
]

const features = [
  { icon: '⚡', title: 'Booking Instan',      desc: 'Pesan lapangan dalam hitungan detik, tanpa antri dan tanpa repot.' },
  { icon: '🗓️', title: 'Jadwal Real-time',   desc: 'Lihat ketersediaan slot langsung, tidak perlu telepon dulu.' },
  { icon: '💳', title: 'Bayar Online',        desc: 'Pembayaran aman via transfer bank, QRIS, dan dompet digital.' },
  { icon: '🔔', title: 'Notifikasi Otomatis', desc: 'Konfirmasi booking langsung dikirim ke WhatsApp dan email kamu.' },
  { icon: '🏟️', title: 'Multi Lapangan',     desc: 'Tersedia lapangan indoor dan outdoor dengan berbagai ukuran.' },
  { icon: '📊', title: 'Riwayat Lengkap',    desc: 'Pantau semua histori booking kamu dalam satu dashboard.' },
]

const testimonials = [
  { name: 'Rizky Pratama',   role: 'Komunitas Futsal Bandung', avatar: 'R', text: 'Booking sekarang gampang banget! Dulu harus WA admin dulu, sekarang langsung jadi.' },
  { name: 'Siti Nurhaliza',  role: 'Mahasiswi ITB',            avatar: 'S', text: 'Suka banget fitur cek slot real-time nya. Ga perlu nebak-nebak lapangan kosong atau engga.' },
  { name: 'Deni Saputra',    role: 'Kapten Tim Garuda FC',     avatar: 'D', text: 'Udah pakai 3 bulan, belum pernah kecewa. Konfirmasi cepet, lapangannya juga bersih.' },
]

function animateStats(target) {
  const steps = 40
  const duration = 1500
  let step = 0
  const timer = setInterval(() => {
    step++
    const ease = 1 - Math.pow(1 - step / steps, 3)
    animatedStats.value = {
      courts:   Math.round(target.courts   * ease),
      bookings: Math.round(target.bookings * ease),
      users:    Math.round(target.users    * ease),
    }
    if (step >= steps) clearInterval(timer)
  }, duration / steps)
}

onMounted(async () => {
  try {
    const res = await api.get('/courts')
    courts.value = res.data.courts.slice(0, 3)
    animateStats({ courts: res.data.courts.length, bookings: 1240, users: 380 })
  } catch {}
})
</script>