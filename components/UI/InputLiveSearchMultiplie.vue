<script setup>
import { useToast } from "vue-toastification";

defineProps({
  modelValue: String | Number,
  mask: String,
  icon: String,
  placeholder: String,
  loading: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const toast = useToast();

const popupMenuContainer = ref(null);
useClickOutside(popupMenuContainer, () => {
  showResults.value = false;
});

const inputComponent = ref(null);
const showResults = ref(false);
const chips = ref([]);

const searchName = useDebouncedRef("", 400);
const currentInput = ref("");

const activeIndex = ref(0);

const {
  pending,
  data: liveSearchResult,
  refresh,
} = useLazyAsyncData("liveSearchMultiply", () =>
  $fetch(
    `/api/clients?count=5&offset=0&role=all&balance=all&name=${searchName.value}`
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
function inputKeyDown() {
  if (activeIndex.value + 1 >= liveSearchResult.value.length) return;
  activeIndex.value += 1;
}

function inputKeyUp() {
  if (activeIndex.value - 1 < 0) return;
  activeIndex.value -= 1;
}
function inputKeyEnter() {
  if (!showResults.value) return;
  if (
    chips.value
      .map((object) => object.id)
      .indexOf(liveSearchResult.value[activeIndex.value].id) === -1
  ) {
    chips.value.push(liveSearchResult.value[activeIndex.value]);

    currentInput.value = "";
    showResults.value = false;

    emit("update:modelValue", chips.value);
    return;
  }

  toast("Данный посетитель уже добавлен!");
}

function clickInputList() {
  if (
    chips.value
      .map((object) => object.id)
      .indexOf(liveSearchResult.value[activeIndex.value].id) === -1
  ) {
    chips.value.push(liveSearchResult.value[activeIndex.value]);

    currentInput.value = "";
    showResults.value = false;
    emit("update:modelValue", chips.value);

    return;
  }

  toast("Данный посетитель уже добавлен!");
}

function deleteChip(index) {
  chips.value.splice(index, 1);
  inputComponent.value.focus();
}

function backSpaceDelete() {
  currentInput.value === "" && chips.value.splice(chips.value.length - 1);
}
</script>

<template>
  <div class="w-full">
    <div
      class="relative flex min-h-[38px] flex-wrap items-center gap-1 rounded-md border border-gray-300 py-1.5 px-2.5 pb-0 pl-8"
    >
      <UIIcon class="absolute left-2 -mt-1 w-5 text-gray-500" name="group" />
      <div
        class="flex items-center rounded-md bg-gray-200 px-1 text-xs"
        v-for="(chip, index) in chips"
        :key="chip"
      >
        {{ chip.name }}
        <UIIcon
          name="close"
          class="ml-1 h-3 w-3 cursor-pointer"
          @click="deleteChip(index)"
        />
      </div>
      <input
        ref="inputComponent"
        v-model="currentInput"
        class="flex w-0.5 flex-auto border-0 px-1 text-sm text-gray-600 outline-none"
        :placeholder="!chips[0] ? placeholder : ''"
        @keypress.enter="inputKeyEnter"
        @keydown.delete="backSpaceDelete"
        @keydown.down="inputKeyDown"
        @keydown.up="inputKeyUp"
        @input="changeInput"
      />
      <div class="relative w-full">
        <Transition name="slide-down">
          <div
            class="absolute top-2 -left-8 -right-2.5 overflow-hidden rounded-md border border-gray-300 bg-white"
            ref="popupMenuContainer"
            v-show="showResults"
          >
            <div v-if="pending" class="flex justify-center px-2 py-1.5">
              <UILoading class="fill-gray-500" />
            </div>
            <div v-else>
              <ul v-if="liveSearchResult[0]">
                <li
                  v-for="(item, index) in liveSearchResult"
                  :key="item.id"
                  class="group flex cursor-pointer items-center space-x-3 py-1.5 px-2.5 text-sm hover:bg-gray-50"
                  :class="{ 'bg-gray-50': activeIndex === index }"
                  @click="clickInputList(index)"
                  @mouseover="activeIndex = index"
                >
                  <div class="overflow-hidden rounded-full">
                    <img
                      class="w-10 transition-all duration-100 ease-in group-hover:scale-110"
                      :src="`https://placekitten.com/500/50${index}`"
                    />
                  </div>

                  <span>{{ item.name }}</span>
                </li>
              </ul>
              <div v-else class="py-1.5 text-center text-sm text-gray-600">
                Ничего не найдено
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
