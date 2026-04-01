<template>
  <footer class="bg-blue-900 text-gray-400 mt-20">
    <div class="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div class="flex items-center gap-2 text-white font-bold text-lg mb-3">
          <span>⚽</span><span>FutsalKita</span>
        </div>
        <p class="text-sm leading-relaxed">
          Platform booking lapangan futsal terpercaya. Mudah, cepat, dan terjangkau.
        </p>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-3">Navigasi</h4>
        <ul class="space-y-2 text-sm">
          <li><RouterLink to="/"        class="hover:text-white transition-colors">Beranda</RouterLink></li>
          <li><RouterLink to="/courts"  class="hover:text-white transition-colors">Lapangan</RouterLink></li>
          <li><RouterLink to="/bookings" class="hover:text-white transition-colors">Booking Saya</RouterLink></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-3">Kontak</h4>
        <ul class="space-y-2 text-sm">
          <li>📍 Jl. Futsal No. 1, Bandung</li>
          <li>📞 0812-3456-7890</li>
          <li>✉️ hello@futsalkita.com</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-gray-800 text-center py-4 text-xs">
      © 2025 FutsalKita. All rights reserved.
    </div>
  </footer>
</template>