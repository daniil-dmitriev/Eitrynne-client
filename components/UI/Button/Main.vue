<template>
  <div>
    <NuxtLink v-if="link" :to="link">
      <button
        class="inline-flex cursor-auto items-center gap-x-2 py-1.5 px-2.5 text-xs font-bold"
        :class="
          disabled
            ? 'text-gray-400'
            : '!cursor-pointer text-indigo-600 transition-transform hover:scale-105'
        "
        :disabled="disabled"
      >
        <UI-icon :name="icon" class="w-5" />
        {{ name }}
      </button>
    </NuxtLink>
    <NuxtLink v-else>
      <button
        class="inline-flex cursor-auto items-center gap-x-2 py-1.5 px-2.5 text-xs font-bold"
        :class="
          disabled
            ? 'text-gray-400'
            : '!cursor-pointer text-indigo-600 transition-transform hover:scale-105'
        "
        :disabled="disabled"
      >
        <UI-icon :name="icon" class="w-5" />
        {{ name }}
      </button>
    </NuxtLink>
  </div>
</template>
<script setup>
defineProps({
  name: String,
  icon: String,
  link: String,
  disabled: Boolean,
});
</script>
