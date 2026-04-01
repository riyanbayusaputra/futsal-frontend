<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>