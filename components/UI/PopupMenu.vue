<script setup>
defineProps({
  icon: String,
  options: Array,
});

const popupMenu = ref(false);

const popupMenuContainer = ref(null);
useClickOutside(popupMenuContainer, () => {
  popupMenu.value = false;
});

function togglePopupMenu() {
  popupMenu.value = !popupMenu.value;
}
</script>

<template>
  <div
    class="relative flex cursor-pointer justify-center"
    ref="popupMenuContainer"
  >
    <UI-icon :name="icon" class="w-5" @click="togglePopupMenu($event)" />
    <!-- <MoreSvg
      class="w-5 text-gray-400 hover:text-gray-600"
      @click="togglePopupMenu($event)"
    /> -->
    <Transition name="slide-down">
      <UI-container
        class="popupMenu absolute top-8 z-10 self-start rounded-md !border !border-gray-100 !p-0"
        v-show="popupMenu"
      >
        <ul class="divide-y">
          <li
            class="flex items-center gap-x-4 py-1.5 px-2.5 hover:bg-gray-50"
            v-for="option in options"
            :key="option"
            @click="$emit(option.event)"
          >
            <UI-icon :name="option.icon" class="text-sm"></UI-icon>
            {{ option.name }}
          </li>
        </ul>
      </UI-container>
    </Transition>
  </div>
</template>
