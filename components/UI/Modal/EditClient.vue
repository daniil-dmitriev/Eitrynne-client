<script setup>
import { useToast } from "vue-toastification";

const toast = useToast();

const { client } = defineProps(["modelValue", "client"]);
const emit = defineEmits(["close"]);

const config = useRuntimeConfig();

const updatedClient = ref({ ...client });
function updateClient() {
  let date = "";
  if (updatedClient.value.birthdate) {
    const dateArray = updatedClient.value.birthdate?.split(".");
    [dateArray[0], dateArray[1]] = [dateArray[1], dateArray[0]];
    date = dateArray.join(".");
  }
  const response = $fetch(`/api/clients/${updatedClient.value.id}`, {
    method: "put",
    body: {
      name: updatedClient.value.name,
      birthdate: new Date(date),
      role: updatedClient.value.role,
      category: updatedClient.value.category.value,
      subs_fee: updatedClient.value.subs_fee,
      phone: updatedClient.value.phone,
      active: updatedClient.value.active,
      program: updatedClient.value.program,
      email: updatedClient.value.email,
    },
  });

  response.then(() => {
    const message = updatedClient.value.name + " был успешно обновлен";
    toast.success(message);
  });

  response.catch(() => {
    const message =
      "При обновлении " +
      updatedClient.value.name +
      " возникли неполадки. Попробуйте снова.";
    toast.error(message);
  });
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
          <div class="grid grid-cols-3 gap-x-2 gap-y-2">
            <div class="flex flex-col space-y-1.5">
              <label class="pl-1.5 text-xs font-bold text-gray-700"
                >Имя (ФИО)</label
              >
              <div class="relative flex items-center gap-x-2">
                <UI-input
                  placeholder="Введите имя"
                  v-model="updatedClient.name"
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
                  v-model="updatedClient.role"
                  icon="event"
                />
              </div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label class="pl-1.5 text-xs font-bold text-gray-700"
                >Программа</label
              >
              <div class="relative flex items-center gap-x-2">
                <UIInput
                  icon="grade"
                  placeholder="Например: Латина"
                  v-model="updatedClient.program"
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
                  v-model="updatedClient.category.value"
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
                  v-model="updatedClient.birthdate"
                  icon="event"
                  mask="##.##.####"
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
                  v-model="updatedClient.subs_fee"
                  icon="subscription"
                  mask="#######"
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
                  v-model="updatedClient.phone"
                  icon="phone"
                  mask="+7-(###) ###-##-##"
                />
              </div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label class="pl-1.5 text-xs font-bold text-gray-700"
                >Email</label
              >
              <div class="relative flex items-center gap-x-2">
                <UI-input
                  placeholder="Введите номер email"
                  v-model="updatedClient.email"
                  icon="email"
                />
              </div>
            </div>

            <div class="col-span-3 mt-4 flex justify-between">
              <UIButton-main
                :name="updatedClient.active ? 'В архив' : 'Из архива'"
                icon="archive"
                @click="updatedClient.active = !updatedClient.active"
              />
              <UIButton-main
                name="Сохранить"
                icon="save"
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
