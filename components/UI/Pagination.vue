<script setup>
const { total, count, current } = defineProps({
  total: Number,
  count: Number,
  current: Number,
});
defineEmits(["change"]);

const pages = ref([]);
for (let i = 0; i < Math.ceil(total / count); i++) {
  pages.value.push(i + 1);
}
</script>

<template>
  <div class="flex justify-center">
    <ul class="flex items-center">
      <li>
        <UI-button-main name="<" @click="$emit('change', current - 1)" />
      </li>
      <li
        v-for="page in pages"
        :key="page"
        class="cursor-pointer rounded-md p-2 text-gray-600 hover:bg-gray-100"
        :class="{
          'bg-indigo-600 text-white hover:bg-indigo-700': current === page,
        }"
        @click="$emit('change', page)"
      >
        {{ page }}
      </li>
      <li>
        <UI-button-main name=">" @click="$emit('change', current + 1)" />
      </li>
    </ul>
  </div>
</template>
