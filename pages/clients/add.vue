<template>
  <div>
    <UI-container>
      <UI-container-header
        title="Клиенты"
        description="Добавление нового клиента"
      >
        <UI-button-back />
      </UI-container-header>
      <form>
        <div
          v-for="client in addClients.data"
          :key="client.id"
          class="mt-5 grid grid-cols-5 items-start space-x-3"
        >
          <div class="relative flex flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700"
              >Имя (ФИО)</label
            >
            <UI-input
              placeholder="Иванов Иван"
              v-model="client.name"
              icon="person"
              :loading="loading"
              class="text-gray-600"
            />
            <!-- Error displaying  -->
            <span
              class="absolute -bottom-4 left-0 right-0 text-[0.6rem] text-red-500"
              >{{ client.errors ? client.errors.name : "" }}</span
            >
          </div>
          <div class="relative flex flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700"
              >Дата рождения</label
            >
            <UI-input
              mask="##.##.####"
              placeholder="01.01.1970"
              v-model="client.birthdate"
              icon="event"
              :loading="loading"
              class="text-gray-600"
            />
          </div>
          <div class="flex flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700"
              >Тип посетителя</label
            >
            <UI-select
              :options="clientType"
              v-model="client.role"
              icon="grade"
              :loading="loading"
            ></UI-select>
          </div>
          <div class="relative flex flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700"
              >Категория</label
            >
            <UI-input
              mask="A"
              placeholder="Введите категорию"
              v-model="client.category"
              icon="group"
              :loading="loading"
              class="text-gray-600"
            />
            <!-- Error displaying  -->
            <span
              class="absolute -bottom-4 left-0 right-0 text-[0.6rem] text-red-500"
              >{{ client.errors ? client.errors.category : "" }}</span
            >
          </div>
          <div class="flex flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700">&nbsp;</label>
            <div class="flex justify-between text-sm">
              <div class="flex items-center gap-x-2 text-gray-600">
                <input
                  type="checkbox"
                  class="cursor-pointer accent-indigo-600"
                  v-model="client.camp"
                />
                Посетитель сборов
              </div>
              <UI-button-main
                icon="trash"
                class="scale-125"
                @click="deleteClient(client.id)"
                :disabled="loading"
              />
            </div>
          </div>
        </div>
      </form>
      <div class="mt-4 flex items-center justify-between">
        <UI-button-main
          icon="add"
          name="Добавить еще одного"
          @click.prevent="addClient"
          :disabled="loading"
        ></UI-button-main>
        <UI-button-main
          icon="save"
          name="Сохранить"
          @click="toggleSaveClients"
          :disabled="loading"
        ></UI-button-main>
      </div>
    </UI-container>
    <UI-modal-confirm
      v-model="addClients"
      @cancel="addClients.modal = false"
      @confirm="confirmSaveClients()"
      header="Добавить новых клиентов в базу данных?"
      description="Перед добавлением убедитесь в правильности введенных данных!"
    />
  </div>
</template>

<script setup lang="ts">
import { useClientStore } from "~~/stores/client-index";
import { Ref } from "vue";
import { storeToRefs } from "pinia";
import { Client } from "~~/types/clientStore";

const route = useRoute();
// * notifications

const clientStore = useClientStore();
// TODO: change loading variable
// const { loading } = storeToRefs(clientStore);
const loading = false;
const addClients: Ref = ref({
  modal: false,
  data: [
    {
      id: Math.random().toString(16).slice(2),
      name: "",
      birthdate: "",
      role: "client",
      category: "z",
      camp: false,
      errors: {},
    },
  ],
});

if (route.query.name) {
  addClients.value.data[0].name = route.query.name;
}
const clientType = [
  { name: "Клиент", value: "client", selected: true },
  { name: "Сотрудник", value: "employee", selected: false },
];

// push new empty client to array
function addClient() {
  addClients.value.data.push({
    id: Math.random().toString(16).slice(2),
    name: "",
    birthdate: "",
    role: "client",
    category: "z",
    camp: false,
    errors: {},
  });
}

// toggle modal save window
function toggleSaveClients() {
  let errors = false;
  addClients.value.data.forEach((item) => {
    // Name validation
    if (item.name.length > 3) {
      item.errors = { ...item.errors, name: "" };
    }

    if (item.name.length < 4) {
      item.errors = { ...item.errors, name: "Некорректное имя клиента" };
    }

    // Category validation
    if (item.category.length === 1) {
      item.errors = { ...item.errors, category: "" };
    }

    if (item.category.length === 0) {
      item.errors = {
        ...item.errors,
        category: "Некорректная категория",
      };
    }
    errors =
      item.errors.name.length > 0 || item.errors.category.length > 0
        ? true
        : false;
  });
  if (errors) return;

  addClients.value.modal = true;
}
function deleteClient(id: string) {
  const index = addClients.value.data.findIndex(
    (item: Client) => item.id === id
  );

  if (addClients.value.data.length > 1) {
    addClients.value.data.splice(index, 1);
    return;
  }
  addClients.value.data = [
    {
      id: Math.random().toString(16).slice(2),
      name: "",
      birthdate: "",
      role: "client",
      category: "z",
      camp: false,
      errors: {},
    },
  ];
}
function confirmSaveClients() {
  const response = clientStore.saveNewClients(addClients.value.data);
  response.then(() => {
    addClients.value.modal = false;
    addClients.value.data = [
      {
        id: Math.random().toString(16).slice(2),
        name: "",
        birthdate: "",
        role: "client",
        category: "z",
        camp: false,
        errors: {},
      },
    ];
  });
}
</script>
