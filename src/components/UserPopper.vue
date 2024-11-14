<script setup lang="ts">
import Popper from "vue3-popper";
import api from "../apiService.ts";
import router from "../router.ts";
import user from "../UserStorage.ts";

const logout = async () => {
  try {
    await api.post('api/auth/logout')
    user.value = null
    await router.push('/login')
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <Popper class="content-center" v-if="user">
    <button>{{user.firstName}}</button>
    <template #content>
      <div class="border-2 p-4 rounded border-gray-200 mr-2 bg-white shadow-2xl flex flex-col gap-2">
        <p>{{user.firstName}} {{user.infix}} {{user.lastName}}</p>
      </div>
      <button @click="logout">
        Logout
      </button>
    </template>
  </Popper>
</template>

<style scoped>

</style>