<template>
  <ul>
    <li
      v-for="item in menuItems"
      :key="item.name"
      class="relative flex items-center justify-between text-sm"
    >
      <!-- LeftSide indicator -->
      <div
        class="absolute -left-6 h-10 w-2 rounded-md bg-indigo-600"
        v-if="router.currentRoute.value.path === item.link"
      ></div>
      <!-- Dropdown Menu Element -->
      <div v-if="item.items" class="w-full cursor-pointer py-3">
        <div
          class="absolute -left-6 top-2 h-10 w-2 rounded-md bg-indigo-600"
          v-if="
            item.items.find(
              (nestedItem) => nestedItem.link === router.currentRoute.value.path
            )
          "
        ></div>
        <button
          class="flex items-center space-x-4"
          :class="{
            'font-bold text-indigo-600': item.items.find(
              (nestedItem) => nestedItem.link === router.currentRoute.value.path
            ),
          }"
          @click="item.expanded = !item.expanded"
        >
          <UI-icon
            :name="item.icon"
            class="ml-3 mr-2 w-8 transition-transform group-hover:translate-x-0"
            :loading="loading"
          />
          <span
            class="w-full translate-x-20 transition-transform group-hover:translate-x-0 group-hover:delay-100"
          >
            {{ item.name }}
          </span>
          <UI-icon
            name="arrow_drop_down"
            class="absolute right-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 group-hover:delay-200 group-hover:duration-500"
            :loading="loading"
          />
        </button>

        <ul
          class="mt-2 flex h-0 translate-x-52 flex-col justify-center overflow-hidden transition-transform delay-200 group-hover:translate-x-0 group-hover:delay-200"
          :class="item.expanded ? `group-hover:h-auto` : 'group-hover:h-0'"
        >
          <li
            v-for="nestedItem in item.items"
            :key="nestedItem.name"
            class="ml-5 border-l border-gray-200 text-xs"
          >
            <NuxtLink
              :to="nestedItem.link"
              class="ml-2 flex cursor-pointer items-center py-2 pl-4 hover:bg-slate-50"
              :class="{
                'font-semibold text-indigo-600':
                  router.currentRoute.value.fullPath === nestedItem.link,
              }"
            >
              <UI-icon
                :name="nestedItem.icon"
                class="mr-4 w-4"
                :loading="loading"
              />
              <span class="w-full">
                {{ nestedItem.name }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
      <!-- Simple Menu Link -->
      <NuxtLink
        :to="item.link"
        class="flex w-64 cursor-pointer items-center space-x-4 py-3 hover:bg-slate-50"
        :class="{
          'font-semibold text-indigo-600':
            router.currentRoute.value.fullPath === item.link,
        }"
        v-else
      >
        <UI-icon :name="item.icon" class="ml-2.5 mr-2.5" />
        <span
          class="translate-x-20 transition-transform group-hover:translate-x-0 group-hover:delay-100"
        >
          {{ item.name }}
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { Ref } from "vue";

const router = useRouter();

const loading = ref(false);

onMounted(() => {
  loading.value = false;
});

const menuItems: Ref = ref([
  {
    name: "Главная",
    link: "/",
    icon: "home",
  },
  {
    name: "Записи",
    icon: "library_books",
    items: [
      {
        name: "Все записи",
        link: "/records",
        icon: "list",
      },
      {
        name: "Добавить записи",
        link: "/records/add",
        icon: "playlist_add",
      },
    ],
    expanded: true,
  },
  {
    name: "Клиенты",
    icon: "group",
    items: [
      {
        name: "Все клиенты",
        link: "/clients",
        icon: "group_add",
      },
      {
        name: "Добавить клиентов",
        link: "/clients/add",
        icon: "group_add",
      },
      {
        name: "Категории",
        link: "/categories",
        icon: "grade",
      },
      {
        name: "Прайс-лист",
        link: "/prices",
        icon: "currency_ruble",
      },
    ],
    expanded: true,
  },
  {
    name: "Платежи",
    link: "/payments",
    icon: "attach_money",
    items: [
      {
        name: "Все платежи",
        link: "/payments",
        icon: "payments",
      },
      {
        name: "Добавить платежи",
        link: "/payments/add",
        icon: "plus",
      },
    ],
    expanded: true,
  },
  {
    name: "Отчеты",
    link: "/reports",
    icon: "summarize",
  },
  {
    name: "Сборы",
    link: "/camps",
    icon: "campaign",
  },
]);
</script>
