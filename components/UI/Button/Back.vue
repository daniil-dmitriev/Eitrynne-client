<template>
  <button
    class="inline-flex w-40 items-center justify-end gap-x-2 py-1.5 px-2.5 text-xs font-bold text-indigo-600 transition-transform hover:scale-105"
    @click="router.back()"
  >
    <UI-icon name="back" class="w-3" />
    Вернуться назад
  </button>
</template>
<script setup>
const router = useRouter();
</script>
