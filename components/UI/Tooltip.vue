<script setup>
const showTooltip = ref(false);

function mouseEnter() {
  showTooltip.value = true;
}
function mouseLeave() {
  showTooltip.value = false;
}
</script>

<template>
  <div class="relative">
    <UI-icon
      name="info"
      class="cursor-pointer"
      @mouseenter="mouseEnter"
      @mouseleave="mouseLeave"
    ></UI-icon>
    <div
      v-show="showTooltip"
      class="absolute top-8 z-50 w-max rounded-md bg-gray-900/75 px-2.5 py-2 font-light text-white"
    >
      <slot />
    </div>
  </div>
</template>
