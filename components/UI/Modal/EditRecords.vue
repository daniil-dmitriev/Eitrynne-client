<script setup>
defineProps(["show"]);
defineEmits(["close"]);

const employee = "";
const clients = [];
</script>

<template>
  <Teleport to="body">
    <Transition>
      <div
        class="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,.3)]"
        v-show="show"
      >
        <UIContainer class="inner-transition !shadow-md">
          <UIContainerHeader
            title="Записи"
            description="Добавление новой записи"
          >
            <UIIcon
              name="close"
              class="text-gray-600"
              @click="$emit('close')"
            ></UIIcon>
          </UIContainerHeader>
          <form class="grid grid-cols-3 gap-x-4">
            <div class="flex flex-col space-y-1.5">
              <label class="pl-1.5 text-xs font-bold text-gray-700"
                >Сотрудник (ФИО)</label
              >
              <div class="relative flex items-center gap-x-2">
                <UIInputLiveSearch
                  placeholder="Введите имя сотрудника"
                  v-model="employee"
                  icon="person"
                />
              </div>
            </div>

            <div class="flex flex-col space-y-1.5">
              <label class="pl-1.5 text-xs font-bold text-gray-700"
                >Клиенты (ФИО)</label
              >
              <div class="relative flex items-center gap-x-2">
                <UIInputLiveSearch
                  placeholder="Введите имя клиента"
                  v-model="clients"
                  icon="person"
                />
              </div>
            </div>
          </form>
        </UIContainer>
      </div>
    </Transition>
  </Teleport>
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
