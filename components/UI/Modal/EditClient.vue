<script setup>
import { useClientDetailsStore } from "~~/stores/client-details";
import { storeToRefs } from "pinia";
defineProps(["modelValue"]);
const emit = defineEmits(["close"]);
const clientDetailsStore = useClientDetailsStore();

const { client, loading } = storeToRefs(clientDetailsStore);
const changesInClient = ref(false);
clientDetailsStore.$subscribe((mutation) => {
  const posibleMutations = [
    "name",
    "birthdate",
    "value",
    "role",
    "active",
    "subs_fee",
    "phone",
  ];
  if (posibleMutations.includes(mutation.events.key)) {
    changesInClient.value = true;
  }
});

function updateClient() {
  if (!changesInClient.value) {
    return;
  }
  clientDetailsStore.updateClient();
  emit("close");
}
</script>
<template>
  <Teleport to="body">
    <Transition>
      <div
        class="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,.3)]"
        v-show="modelValue"
      >
        <UIContainer class="w-[70%] !shadow-md">
          <UIContainerHeader
            title="Клиенты"
            description="Редактирования клиента"
          >
            <UI-Icon
              name="close"
              class="cursor-pointer"
              @click="$emit('close')"
            />
          </UIContainerHeader>
          <div v-if="loading" class="flex h-32 items-center justify-center">
            <UILoading class="fill-gray-400" />
          </div>
          <div class="grid grid-cols-3 gap-x-2 gap-y-2" v-else>
            <div class="flex flex-col space-y-1.5">
              <label class="pl-1.5 text-xs font-bold text-gray-700"
                >Имя (ФИО)</label
              >
              <div class="relative flex items-center gap-x-2">
                <UI-input
                  placeholder="Введите имя"
                  v-model="client.name"
                  icon="person"
                />
              </div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label class="pl-1.5 text-xs font-bold text-gray-700">Роль</label>
              <div class="relative flex items-center gap-x-2">
                <UISelect
                  :options="[
                    { name: 'Клиенты', value: 'client' },
                    {
                      name: 'Сотрудники',
                      value: 'employee',
                    },
                  ]"
                  v-model="client.role"
                  icon="event"
                />
              </div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label class="pl-1.5 text-xs font-bold text-gray-700"
                >Категория</label
              >
              <div class="relative flex items-center gap-x-2">
                <UI-input
                  placeholder="Введите категорию"
                  v-model="client.category.value"
                  icon="group"
                  mask="A"
                />
              </div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label class="pl-1.5 text-xs font-bold text-gray-700"
                >Дата рождения</label
              >
              <div class="relative flex items-center gap-x-2">
                <UI-input
                  placeholder="Введите дату рождения"
                  v-model="client.birthdate"
                  icon="event"
                  mask="##.##.####"
                />
              </div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label class="pl-1.5 text-xs font-bold text-gray-700"
                >Телефон</label
              >
              <div class="relative flex items-center gap-x-2">
                <UI-input
                  placeholder="Введите номер телефона"
                  v-model="client.phone"
                  icon="call"
                  mask="+7-(###) ###-##-##"
                />
              </div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label class="pl-1.5 text-xs font-bold text-gray-700"
                >Абонемент</label
              >
              <div class="relative flex items-center gap-x-2">
                <UI-input
                  placeholder="Ежемесячные взносы"
                  v-model="client.subs_fee"
                  icon="account_balance"
                  mask="#######"
                />
              </div>
            </div>
            <div class="col-span-3 mt-4 flex justify-between">
              <UIButton-main
                :name="client.active ? 'В архив' : 'Из архива'"
                icon="archive"
                @click="client.active = !client.active"
              />
              <UIButton-main
                name="Сохранить"
                icon="save"
                :disabled="!changesInClient"
                @click="updateClient"
              />
            </div>
          </div>
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
