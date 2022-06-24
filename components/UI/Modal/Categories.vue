<script setup>
defineProps(["modelValue"]);
defineEmits(["close", "add"]);

const disabled = ref(false);
const errors = ref({
  value: null,
  comment: null,
});
</script>
<template>
  <div>
    <Teleport to="body">
      <Transition>
        <div
          class="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,.3)]"
          v-show="modelValue.modal"
        >
          <UIContainer class="inner-transition w-2/3 !shadow-md">
            <UIContainerHeader title="Категории">
              <UI-Icon
                name="close"
                @click="$emit('close')"
                class="cursor-pointer text-gray-600"
              />
            </UIContainerHeader>
            <form class="flex gap-x-2">
              <div class="flex w-1/4 flex-col space-y-1.5">
                <label class="pl-1.5 text-xs font-bold text-gray-700"
                  >Категория</label
                >
                <div class="relative flex items-center gap-x-2">
                  <UI-input
                    v-model="modelValue.data.value"
                    icon="group"
                    mask="A"
                    class="text-gray-600"
                    placeholder="Z"
                  />
                  <span
                    class="absolute -bottom-4 left-0 right-0 text-[0.6rem] text-red-500"
                    >{{ errors.value && errors.value }}</span
                  >
                </div>
              </div>
              <div class="flex w-3/4 flex-col space-y-1.5">
                <label class="pl-1.5 text-xs font-bold text-gray-700"
                  >Комментарий</label
                >
                <div class="relative flex items-center gap-x-2">
                  <UI-input
                    placeholder="Введите комментарий"
                    v-model="modelValue.data.comment"
                    icon="title"
                    class="text-gray-600"
                  />
                  <span
                    class="absolute -bottom-4 left-0 right-0 text-[0.6rem] text-red-500"
                    >{{ errors.comment && errors.comment }}</span
                  >
                </div>
              </div>
              <div class="col-span-3 mt-4 mb-1 flex items-end justify-end">
                <UIButton-main
                  name="Сохранить"
                  icon="save"
                  @click.prevent="$emit('add')"
                  :disabled="disabled"
                />
              </div>
            </form>
          </UIContainer>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<style scoped>
.v-enter-active {
  transition: opacity 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  transition-delay: 0.25s;
}
.v-leave-active {
  transition: opacity 0.5s cubic-bezier(0.86, 0, 0.07, 1);
  transition-delay: 0.25s;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-active .inner-transition {
  transition: all 0.15s cubic-bezier(0.075, 0.82, 0.165, 1);
  transition-delay: 0.5s;
}
.v-enter-from .inner-transition {
  transform: translateY(-200vh);
}

.v-leave-to .inner-transition {
  transition: all 0.3s cubic-bezier(0.86, 0, 0.07, 1);
  transform: translateY(-100vh);
}
</style>
