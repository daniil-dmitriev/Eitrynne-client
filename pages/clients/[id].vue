<script setup lang="ts">
import { useClientDetailsStore } from "~/stores/client-details";
import { storeToRefs } from "pinia";

const clientDetailsStore = useClientDetailsStore();
const { error, loading, client, getClientInfo } =
  storeToRefs(clientDetailsStore);

// edit client form settings
const editClientModal = ref(false);
const route = useRoute();

onMounted(() => {
  clientDetailsStore.fetchClient(route.params.id.toString());
});

function toggleEditClient() {
  editClientModal.value = true;
}

function deleteClient() {
  console.log("deleteClient handler");
}
// ! REFACTOR THIS NAMES
const lastActivity = [
  {
    image: "https://placekitten.com/700/701",
    name: "+4500р",
    comment: "Оплата уроков",
    date: "01.06.22",
    type: "payment",
  },
  {
    image: "https://placekitten.com/700/700",
    name: "Терехова Анна 45мин.",
    comment: "В паре с Евгения Речная, 1500р.",
    date: "31.05.22",
    type: "record",
  },
  {
    image: "https://placekitten.com/701/700",
    name: "Терехов Артем 45мин.",
    comment: "Индивидуально, 3000р.",
    date: "30.05.22",
    type: "record",
  },
  {
    image: "https://placekitten.com/600/600",
    name: "+1400р",
    comment: "Оплата уроков",
    date: "26.05.22",
    type: "payment",
  },
  {
    image: "https://placekitten.com/701/701",
    name: "Долгушин Алексей 45мин.",
    comment: "В паре с Евгения Речная, 1400р.",
    date: "26.05.22",
    type: "record",
  },
];

// ! REFACTOR THIS NAMES
const favoriteEmployees = [
  {
    name: "Терехов Артемий",
    count: 15,
    discipline: "Стандарт",
    image: "https://placekitten.com/400/400",
  },
  {
    name: "Долгушин Алексей",
    count: 12,
    discipline: "Латина",
    image: "https://placekitten.com/400/401",
  },
  {
    name: "Терехова Анна",
    count: 12,
    discipline: "Стандарт",
    image: "https://placekitten.com/400/402",
  },
  {
    name: "Ефанина Анна",
    count: 8,
    discipline: "Латина",
    image: "https://placekitten.com/400/403",
  },
  {
    name: "Горбатенко Алексей",
    count: 5,
    discipline: "Хореография",
    image: "https://placekitten.com/400/404",
  },
];
</script>

<template>
  <div class="space-y-3">
    <UIContainer>
      <div class="flex justify-between">
        <!-- * Client info (avatar, name + email) -->
        <div class="flex gap-x-4">
          <img
            class="h-32 w-32 rounded-md"
            src="https://placekitten.com/601/501"
            v-if="!clientDetailsStore.loading"
          />
          <UILoading class="h-24 w-24 fill-indigo-600" v-else />
          <div class="flex flex-col gap-y-2">
            <!-- info -->
            <div>
              <div class="flex items-center gap-x-2">
                <h4 class="text-xl font-bold text-gray-900">
                  {{ client ? client.name : "Загрузка..." }}
                </h4>
                <UIPopupMenu
                  icon="settings"
                  :options="[
                    { name: 'Изменить', icon: 'edit', event: 'editClient' },
                    { name: 'Удалить', icon: 'delete', event: 'deleteClient' },
                  ]"
                  :loading="loading"
                  @editClient="toggleEditClient"
                  @deleteClient="deleteClient"
                  class="text-sm"
                />
              </div>
              <p class="text-sm text-gray-600">
                {{
                  client
                    ? client.email
                      ? client.email
                      : "Не указан"
                    : "Загрузка..."
                }}
              </p>
            </div>

            <!-- functions -->
            <div class="flex gap-x-2">
              <!-- Balance -->
              <div>
                <p class="text-xs text-gray-400">Баланс:</p>
                <div
                  :class="[
                    client && client.balance < 0
                      ? 'text-rose-500'
                      : 'text-emerald-500',
                    'flex items-center gap-x-0.5',
                  ]"
                >
                  <UIIcon
                    name="account_balance_wallet"
                    class="text-lg"
                    :loading="loading"
                  />
                  <span class="text-sm font-bold" v-if="!loading">
                    {{ client.balance }}
                  </span>
                </div>
              </div>
              <!-- Taked records -->
              <div>
                <p class="text-xs text-gray-400">За неделю:</p>
                <div class="flex items-center gap-x-0.5 text-indigo-500">
                  <UIIcon
                    name="shopping_cart"
                    class="text-lg"
                    :loading="loading"
                  />
                  <span class="text-sm font-bold" v-if="!loading">7600</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- * Full client additional info -->

        <table class="table-fixed text-sm">
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody class="text-gray-600" v-if="!loading">
            <tr v-for="item in getClientInfo" :key="item.field">
              <td class="flex items-center gap-x-2 font-bold">
                <UIIcon :name="item.icon" class="text-xs" :loading="loading" />
                {{ item.field }}
              </td>
              <td class="pl-8">{{ item.value }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="2" align="center">
                <UILoading class="fill-gray-400" />
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <UIButton-back />
        </div>
      </div>
    </UIContainer>
    <div class="flex space-x-3">
      <UIContainer class="basis-1/2">
        <UIContainer-header
          title="Последняя активность"
          description="Записи и внесенные платежи"
        />
        <div v-show="loading" class="mb-4 flex items-center justify-center">
          <UILoading />
        </div>
        <ul>
          <li
            class="relative flex items-center justify-between border-l py-3 pl-6"
            v-for="(activity, index) in lastActivity"
            :key="index + activity.name"
          >
            <div
              :class="[
                activity.type === 'record'
                  ? 'bg-gray-400 shadow-sm shadow-gray-300'
                  : 'bg-emerald-500 shadow-sm shadow-emerald-300',
                'absolute -left-1 h-2 w-2 rounded-full',
              ]"
            ></div>
            <div class="flex items-center gap-x-2">
              <img
                :src="activity.image"
                class="h-10 w-10 rounded-full"
                alt=""
              />
              <div>
                <p
                  :class="[
                    activity.type === 'record'
                      ? 'text-gray-600'
                      : 'text-emerald-500',
                    'flex items-center gap-x-2 font-bold',
                  ]"
                >
                  {{ activity.name }}
                  <UIIcon
                    :name="
                      activity.type === 'record' ? 'school' : 'credit_score'
                    "
                    class="text-sm"
                    :loading="loading"
                  />
                </p>
                <p class="text-xs text-gray-600">
                  {{ activity.comment }}
                </p>
              </div>
            </div>
            <span class="self-start pt-1 text-xs text-gray-400">{{
              activity.date
            }}</span>
          </li>
        </ul>
      </UIContainer>
      <UIContainer class="basis-1/2">
        <UIContainerHeader
          title="Рейтинг сотрудников"
          description="С кем клиент больше всего занимается"
        />
        <div v-show="loading" class="mb-4 flex items-center justify-center">
          <UILoading />
        </div>
        <ul class="divide-y divide-gray-50">
          <li
            class="relative flex items-center justify-between py-3 pl-6"
            v-for="(employee, index) in favoriteEmployees"
            :key="index + employee.name"
          >
            <div class="absolute left-0 text-sm text-gray-400">
              {{ index + 1 }}
            </div>
            <div class="flex items-center gap-x-2">
              <img
                :src="employee.image"
                class="h-10 w-10 rounded-full"
                alt=""
              />
              <div>
                <p class="flex items-center gap-x-2 font-bold text-gray-600">
                  {{ employee.name }}
                </p>
                <p class="text-xs text-gray-600">
                  {{ employee.discipline }}
                </p>
              </div>
            </div>
            <span class="pr-4 text-sm text-gray-600">{{ employee.count }}</span>
          </li>
        </ul>
      </UIContainer>
    </div>
    <UIContainer>
      <UIContainerHeader
        title="Записи клиента"
        description="Все записи клиента в студии"
      >
        <UIButton-main name="Добавить" icon="add" :disabled="false" />
      </UIContainerHeader>

      <div v-show="true" class="mb-4 flex items-center justify-center">
        <UILoading />
      </div>
    </UIContainer>

    <!-- EDIT CLIENT MODAL WINDOW -->
    <UIModalEditClient
      v-model="editClientModal"
      @close="editClientModal = false"
    />
  </div>
</template>
