<script setup>
defineProps({
  options: Array,
  modelValue: String,
  icon: String,
  loading: Boolean,
});
defineEmits(["update:modelValue"]);

const showSelect = ref(false);
const refSelect = ref(null);

useClickOutside(refSelect, () => {
  showSelect.value = false;
});

function toggleSelect() {
  showSelect.value = !showSelect.value;
}
</script>

<template>
  <div class="w-full rounded-md border border-gray-300">
    <!-- Displayed value -->
    <div
      class="relative flex cursor-pointer items-center justify-between py-2 px-2.5 text-sm"
      @click="toggleSelect"
      ref="refSelect"
    >
      <span class="flex items-center gap-x-2 pl-0 pr-4 text-gray-600">
        <UIIcon :name="icon" :loading="loading" />
        {{ options.find((item) => item.value === modelValue).name }}</span
      >
      <span><UI-icon name="arrow_drop_down" class="text-xs"></UI-icon></span>
      <!-- results -->
      <ul
        class="absolute left-0 right-0 top-9 z-10 self-start rounded-md border border-gray-300 bg-white shadow-md"
        v-show="showSelect"
      >
        <li
          class="flex items-center justify-between py-1.5 px-2.5 hover:bg-gray-50"
          @click="$emit('update:modelValue', option.value)"
          v-for="option in options"
          :key="option.name"
        >
          {{ option.name }}
          <UI-icon
            v-if="option.value === modelValue"
            name="check"
            class="text-xs"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
