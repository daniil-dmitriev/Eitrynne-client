/**
 * * This is client_details-store component
 */

import { defineStore } from "pinia";
import { useClientStore } from "./client-index";
import { Client, ClientDetailsState } from "~~/types/clientStore";
import { useToast } from "vue-toastification";
const toast = useToast();

const state = (): ClientDetailsState => ({
  client: null,
  activities: [],
  favoriteEmployees: [],
  records: [],
  loading: true,
  error: false,
});

const getters = {
  getClient: (state: ClientDetailsState) => state.client,
  getClientInfo: (state: ClientDetailsState) => [
    {
      icon: "group",
      field: "Категория",
      value: state.client?.category.value || "Z",
    },
    {
      icon: "grade",
      field: "Роль",
      value: state.client.role === "client" ? "Клиент" : "Сотрудник",
    },
    {
      icon: "event",
      field: "Дата рождения",
      value: state.client.birthdate || "Не указана",
    },
    {
      icon: "call",
      field: "Телефон",
      value: state.client.phone || "Не указан",
    },
    {
      icon: "account_balance",
      field: "Абонемент",
      value: state.client.subs_fee || "Не указан",
    },
    {
      icon: "check",
      field: "Статус",
      value: state.client.active ? "Активен" : "В архиве",
    },
  ],
};
const actions = {
  //
  async fetchClient(id: string) {
    this.loading = true;
    this.client = await $fetch(`/api/clients/${id}`, { method: "get" });
    this.client.birthdate = new Date(this.client.birthdate).toLocaleDateString(
      "ru"
    );
    this.loading = false;
  },

  async updateClient() {
    const dateArray = this.client.birthdate?.split(".");
    [dateArray[0], dateArray[1]] = [dateArray[1], dateArray[0]];
    const date = dateArray.join(".");
    const response = $fetch(`/api/clients/${this.client.id}`, {
      method: "put",
      body: {
        name: this.client.name,
        birthdate: new Date(date),
        role: this.client.role,
        category: this.client.category.value,
        subs_fee: this.client.subs_fee,
        phone: this.client.phone,
        active: this.client.active,
      },
    });

    response.then(() => {
      const message = this.client.name + " был успешно обновлен";
      toast.success(message);
    });

    response.catch(() => {
      const message =
        "При обновлении " +
        this.client.name +
        " возникли неполадки. Попробуйте снова.";
      toast.error(message);
    });
  },

  async deleteClient(client: Client) {
    const clientStore = useClientStore();
    clientStore.removeClient(client);
  },
};
export const useClientDetailsStore = defineStore("clientDetails", {
  state,
  getters,
  actions,
});
