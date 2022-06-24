<script setup>
defineProps(["modelValue", "header", "description"]);
defineEmits(["confirm", "cancel"]);
</script>

<template>
  <div>
    <Teleport to="body">
      <Transition>
        <div
          class="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,.3)]"
          v-show="modelValue.modal"
        >
          <UI-container class="inner-transition relative !shadow-gray-400">
            <!-- Modal Header -->
            <div>
              <h1 class="text-center font-bold text-gray-800">
                {{ header }}
              </h1>
              <p class="text-center text-xs text-gray-400">
                {{ description }}
              </p>
            </div>

            <!-- Modal Content -->
            <!-- <ul class="my-2.5 text-xs text-gray-600">
          <li v-for="(item, index) in modelValue.data" :key="item.id">
            {{ index + 1 + ") " + item.name + " / " }}
            {{ item.role === "client" ? "Клиент" : "Сотрудник" }}
          </li>
        </ul> -->

            <!-- Buttons -->
            <div class="mt-6 flex items-center justify-around">
              <UI-button-main
                name="Подтвердить"
                icon="check"
                @click="$emit('confirm')"
              />
              <UI-button-main
                name="Отменить"
                icon="close"
                @click="$emit('cancel')"
              />
            </div>
          </UI-container>
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
