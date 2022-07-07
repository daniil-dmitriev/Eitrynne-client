<script setup>
import { useClientDetailsStore } from "~/stores/client-details";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { axios } from "axios";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const toast = useToast();

onBeforeMount(() => {
  recordsRefresh();
  clientRefresh();
});

const {
  data: client,
  pending: clientPending,
  refresh: clientRefresh,
} = await useFetch(`/api/clients/${route.params.id.toString()}`);
// edit client form settings
const editClientModal = ref(false);
const tableHeader = [
  "Дата",
  "Сотрудник",
  "Длительность",
  "Стоимость",
  "Статус",
];

function toggleEditClient() {
  editClientModal.value = true;
}

function deleteClient() {
  console.log("deleteClient handler");
}

const {
  data: lastActivities,
  pending: lastActivitiesPending,
  refresh: lastActivitiesRefresh,
} = useLazyFetch(`/api/clients/${route.params.id.toString()}/lastActivity`);

const {
  data: records,
  pending: recordsPending,
  refresh: recordsRefresh,
} = useLazyFetch(`/api/clients/records?clientId=${route.params.id.toString()}`);

const {
  data: employees,
  pending: employeesPending,
  refresh: employeeRefresh,
} = useLazyFetch(`/api/clients/${route.params.id.toString()}/employee`);

const file = ref(null);

async function changeClientImage() {
  if (file.value.files[0].size > 1e6) {
    toast.warning(
      "Загружаемое изображение не должно превышать размер 1МБ. Попробуйте другое изображение"
    );

    return;
  }

  const id = route.params.id.toString();
  const fd = new FormData();

  const ext = file.value.files[0].name.split(".").at(-1).toLowerCase();
  fd.append("avatar", file.value.files[0], `${id}.${ext}`);

  const response = $fetch(`${config.API_BASE_URL}/clients/${id}/avatar`, {
    method: "post",
    body: fd,
  });

  response.then(() => {
    toast.success("Аватар пользователя был успешно обновлен!");
  });

  response.catch(() => {
    toast.error(
      "При обновлении аватара произошла ошибка. Попробуйте снова или обратитесь к администратору!"
    );
  });
}

async function deleteClientImage() {
  const id = route.params.id.toString();
  const response = await $fetch(`${config.API_BASE_URL}/clients/${id}/avatar`, {
    method: "delete",
  });

  response.then(() => {
    toast.success("Аватар пользователя был успешно удален!");
  });

  response.catch(() => {
    toast.error(
      "При обновлении аватара произошла ошибка. Попробуйте снова или обратитесь к администратору!"
    );
  });
}

function closeEditClientModal() {
  editClientModal.value = false;
  clientRefresh();
}

function checkStatus(prices) {
  let status = 0;

  for (let price of prices) {
    if (price.status === true) status++;
  }

  switch (status) {
    case prices.length:
      return 2;
    case 0:
      return 0;
    default:
      return 1;
  }
}

function deleteRecord(record) {
  const response = $fetch(`/api/records/${record.id}`, {
    method: "delete",
  });
  response.then(() => {
    toast.success(`Запись ${record.employee.name} была успешно удалена`);
    recordsRefresh();
  });

  response.catch((e) => {
    toast.error(
      `Ошибка при удалении записи. Попробуйте снова или обратитесь к администратору. ${e}`
    );
  });
}
</script>

<template>
  <div class="space-y-3">
    <UIContainer>
      <div class="flex items-center justify-between">
        <!-- * Client info (avatar, name + email) -->
        <div class="flex gap-x-4">
          <div class="group relative flex h-24 w-24 overflow-hidden rounded-md">
            <img
              class="z-10 h-full w-full scale-150 object-cover"
              :src="`${
                config.API_BASE_URL
              }/clients/${route.params.id.toString()}/avatar`"
            />
            <div
              class="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center"
            >
              <UILoading class="fill-indigo-600" />
            </div>
            <div
              class="absolute right-0 bottom-0 left-0 z-10 hidden cursor-pointer items-center justify-around rounded-sm bg-gray-900/75 text-lg font-bold text-white group-hover:flex"
            >
              <div
                class="flex w-full items-center justify-center py-1 px-1.5 transition-colors duration-75 ease-in hover:bg-gray-500/25"
              >
                <label for="fileInput" class="cursor-pointer">
                  <UIIcon name="edit" class="mx-1 h-4 w-4" />
                </label>
                <input
                  type="file"
                  id="fileInput"
                  class="hidden"
                  ref="file"
                  accept="image/*"
                  @change="changeClientImage()"
                />
              </div>
              <div
                class="flex w-full items-center justify-center py-1 px-1.5 transition-colors duration-75 ease-in hover:bg-gray-500/25"
              >
                <UIIcon name="trash" class="mx-1 h-4 w-4" />
              </div>
            </div>
          </div>
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
                    { name: 'Удалить', icon: 'trash', event: 'deleteClient' },
                  ]"
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
                <client-only>
                  <UILoading class="fill-indigo-600" v-if="clientPending" />
                  <div
                    :class="[
                      client && client.deposit - client.score < 0
                        ? 'text-rose-500'
                        : 'text-emerald-500',
                      'flex items-center gap-x-0.5',
                    ]"
                    v-else
                  >
                    <UIIcon name="account_balance_wallet" class="text-lg" />
                    <span class="text-sm font-bold" v-if="client">
                      {{ client.deposit - client.score }}
                    </span>
                    <span class="text-xs text-gray-600" v-if="client.balance"
                      >(+{{ client.balance }})
                    </span>
                  </div>
                </client-only>
              </div>
              <!-- Taked records -->
              <!-- <div>
                <p class="text-xs text-gray-400">За неделю:</p>
                <div class="flex items-center gap-x-0.5 text-indigo-500">
                  <UIIcon name="shopping_cart" class="text-lg" />
                  <span class="text-sm font-bold">7600</span>
                </div>
              </div> -->
            </div>
          </div>
        </div>

        <!-- * Full client additional info -->
        <div class="flex">
          <table class="table-fixed text-sm">
            <thead>
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody class="text-gray-600">
              <tr class="flex">
                <td class="inline-flex w-40 px-2.5 font-bold">
                  <UIIcon name="grade" class="mr-2" />
                  Роль
                </td>
                <td class="px-2.5">
                  {{ client.role === "client" ? "Клиент" : "Сотрудник" }}
                </td>
              </tr>
              <tr class="flex">
                <td class="inline-flex w-40 px-2.5 font-bold">
                  <UIIcon name="grade" class="mr-2" />
                  Программа
                </td>
                <td class="px-2.5">
                  {{ client.program || "Не указана" }}
                </td>
              </tr>
              <tr class="flex">
                <td class="inline-flex w-40 px-2.5 font-bold">
                  <UIIcon name="group" class="mr-2" />
                  Категория
                </td>
                <td class="px-2.5">
                  {{ client.category.value }}
                </td>
              </tr>
              <tr class="flex">
                <td class="inline-flex w-40 px-2.5 font-bold">
                  <UIIcon name="subscription" class="mr-2" />
                  Абонемент
                </td>
                <td class="px-2.5">
                  {{ client.subs_fee || "Отсутствует" }}
                </td>
              </tr>
            </tbody>
          </table>
          <table class="table-fixed text-sm">
            <thead>
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody class="text-gray-600">
              <tr class="flex">
                <td class="inline-flex w-40 px-2.5 font-bold">
                  <UIIcon name="event" class="mr-2" />
                  Дата Рождения
                </td>
                <td class="px-2.5">
                  {{
                    new Date(client.birthdate).toLocaleDateString("ru") ||
                    "Не указана"
                  }}
                </td>
              </tr>
              <tr class="flex">
                <td class="inline-flex w-40 px-2.5 font-bold">
                  <UIIcon name="phone" class="mr-2" />
                  Телефон
                </td>
                <td class="px-2.5">
                  {{ client.phone || "Не указан" }}
                </td>
              </tr>
              <tr class="flex">
                <td class="inline-flex w-40 px-2.5 font-bold">
                  <UIIcon name="email" class="mr-2" />
                  Почта
                </td>
                <td class="px-2.5">
                  {{ client.email || "Не указан" }}
                </td>
              </tr>
              <tr class="flex">
                <td class="inline-flex w-40 px-2.5 font-bold">
                  <UIIcon name="check" class="mr-2" />
                  Статус
                </td>
                <td class="px-2.5">
                  {{ client.active ? "Активен" : "В архиве" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="self-start">
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
        <ul>
          <li
            class="relative flex items-center justify-between border-l py-3 pl-6"
            v-for="(activity, index) in lastActivities"
            :key="activity.id"
          >
            <div
              class="absolute -left-1 h-2 w-2 rounded-full bg-gray-400 shadow-sm shadow-gray-300"
            ></div>
            <div class="flex items-center gap-x-2">
              <img
                v-if="activity.type === 'record'"
                :src="`${config.API_BASE_URL}/clients/${activity.employeeId}/avatar`"
                class="h-10 w-10 rounded-full"
                alt=""
              />
              <UIIcon
                name="attach_money"
                class="h-10 w-10 text-emerald-500"
                v-if="activity.type === 'payment'"
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
                  />
                </p>
                <p class="text-xs text-gray-600">
                  {{ activity.comment }}
                </p>
              </div>
            </div>
            <span class="self-start pt-1 text-xs text-gray-400">{{
              new Date(activity.date).toLocaleDateString("ru")
            }}</span>
          </li>
        </ul>
      </UIContainer>
      <UIContainer class="basis-1/2">
        <UIContainerHeader
          title="Рейтинг сотрудников"
          description="С кем клиент больше всего занимается"
        />
        <client-only>
          <div
            v-show="employeesPending"
            class="mb-4 flex items-center justify-center"
          >
            <UILoading />
          </div>
        </client-only>
        <ul class="divide-y divide-gray-50">
          <li
            class="relative flex items-center justify-between py-3 pl-6"
            v-for="(employee, index) in employees"
            :key="index + employee.name"
          >
            <div class="absolute left-0 text-sm text-gray-400">
              {{ index + 1 }}
            </div>
            <div class="flex items-center gap-x-2">
              <img
                :src="`${config.API_BASE_URL}/clients/${employee.id}/avatar`"
                class="h-10 w-10 cursor-pointer rounded-full"
                alt=""
              />
              <div>
                <p class="flex items-center gap-x-2 font-bold text-gray-600">
                  {{ employee.name }}
                </p>
                <p class="text-xs text-gray-600">
                  {{ employee.program }}
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
        <UIButton-main
          name="Добавить"
          icon="plus"
          link="/records/add"
          :disabled="false"
        />
      </UIContainerHeader>

      <!-- <UILoading class="fill-gray-600" /> -->

      <table class="mt-4 w-full rounded-md bg-white text-sm">
        <thead>
          <tr class="text-md bg-stone-100 text-left text-gray-600">
            <th class="py-3 px-4">№</th>
            <th class="py-3 px-4" v-for="item in tableHeader" :key="item">
              {{ item }}
            </th>
            <th class="py-3 px-4 text-center">Действия</th>
          </tr>
        </thead>
        <tbody v-if="recordsPending || records.length === 0" class="h-48">
          <tr v-if="recordsPending">
            <client-only>
              <td colspan="7" align="center">
                <UI-loading class="fill-indigo-600"></UI-loading>
              </td>
            </client-only>
          </tr>
          <tr v-else>
            <client-only>
              <td colspan="7" align="center">
                <h3 class="text-md text-gray-800">
                  Так сложились обстоятельства, что записи отсутствуют!
                </h3>
                <div class="mt-5">
                  <UI-button-main
                    name="Можем добавить!"
                    @click="router.push('/records/add')"
                  />
                </div>
              </td>
            </client-only>
          </tr>
        </tbody>

        <tbody class="divide-y">
          <tr v-for="(record, index) in records" :key="record.id">
            <td class="py-2.5 px-3.5">{{ index + 1 }}</td>
            <td class="py-2.5 px-3.5">
              {{ new Date(record.date).toLocaleDateString("ru") }}
            </td>
            <td class="py-2.5 px-3.5">{{ record.employee.name }}</td>
            <td class="py-2.5 px-3.5">
              <span v-for="(price, index) in record.prices" :key="price.id"
                >{{ record.duration }}
              </span>
            </td>
            <td class="py-2.5 px-3.5">
              {{
                record.prices.reduce(
                  (partialSum, price) => partialSum + price.value,
                  0
                )
              }}
            </td>
            <td class="py-2.5 px-3.5 text-xs font-bold">
              <span
                :class="
                  checkStatus(record.prices) === 0
                    ? 'text-red-400'
                    : checkStatus(record.prices) === 1
                    ? 'text-orange-400'
                    : 'text-green-400'
                "
              >
                {{
                  checkStatus(record.prices) === 0
                    ? "Не оплачен"
                    : checkStatus(record.prices) === 1
                    ? "Оплачен частично"
                    : "Оплачен"
                }}
              </span>
            </td>
            <td class="py-2.5 px-3.5 text-center">
              <UIPopupMenu
                icon="more"
                :options="[
                  { name: 'Изменить', icon: 'info', event: 'editRecord' },
                  { name: 'Удалить', icon: 'trash', event: 'deleteRecord' },
                ]"
                class="text-xs"
                @editRecord="editRecord(record)"
                @deleteRecord="deleteRecord(record)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </UIContainer>

    <!-- EDIT CLIENT MODAL WINDOW -->
    <client-only>
      <UIModalEditClient
        v-model="editClientModal"
        @close="closeEditClientModal"
        :client="{
          ...client,
          birthdate:
            new Date(client.birthdate).toLocaleDateString('ru') || null,
        }"
      />
    </client-only>
  </div>
</template>
