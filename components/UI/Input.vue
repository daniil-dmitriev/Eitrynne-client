<template>
  <div class="relative flex w-full items-center">
    <UIIcon
      :name="icon"
      class="absolute left-3 w-5 text-gray-500"
      :loading="loading"
      v-if="!iconLast"
    />
    <input
      class="w-full rounded-md py-2 px-2.5 text-sm outline-none"
      :class="[
        !iconLast ? 'pl-10' : 'pr-10',
        !noBorder ? 'border border-gray-300' : '',
      ]"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      v-maska="mask"
      :type="type"
      :placeholder="placeholder"
    />

    <UIIcon
      :name="icon"
      class="absolute right-2 w-5 text-gray-500"
      :loading="loading"
      v-if="iconLast"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: String | Number,
  mask: String,
  icon: String,
  placeholder: String,
  loading: Boolean,
  iconLast: Boolean | false,
  noBorder: Boolean | false,
  type: String,
});
defineEmits(["update:modelValue"]);
</script>
