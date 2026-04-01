<template>
    <DefaultLayout>
        <!-- Loading -->
        <div
            v-if="loading"
            class="flex items-center justify-center min-h-[60vh]"
        >
            <div
                class="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"
            ></div>
        </div>

        <div v-else-if="court" class="max-w-6xl mx-auto px-4 py-10">
            <!-- Breadcrumb -->
            <div class="text-sm text-gray-400 mb-6">
                <RouterLink to="/" class="hover:text-primary-500"
                    >Beranda</RouterLink
                >
                <span class="mx-2">/</span>
                <RouterLink to="/courts" class="hover:text-primary-500"
                    >Lapangan</RouterLink
                >
                <span class="mx-2">/</span>
                <span class="text-gray-700 font-medium">{{ court.name }}</span>
            </div>

            <div class="grid md:grid-cols-5 gap-8">
                <!-- LEFT: Info -->
                <div class="md:col-span-3">
                    <div
                        class="rounded-2xl overflow-hidden h-64 bg-primary-50 flex items-center justify-center mb-6"
                    >
                        <img
                            v-if="court.photo_url"
                            :src="court.photo_url"
                            :alt="court.name"
                            class="w-full h-full object-cover"
                        />
                        <span v-else class="text-7xl">⚽</span>
                    </div>

                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <h1 class="text-2xl font-extrabold text-gray-900">
                                {{ court.name }}
                            </h1>
                            <span
                                class="inline-block mt-1 text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                                :class="
                                    court.type === 'indoor'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-blue-100 text-blue-700'
                                "
                            >
                                {{ court.type }}
                            </span>
                        </div>
                        <div class="text-right">
                            <div
                                class="text-2xl font-extrabold text-primary-500"
                            >
                                {{ court.price_formatted }}
                            </div>
                            <div class="text-sm text-gray-400">per jam</div>
                        </div>
                    </div>

                    <p class="text-gray-600 leading-relaxed mb-6">
                        {{
                            court.description || "Lapangan futsal berkualitas."
                        }}
                    </p>

                    <div class="grid grid-cols-2 gap-3">
                        <div
                            v-for="f in fasilitas"
                            :key="f"
                            class="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3"
                        >
                            {{ f }}
                        </div>
                    </div>
                </div>

                <!-- RIGHT: Form Booking -->
                <div class="md:col-span-2">
                    <div
                        class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24"
                    >
                        <h2 class="font-bold text-gray-900 text-lg mb-5">
                            Pilih Jadwal
                        </h2>

                        <!-- Tanggal -->
                        <div class="mb-5">
                            <label
                                class="block text-sm font-semibold text-gray-700 mb-1.5"
                                >Tanggal</label
                            >
                            <input
                                type="date"
                                v-model="selectedDate"
                                :min="today"
                                @change="fetchSlots"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <!-- Slot waktu -->
                        <div class="mb-5">
                            <label
                                class="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Slot Waktu
                                <span class="text-gray-400 font-normal"
                                    >(bisa pilih beberapa)</span
                                >
                            </label>

                            <div
                                v-if="loadingSlots"
                                class="grid grid-cols-3 gap-2"
                            >
                                <div
                                    v-for="i in 6"
                                    :key="i"
                                    class="h-10 bg-gray-100 rounded-lg animate-pulse"
                                ></div>
                            </div>

                            <div
                                v-else
                                class="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1"
                            >
                                <button
                                    v-for="slot in slots"
                                    :key="slot.start"
                                    @click="toggleSlot(slot)"
                                    :disabled="!slot.is_available"
                                    class="py-2 px-1 rounded-lg text-xs font-semibold transition-all"
                                    :class="!slot.is_available
  ? 'bg-red-50 text-red-400 border border-red-200 cursor-not-allowed line-through'
  : isSelected(slot)
    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
    : 'bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
                                    "
                                >
                                    {{ slot.start }}
                                </button>
                            </div>

                            <!-- Legend -->
                            <div class="flex gap-4 mt-3 text-xs text-gray-400">
                                <span class="flex items-center gap-1.5">
                                    <span
                                        class="w-3 h-3 bg-primary-500 rounded"
                                    ></span>
                                    Dipilih
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <span
                                        class="w-3 h-3 bg-red-100 border border-red-200 rounded"
                                    ></span>
                                    Terisi
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <span
                                        class="w-3 h-3 bg-gray-50 border border-gray-200 rounded"
                                    ></span>
                                    Tersedia
                                </span>
                            </div>
                        </div>

                        <!-- Summary -->
                        <div
                            v-if="selectedSlots.length"
                            class="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-4 text-sm space-y-1.5"
                        >
                            <div class="flex justify-between text-gray-700">
                                <span>Waktu</span>
                                <span class="font-semibold"
                                    >{{ startTime }} – {{ endTime }}</span
                                >
                            </div>
                            <div class="flex justify-between text-gray-700">
                                <span>Durasi</span>
                                <span class="font-semibold"
                                    >{{ totalHours }} jam</span
                                >
                            </div>
                            <div
                                class="border-t border-primary-200 pt-1.5 flex justify-between"
                            >
                                <span class="font-bold text-gray-900"
                                    >Total</span
                                >
                                <span class="font-extrabold text-primary-500">{{
                                    totalFormatted
                                }}</span>
                            </div>
                        </div>

                        <!-- Alert -->
                        <div
                            v-if="error"
                            class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4"
                        >
                            {{ error }}
                        </div>
                        <div
                            v-if="success"
                            class="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 mb-4"
                        >
                            ✅ {{ success }}
                        </div>

                        <button
                            @click="handleBooking"
                            :disabled="submitting || !selectedSlots.length"
                            class="w-full py-3.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/30"
                        >
                            {{
                                submitting
                                    ? "Memproses..."
                                    : auth.isLoggedIn
                                      ? "Booking Sekarang ⚽"
                                      : "Masuk untuk Booking"
                            }}
                        </button>

                        <p
                            v-if="!auth.isLoggedIn"
                            class="text-center text-xs text-gray-400 mt-3"
                        >
                            Belum punya akun?
                            <RouterLink
                                to="/register"
                                class="text-primary-500 font-semibold"
                                >Daftar gratis</RouterLink
                            >
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { useAuthStore } from "@/stores/auth";
import api from "@/api";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const court = ref(null);
const slots = ref([]);
const selectedSlots = ref([]);
const loading = ref(true);
const loadingSlots = ref(false);
const submitting = ref(false);
const error = ref("");
const success = ref("");
const today = new Date().toISOString().split("T")[0];
const selectedDate = ref(today);

const fasilitas = [
    "🚿 Kamar mandi",
    "🅿️ Parkir luas",
    "💡 Lampu malam",
    "🧴 Perlengkapan",
];

const startTime = computed(() => selectedSlots.value.at(0)?.start ?? null);
const endTime = computed(() => selectedSlots.value.at(-1)?.end ?? null);
const totalHours = computed(() => selectedSlots.value.length);
const totalPrice = computed(
    () => totalHours.value * (court.value?.price_per_hour ?? 0),
);
const totalFormatted = computed(
    () => "Rp " + totalPrice.value.toLocaleString("id-ID"),
);

onMounted(async () => {
    try {
        const res = await api.get(`/courts/${route.params.id}`);
        court.value = res.data.court;
        await fetchSlots();
    } finally {
        loading.value = false;
    }
});

async function fetchSlots() {
    loadingSlots.value = true;
    selectedSlots.value = [];
    try {
        const res = await api.get(
            `/courts/${route.params.id}/available-slots`,
            {
                params: { date: selectedDate.value },
            },
        );
        slots.value = res.data.slots;
    } finally {
        loadingSlots.value = false;
    }
}

function toggleSlot(slot) {
    if (!slot.is_available) return;
    const idx = selectedSlots.value.findIndex((s) => s.start === slot.start);
    if (idx >= 0) {
        selectedSlots.value.splice(idx, 1);
    } else {
        selectedSlots.value = [...selectedSlots.value, slot].sort((a, b) =>
            a.start.localeCompare(b.start),
        );
    }
}

function isSelected(slot) {
    return selectedSlots.value.some((s) => s.start === slot.start);
}

async function handleBooking() {
    if (!auth.isLoggedIn) {
        router.push("/login");
        return;
    }
    if (!selectedSlots.value.length) {
        error.value = "Pilih minimal 1 slot waktu.";
        return;
    }

    submitting.value = true;
    error.value = "";
    try {
        const res = await api.post("/bookings", {
            court_id: route.params.id,
            booking_date: selectedDate.value,
            start_time: startTime.value,
            end_time: endTime.value,
        });
        router.push(`/payment/${res.data.booking.id}`);
    } catch (e) {
        error.value = e.response?.data?.message || "Booking gagal, coba lagi.";
    } finally {
        submitting.value = false;
    }
}
</script>
