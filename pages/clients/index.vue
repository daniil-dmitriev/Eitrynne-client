<script setup>
import { useClientStore } from "~~/stores/client-index";
import { storeToRefs } from "pinia";

const router = useRouter();
const clientStore = useClientStore();

const { search, loading, pagination } = storeToRefs(clientStore);

onMounted(() => {
  // Fetching client list from database table
  clientStore.fetchClients();
});

// deleteClient
const deleteClient = ref({
  modal: false,
  client: null,
});

clientStore.$subscribe((mutation) => {
  if (
    (mutation.events.key === "role") |
    (mutation.events.key === "balance") |
    (mutation.events.key === "rowPerPage")
  ) {
    clientStore.fetchClients();
  }
});

function changePage(page) {
  if (
    page < 1 ||
    page > Math.ceil(clientStore.pagination.total / search.rowPerPage)
  ) {
    return;
  }
  clientStore.changeIndexTablePage(page);
  window.scrollTo(0, 0);
}

/**
 *
 * @param client: client object from table
 * @function toggleDeleteClient: toggle modal window for confirm deleting client
 */
function toggleDeleteClient(client) {
  if (!client) return;
  deleteClient.value.modal = true;
  deleteClient.value.client = client;
}

/**
 *
 * @param client client object from table
 * @function confirmDeleteClient deleteClient from database
 */
function confirmDeleteClient(client) {
  // TODO: add remove client query to database with api
  clientStore.removeClient(client);

  deleteClient.value.modal = false;
  // TODO: add notification
}
</script>

<template>
  <div class="space-y-3">
    <UI-container>
      <!-- Header -->
      <UI-container-header
        title="Фильтры"
        description="Для сортировки данных в таблице воспользуйтесь фильтрами,
            представленными ниже:"
      >
        <UI-button-back />
      </UI-container-header>

      <form class="mt-5 flex items-start space-x-3">
        <div class="flex basis-1/3 flex-col space-y-1.5">
          <label class="pl-1.5 text-xs font-bold text-gray-700">Роль</label>
          <UI-select
            :options="search.roleOptions"
            v-model="search.role"
            :loading="loading"
            icon="grade"
          />
        </div>
        <div class="flex basis-1/3 flex-col space-y-1.5">
          <label class="pl-1.5 text-xs font-bold text-gray-700">Баланс</label>
          <UI-select
            :options="search.balanceOptions"
            v-model="search.balance"
            :loading="loading"
            icon="attach_money"
          ></UI-select>
        </div>
        <div class="flex basis-1/3 flex-col space-y-1.5">
          <label class="pl-1.5 text-xs font-bold text-gray-700"
            >Количество строк в странице таблицы</label
          >
          <UI-select
            :options="search.rowPerPageOptions"
            v-model="search.rowPerPage"
            :loading="loading"
            icon="format_list_numbered"
          ></UI-select>
        </div>
      </form>
    </UI-container>
    <UI-container class="!px-0 !py-0">
      <UI-container-header
        title="Клиенты"
        description="Список всех клиентов студии"
        class="px-5 pt-3"
      >
        <div class="flex basis-1/3 items-center space-x-3">
          <UIInput
            type="text"
            placeholder="Поиск по клиентам..."
            class="text-sm text-gray-600"
            v-model="search.name"
            @change="clientStore.fetchClients()"
            icon="search"
            :loading="loading"
          />
          <UI-button-main
            name="Добавить"
            icon="plus"
            link="/clients/add"
            :disabled="loading"
          />
        </div>
      </UI-container-header>

      <!-- Content of page -->
      <table class="mt-4 w-full rounded-md bg-white text-sm">
        <thead>
          <tr class="text-md bg-stone-100 text-left text-gray-600">
            <th class="py-3 px-4">№</th>
            <th
              class="py-3 px-4"
              v-for="item in clientStore.indexTable.header"
              :key="item"
            >
              {{ item }}
            </th>
            <th class="py-3 px-4 text-center">Действия</th>
          </tr>
        </thead>
        <tbody
          v-if="
            clientStore.loading || clientStore.indexTable.clients.length == 0
          "
          class="h-96"
        >
          <tr v-if="clientStore.loading">
            <td colspan="6" align="center">
              <UI-loading class="fill-indigo-600"></UI-loading>
            </td>
          </tr>
          <tr v-else>
            <td colspan="6" align="center">
              <h3 class="text-md text-gray-800">
                Так сложились обстоятельства, что
                {{
                  search.role !== "all"
                    ? search.roleOptions.find(
                        (item) => item.value === search.role
                      ).name
                    : "Посетители"
                }}
                {{ search.name ? "с именем «" + search.name + "»" : "" }}
                не найдены...
              </h3>
              <div class="mt-5">
                <UI-button-main
                  name="Можем добавить!"
                  @click="router.push('/clients/add?name=' + search.name)"
                />
              </div>
            </td>
          </tr>
        </tbody>

        <tbody class="divide-y" v-else>
          <tr
            v-for="(item, index) in clientStore.indexTable.clients"
            :key="item.id"
          >
            <td class="py-2.5 px-3.5">
              {{
                index +
                1 +
                (clientStore.pagination.current - 1) * search.rowPerPage
              }}
            </td>
            <td class="py-2.5 px-3.5">
              {{ item.name }}
            </td>
            <td class="py-2.5 px-3.5">
              {{ item.role === "client" ? "Клиент" : "Сотрудник" }}
            </td>
            <td class="py-2.5 px-3.5">
              {{
                item.birthdate
                  ? new Date(item.birthdate).toLocaleDateString("ru")
                  : "Не указана"
              }}
            </td>
            <td
              :class="[
                { 'font-bold text-red-500': item.deposit - item.score < 0 },
                { 'font-bold text-green-500': item.deposit - item.score > 0 },
                'py-2.5 px-3.5',
              ]"
            >
              {{ item.deposit - item.score }}
              <span
                v-if="item.balance"
                class="font-regular text-xs text-gray-600"
                >(+{{ item.balance }})</span
              >
            </td>
            <!-- <td class="py-2.5 px-3.5" v-html="item.lastActivity"></td> -->
            <td class="py-2.5 px-3.5 text-center">
              <UIPopupMenu
                icon="more"
                :options="[
                  { name: 'Подробнее', icon: 'info', event: 'detailsClient' },
                  { name: 'Удалить', icon: 'trash', event: 'deleteClient' },
                ]"
                @detailsClient="router.push('/clients/' + item.id)"
                @deleteClient="toggleDeleteClient(item)"
                class="text-xs"
              />
            </td>
          </tr>
          <tr>
            <td class="py-2.5" colspan="6">
              <UI-pagination
                :total="pagination.total"
                :count="parseInt(search.rowPerPage)"
                :current="pagination.current"
                @change="changePage"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </UI-container>

    <!-- Modal Windows -->
    <!-- Delete client confirm -->
    <UI-modal-confirm
      v-model="deleteClient"
      @cancel="deleteClient.modal = false"
      @confirm="confirmDeleteClient(deleteClient.client)"
      header="Вы действительно хотите удалить данного клиента?"
      description="Записи данного клиента не будут удалены из системы"
    />
  </div>
</template>
