<script setup>
const { modelValue, type } = defineProps({
  modelValue: String | Number,
  type: String,
  mask: String,
  icon: String,
  placeholder: String,
  loading: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const popupMenuContainer = ref(null);
useClickOutside(popupMenuContainer, () => {
  showResults.value = false;
});

const currentInput = ref(modelValue.name);
const searchName = useDebouncedRef("", 400);
const showResults = ref(false);
const activeIndex = ref(0);

const {
  pending,
  data: liveSearchResult,
  refresh,
} = useLazyAsyncData("liveSearch", () =>
  $fetch(
    `/api/clients?count=5&offset=0&role=${type}&balance=all&name=${searchName.value}`
  )
);

watch(currentInput, (newValue) => {
  searchName.value = newValue;
});

watch(searchName, (newValue) => {
  if (liveSearchResult.value[0] && liveSearchResult.value[0].name === newValue)
    return;
  if (newValue.length > 0) {
    showResults.value = true;
    refresh();
  }
});

function clickInputList() {
  currentInput.value = liveSearchResult.value[activeIndex.value].name;
  showResults.value = false;
  emit("update:modelValue", liveSearchResult.value[activeIndex.value]);
}

function inputKeyDown() {
  if (activeIndex.value + 1 >= liveSearchResult.value.length) return;
  activeIndex.value += 1;
}

function inputKeyUp() {
  if (activeIndex.value - 1 < 0) return;
  activeIndex.value -= 1;
}

async function inputKeyEnter() {
  if (!showResults.value) return;
  emit("update:modelValue", liveSearchResult.value[activeIndex.value]);
  currentInput.value = liveSearchResult.value[activeIndex.value].name;
  showResults.value = false;
  activeIndex.value = 0;
}
</script>

<template>
  <div class="relative flex w-full items-center">
    <UIIcon
      :name="icon"
      class="absolute left-2 text-gray-500"
      :loading="loading"
    />
    <input
      class="w-full rounded-md border border-gray-300 py-2 px-2.5 pl-8 text-sm text-gray-600 outline-none"
      v-model="currentInput"
      v-maska="mask"
      :placeholder="placeholder"
      @keypress.enter="inputKeyEnter"
      @keydown.down="inputKeyDown"
      @keydown.up="inputKeyUp"
    />
    <Transition name="slide-down">
      <div
        class="absolute top-10 left-0 right-0 z-50 rounded-md border border-gray-300 bg-white"
        v-show="showResults"
        ref="popupMenuContainer"
      >
        <div v-if="pending" class="flex justify-center px-2 py-1.5">
          <client-only>
            <UILoading class="fill-gray-500" />
          </client-only>
        </div>
        <div v-else>
          <ul v-if="liveSearchResult[0]">
            <li
              v-for="(item, index) in liveSearchResult"
              :key="item.id"
              class="group flex cursor-pointer items-center space-x-3 py-1.5 px-2.5 text-sm hover:bg-gray-50"
              @click="clickInputList()"
              @mouseover="activeIndex = index"
              :class="{ 'bg-gray-50': activeIndex === index }"
            >
              <div class="overflow-hidden rounded-full">
                <img
                  class="w-10 transition-all duration-100 ease-in group-hover:scale-110"
                  :src="`https://placekitten.com/500/50${index}`"
                />
              </div>

              <!-- * Name * -->
              <span>{{ item.name }}</span>
              <!-- TODO: Employee comment -->
            </li>
          </ul>
          <div
            v-if="!liveSearchResult[0]"
            class="flex items-center justify-center gap-x-3 py-1.5 px-2 text-sm text-gray-500"
          >
            <UIIcon name="do_disturb" class="text-sm text-gray-500" />
            Ничего не найдено
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
