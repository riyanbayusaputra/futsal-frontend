<template>
  <DefaultLayout>
    <div class="max-w-6xl mx-auto px-4 py-10">

      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900">Semua Lapangan</h1>
        <p class="text-gray-500 mt-1">Pilih lapangan dan booking sekarang</p>
      </div>

      <!-- Search + Filter -->
      <div class="flex flex-wrap gap-3 mb-8">
        <input
          v-model="search" type="text" placeholder="Cari lapangan..."
          class="flex-1 min-w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div class="flex gap-2">
          <button
            v-for="type in ['all','indoor','outdoor']" :key="type"
            @click="filterType = type"
            class="px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all capitalize"
            :class="filterType === type
              ? 'bg-primary-500 text-white border-primary-500'
              : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'"
          >
            {{ type === 'all' ? 'Semua' : type }}
          </button>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid md:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-gray-100 rounded-2xl h-72 animate-pulse"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="!filtered.length" class="text-center py-20 text-gray-400">
        <div class="text-6xl mb-4">⚽</div>
        <p class="text-lg font-medium">Lapangan tidak ditemukan</p>
        <p class="text-sm">Coba ubah filter atau kata kunci pencarian</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid md:grid-cols-3 gap-6">
        <RouterLink
          v-for="court in filtered" :key="court.id"
          :to="`/courts/${court.id}`"
          class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 block group"
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
            <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ court.description || '-' }}</p>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-primary-500 font-extrabold text-lg">{{ court.price_formatted }}</span>
                <span class="text-gray-400 text-sm">/jam</span>
              </div>
              <span class="bg-primary-500 group-hover:bg-primary-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">
                Booking →
              </span>
            </div>
          </div>
        </RouterLink>
      </div>

    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import api from '@/api'

const courts     = ref([])
const loading    = ref(true)
const search     = ref('')
const filterType = ref('all')

const filtered = computed(() =>
  courts.value.filter(c => {
    const matchType   = filterType.value === 'all' || c.type === filterType.value
    const matchSearch = c.name.toLowerCase().includes(search.value.toLowerCase())
    return matchType && matchSearch
  })
)

onMounted(async () => {
  try {
    const res = await api.get('/courts')
    courts.value = res.data.courts
  } finally {
    loading.value = false
  }
})
</script>