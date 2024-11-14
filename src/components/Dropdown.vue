<script setup lang="ts">
import Popper from "vue3-popper";
import { defineProps } from "vue";

interface Item {
  label: string;
  route: string;
}

defineProps<{
  items: Item[];
}>();
</script>

<template>
  <Popper class="content-center">
    <router-link
        v-for="item in items"
        :key="item.label"
        :to="item.route"
    >
      {{ item.label }}
    </router-link>
  </Popper>
</template>

<style scoped>
</style>
