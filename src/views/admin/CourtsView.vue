<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900">Kelola Lapangan</h1>
        <p class="text-gray-400 text-sm mt-0.5">{{ courts.length }} lapangan terdaftar</p>
      </div>
      <button @click="openAdd"
        class="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl text-sm transition-colors">
        + Tambah Lapangan
      </button>
    </div>

    <div v-if="successMsg" class="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 mb-5">
      ✅ {{ successMsg }}
    </div>

    <!-- Form tambah/edit -->
    <div v-if="showForm" class="bg-white border border-primary-100 rounded-2xl p-6 shadow-sm mb-6">
      <h2 class="font-bold text-gray-900 mb-5">{{ editingCourt ? 'Edit Lapangan' : 'Tambah Lapangan Baru' }}</h2>
      <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{{ errorMsg }}</div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lapangan</label>
          <input v-model="form.name" type="text" placeholder="cth: Lapangan A"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Tipe</label>
          <select v-model="form.type"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Harga per Jam (Rp)</label>
          <input v-model="form.price_per_hour" type="number" placeholder="cth: 100000"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Foto Lapangan</label>
          <input type="file" accept="image/*" @change="handlePhoto"
            class="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-600 file:font-semibold hover:file:bg-primary-100"/>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
          <textarea v-model="form.description" rows="3" placeholder="Deskripsi singkat lapangan..."
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"></textarea>
        </div>
      </div>

      <div class="flex gap-3 mt-5">
        <button @click="saveCourt" :disabled="saving"
          class="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl text-sm disabled:opacity-50 transition-colors">
          {{ saving ? 'Menyimpan...' : editingCourt ? 'Simpan Perubahan' : 'Tambah Lapangan' }}
        </button>
        <button @click="showForm = false"
          class="px-5 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
          Batal
        </button>
      </div>
    </div>

    <!-- Grid -->
    <div v-if="loading" class="grid md:grid-cols-3 gap-4">
      <div v-for="i in 3" :key="i" class="bg-gray-100 rounded-2xl h-48 animate-pulse"></div>
    </div>

    <div v-else-if="!courts.length" class="text-center py-16 text-gray-400">
      <div class="text-4xl mb-3">🏟️</div><p>Belum ada lapangan. Tambahkan yang pertama!</p>
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="court in courts" :key="court.id" class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div class="h-36 bg-primary-50 flex items-center justify-center relative">
          <img v-if="court.photo_url" :src="court.photo_url" :alt="court.name" class="w-full h-full object-cover"/>
          <span v-else class="text-5xl">⚽</span>
          <span class="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full capitalize"
            :class="court.type === 'indoor' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'">
            {{ court.type }}
          </span>
          <span class="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full"
            :class="court.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'">
            {{ court.is_active ? 'Aktif' : 'Nonaktif' }}
          </span>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-gray-900">{{ court.name }}</h3>
          <p class="text-primary-500 font-bold text-sm mt-0.5">{{ court.price_formatted }}/jam</p>
          <p class="text-gray-400 text-xs mt-1 line-clamp-2">{{ court.description || '-' }}</p>
          <div class="flex gap-2 mt-4">
            <button @click="openEdit(court)"
              class="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              ✏️ Edit
            </button>
            <button @click="deleteCourt(court.id)" :disabled="deleting === court.id"
              class="flex-1 py-2 border border-red-200 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors">
              {{ deleting === court.id ? '...' : '🗑️ Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api'

const courts       = ref([])
const loading      = ref(true)
const showForm     = ref(false)
const editingCourt = ref(null)
const deleting     = ref(null)
const saving       = ref(false)
const successMsg   = ref('')
const errorMsg     = ref('')
const photoFile    = ref(null)
const form         = reactive({ name: '', type: 'indoor', price_per_hour: '', description: '' })

async function fetchCourts() {
  loading.value = true
  try { const res = await api.get('/courts'); courts.value = res.data.courts }
  finally { loading.value = false }
}

function openAdd() {
  editingCourt.value = null
  Object.assign(form, { name: '', type: 'indoor', price_per_hour: '', description: '' })
  photoFile.value = null
  showForm.value  = true
}

function openEdit(court) {
  editingCourt.value = court
  Object.assign(form, { name: court.name, type: court.type, price_per_hour: court.price_per_hour, description: court.description ?? '' })
  photoFile.value = null
  showForm.value  = true
}

function handlePhoto(e) { photoFile.value = e.target.files[0] }

async function saveCourt() {
  saving.value   = true
  errorMsg.value = ''
  try {
    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => data.append(k, v))
    if (photoFile.value) data.append('photo', photoFile.value)

    if (editingCourt.value) {
      data.append('_method', 'PUT')
      await api.post(`/courts/${editingCourt.value.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      successMsg.value = 'Lapangan berhasil diupdate!'
    } else {
      await api.post('/courts', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      successMsg.value = 'Lapangan berhasil ditambahkan!'
    }
    showForm.value = false
    await fetchCourts()
    setTimeout(() => successMsg.value = '', 3000)
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Gagal menyimpan lapangan.'
  } finally {
    saving.value = false
  }
}

async function deleteCourt(id) {
  if (!confirm('Yakin hapus lapangan ini?')) return
  deleting.value = id
  try { await api.delete(`/courts/${id}`); await fetchCourts() }
  finally { deleting.value = null }
}

onMounted(fetchCourts)
</script>