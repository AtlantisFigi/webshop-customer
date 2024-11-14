<script setup lang="ts">
import api from "../apiService.ts";
import { ref } from "vue";
import user from "../UserStorage.ts";
import router from "../router.ts";

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    const response = await api.post('api/auth/login', {
      email: email.value,
      password: password.value
    });

    user.value = {
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      infix: response.data.prefix,
      email: response.data.email,
    }

    await router.push('/')

    alert('Login successfully!');
  } catch (error) {
    alert(error);
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white/90 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 class="text-3xl font-semibold text-gray-900 text-center mb-6">Inloggen</h2>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Emailadres</label>
          <div class="mt-1">
            <input
                type="email"
                id="email"
                v-model="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Je emailadres"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Wachtwoord</label>
          <div class="mt-1">
            <input
                type="password"
                id="password"
                v-model="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Je wachtwoord"
            />
          </div>
        </div>

        <div>
          <button
              type="submit"
              class="w-full bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900 transition"
          >
            Inloggen
          </button>
        </div>
      </form>

      <p class="mt-6 text-center text-gray-500">
        Nog geen account?
        <router-link to="/register" class="text-indigo-600 hover:text-indigo-400 transition">
          Registreer hier
        </router-link>
      </p>
    </div>
  </div>
</template>
