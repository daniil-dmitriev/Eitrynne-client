<template>
  <div class="mb-4 flex w-full items-center justify-between">
    <!-- Page name -->
    <div>
      <h2 class="text-xl font-bold text-gray-800">{{ title }}</h2>
      <p class="text-sm text-gray-400">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  description: String,
});
</script>
