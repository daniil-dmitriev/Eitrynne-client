<template>
  <component :is="icon" class="h-5 w-5" />
</template>

<script setup>
import * as icons from "~/assets/icons/";

const { name } = defineProps({
  name: String,
  loading: Boolean,
});

const render = ref(true);

onMounted(() => {
  render.value = false;
});

const icon = computed(() => {
  return icons[name];
});
</script>
