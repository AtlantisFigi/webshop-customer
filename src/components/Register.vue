<script setup lang="ts">
  import api from "../apiService.ts";
  import {ref} from "vue";

  const firstName = ref("");
  const lastName = ref("");
  const prefix = ref("");
  const email = ref("");
  const password = ref("");
  const confirmPassword = ref("");

  const handleRegistration = async () => {
    try {
      if (password.value === confirmPassword.value) {
        const response = await api.post('api/auth/register', {
          firstName: firstName.value,
          lastName: lastName.value,
          prefix: prefix.value,
          email: email.value,
          password: password.value,
        });

        alert('Register successfully!')
      }
      else {
        alert("passwords dont match")
      }
    }
    catch (error) {
      alert(error);
    }
  }

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white/60 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 class="text-2xl font-semibold text-gray-900 text-center mb-6">Register</h2>
      <form @submit.prevent="handleRegistration" class="space-y-6">
        <div class="flex space-x-4">
          <div class="flex-1">
            <label for="firstName" class="block text-sm font-medium text-gray-700">Firstname</label>
            <div class="mt-1">
              <input
                  type="text"
                  id="firstName"
                  v-model="firstName"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Your firstname"
              />
            </div>
          </div>

          <div class="flex-1">
            <label for="lastName" class="block text-sm font-medium text-gray-700">Lastname</label>
            <div class="mt-1">
              <input
                  type="text"
                  id="lastName"
                  v-model="lastName"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Your lastname"
              />
            </div>
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <div class="mt-1">
            <input
                type="email"
                id="email"
                v-model="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Your email"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1">
            <input
                type="password"
                id="password"
                v-model="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Your password"
            />
          </div>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm password</label>
          <div class="mt-1">
            <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Confirm password"
            />
          </div>
        </div>

        <div>
          <button
              type="submit"
              class="w-full bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900 transition"
          >
            Register
          </button>
        </div>
      </form>

      <p class="mt-6 text-center text-gray-500">
        Already have an account?
        <router-link to="/login" class="text-indigo-600 hover:text-indigo-400 transition">
          Login here
        </router-link>
      </p>
    </div>
  </div>
</template>


<style scoped>

</style>