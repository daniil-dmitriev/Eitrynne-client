<script setup>
import { useToast } from "vue-toastification";
import PopupMenu from "~~/components/UI/PopupMenu.vue";
const toast = useToast();
onMounted(() => {
  refresh();
});
const router = useRouter();

const search = ref({
  recordPaymentStatus: "all",
  recordPaymentStatusOptions: [
    {
      name: "Все",
      value: "all",
    },

    {
      name: "Оплаченные",
      value: "paid",
    },
    {
      name: "Неоплаченные",
      value: "unpaid",
    },
  ],
  rowPerPage: "25",
  rowPerPageOptions: [
    {
      name: "25",
      value: "25",
      selected: true,
    },
    {
      name: "50",
      value: "50",
      selected: false,
    },
    {
      name: "100",
      value: "100",
      selected: false,
    },
  ],
});

const tableHeader = ["Дата", "Сотрудник", "Клиенты", "Стоимость", "Статус"];

const { data: records, pending, refresh, error } = useLazyFetch(`/api/records`);

function checkStatus(prices) {
  let status = 0;

  for (let price of prices) {
    if (price.status === true) status++;
  }

  switch (status) {
    case prices.length:
      return 2;
      break;
    case 0:
      return 0;
      break;
    default:
      return 1;
      break;
  }
}

function getDebetors(prices) {
  return prices.map((item) => ({
    id: item.id,
    name: item.client.name,
    value: item.value,
    status: item.status,
  }));
}

function editRecord(record) {
  console.log("editRecord function handler >>>", record);
}

function deleteRecord(record) {
  const response = $fetch(`/api/records/${record.id}`, {
    method: "delete",
  });
  response.then(() => {
    toast.success(`Запись ${record.employee.name} была успешно удалена`);
    refresh();
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
      <UIContainerHeader
        title="Фильтры"
        description="Для сортировки данных воспользуйтесь фильтрами, представленными ниже:"
      >
        <UIButtonBack />
      </UIContainerHeader>
      <form class="mt-5 flex items-start space-x-3">
        <div class="flex basis-1/3 flex-col space-y-1.5">
          <label class="pl-1.5 text-xs font-bold text-gray-700"
            >Статус записи</label
          >
          <UI-select
            :options="search.recordPaymentStatusOptions"
            v-model="search.recordPaymentStatus"
            :loading="false"
            icon="attach_money"
          />
        </div>
        <div class="flex basis-1/3 flex-col space-y-1.5">
          <label class="pl-1.5 text-xs font-bold text-gray-700"
            >Количество строк в странице таблицы</label
          >
          <UI-select
            :options="search.rowPerPageOptions"
            v-model="search.rowPerPage"
            :loading="false"
            icon="format_list_numbered"
          ></UI-select>
        </div>
      </form>
    </UIContainer>
    <UIContainer>
      <UIContainerHeader
        title="Записи"
        description="Список всех записей клиентов в студии"
      >
        <UIButtonMain name="Добавить" icon="plus" link="/records/add" />
      </UIContainerHeader>

      <!-- Records table -->
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
        <tbody v-if="pending || records.length == 0" class="h-96">
          <tr v-if="pending">
            <client-only>
              <td colspan="6" align="center">
                <UI-loading class="fill-indigo-600"></UI-loading>
              </td>
            </client-only>
          </tr>
          <tr v-else>
            <client-only>
              <td colspan="6" align="center">
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
                >{{ price.client.name }}
                {{ record.prices.length - 1 != index ? "- " : "" }}</span
              >
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
                class="flex items-center justify-between"
              >
                {{
                  checkStatus(record.prices) === 0
                    ? "Не оплачен"
                    : checkStatus(record.prices) === 1
                    ? "Оплачен частично"
                    : "Оплачен"
                }}
                <UI-tooltip>
                  <span
                    v-for="debetor in getDebetors(record.prices)"
                    :key="debetor.id"
                    class="block font-bold"
                    :class="!debetor.status ? 'text-red-400' : 'text-green-500'"
                  >
                    {{ `${debetor.name} (${debetor.value})` }}</span
                  >
                </UI-tooltip>
              </span>
            </td>
            <td class="py-2.5 px-3.5 text-center">
              <UIPopupMenu
                icon="more"
                :options="[
                  // { name: 'Изменить', icon: 'info', event: 'editRecord' },
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
    <!-- <UIModalEditRecords
      :show="showAddRecords"
      @close="showAddRecords = false"
    /> -->
  </div>
</template>
