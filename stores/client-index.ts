/**
 * * This is client_index-store component
 */

import { defineStore } from "pinia";
import { AddClient, Client, ClientIndexState } from "~~/types/clientStore";
import { useToast } from "vue-toastification";
import { $fetch } from "ohmyfetch";
const toast = useToast();

const state = (): ClientIndexState => ({
  indexTable: {
    header: ["ФИО", "Роль", "Дата рождения", "Баланс"],
    clients: [],
  },
  loading: true,
  error: false,

  search: {
    name: "",
    role: "all",
    balance: "all",
    rowPerPage: "25",
    balanceOptions: [
      { name: "Любой", value: "all", selected: true },
      { name: "Положительные", value: "plus", selected: false },
      { name: "Отрицательные", value: "minus", selected: false },
    ],
    roleOptions: [
      { name: "Все", value: "all", selected: true },
      { name: "Клиенты", value: "client", selected: false },
      { name: "Сотрудники", value: "employee", selected: false },
    ],
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
  },
  pagination: {
    current: 1,
    total: null,
  },
});

const getters = {
  getClients: (state: ClientIndexState) => state.indexTable.clients,
};
const actions = {
  async fetchClients() {
    this.loading = true;
    this.countClient();
    try {
      this.indexTable.clients = await $fetch(
        `/api/clients?name=${this.search.name}&role=${
          this.search.role
        }&balance=${this.search.balance}&count=${
          this.search.rowPerPage
        }&offset=${this.pagination.current - 1}`,
        {
          method: "get",
        }
      );
    } catch (e) {
      useFetch("/api/auth", {
        method: "delete",
      });
      useRouter().push("/login");
    } finally {
      this.loading = false;
    }
  },

  async countClient() {
    // name=${this.search.name}&role=${this.search.role}&balance=${this.search.balance}
    const total = await $fetch(
      `/api/clients/count?name=${this.search.name}&role=${
        this.search.role
      }&balance=${this.search.balance}&count=${this.search.rowPerPage}&offset=${
        this.pagination.current - 1
      }`,
      {
        method: "get",
        // headers: {
        //   authorization: `Bearer ${useCookie("token").value}`,
        // },
      }
    );
    this.pagination.total = parseInt(total);
  },

  async changeIndexTablePage(page: number) {
    this.pagination.current = page;
    this.fetchClients();
  },

  async saveNewClients(clients: AddClient[]) {
    for (const client of clients) {
      // * Getting date in the correct format (mm-dd-yyyy)
      const dateArray = client.birthdate?.split(".");
      [dateArray[0], dateArray[1]] = [dateArray[1], dateArray[0]];
      const date = dateArray.join(".");

      const { id, ...other } = client;
      const response = $fetch("/api/clients", {
        method: "post",
        body: {
          ...other,
          birthdate: date,
        },
      });

      response.then(() => {
        const message = client.name + " был успешно добавлен!";
        toast.success(message);
      });
    }
  },

  async removeClient(client: Client): Promise<void> {
    const response = $fetch(`/api/clients/${client.id}`, {
      method: "delete",
    });

    response.then(() => {
      const message = client.name + " был удален из системы!";
      toast.success(message);

      const deletedItemIndex = this.indexTable.clients.findIndex(
        (item: Client) => item.id === client.id
      );

      this.indexTable.clients.splice(deletedItemIndex, 1);
    });

    response.catch(() => {
      const message =
        "Ошибка при удалении посетителя. Попробуйте снова или обратитесь к администратору программы.";
      toast.error(message);
    });
  },
};

export const useClientStore = defineStore("client", {
  state,
  getters,
  actions,
});
