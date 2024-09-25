<script setup lang="ts">
import { ref } from 'vue';

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}
</script>

<template>
  <nav class="bg-white/60 backdrop-blur-md shadow-md">
    <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <!-- Logo / Title -->
      <div class="text-xl font-semibold text-gray-900 tracking-wide">
        <router-link to="/" class="hover:text-gray-700 transition">Webshop</router-link>
      </div>

      <!-- Desktop Menu -->
      <div class="hidden md:flex space-x-6 items-center">
        <router-link to="/products" class="text-gray-900 hover:text-gray-700 transition">Producten</router-link>
        <router-link to="/about" class="text-gray-900 hover:text-gray-700 transition">Over</router-link>
        <router-link to="/contact" class="text-gray-900 hover:text-gray-700 transition">Contact</router-link>
        <router-link to="/login" class="text-gray-900 hover:text-gray-700 transition">Inloggen</router-link>
        <router-link to="/register" class="text-white bg-black px-4 py-2 rounded-full hover:bg-gray-900 transition">Registreren</router-link>
      </div>

      <!-- Hamburger Menu Icon for Mobile -->
      <button @click="toggleMobileMenu" class="md:hidden text-gray-900 focus:outline-none">
        <span class="material-icons text-3xl">menu</span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-white/90 backdrop-blur-md shadow-lg">
      <div class="flex flex-col space-y-2 py-2">
        <router-link to="/products" class="text-gray-900 px-4 py-2 hover:bg-gray-200 transition">Producten</router-link>
        <router-link to="/about" class="text-gray-900 px-4 py-2 hover:bg-gray-200 transition">Over</router-link>
        <router-link to="/contact" class="text-gray-900 px-4 py-2 hover:bg-gray-200 transition">Contact</router-link>
        <router-link to="/login" class="text-gray-900 px-4 py-2 hover:bg-gray-200 transition">Inloggen</router-link>
        <router-link to="/register" class="text-white bg-black px-4 py-2 rounded-full mx-4 mt-2 hover:bg-gray-800 transition">Registreren</router-link>
      </div>
    </div>
  </nav>
</template>


<style scoped>

</style>