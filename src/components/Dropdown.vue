<script setup lang="ts">
import {PropType} from "vue";
import Popper from "vue3-popper";


const props = defineProps({
  label: String,
  items: Array,
});
</script>

<template>
  <Popper class="content-center">
    <router-link
    v-for="item in items"
    :key="item.label"
    :to="item.route"
    >
      {{item.label}}
    </router-link>
  </Popper>
</template>

<style scoped>

</style>