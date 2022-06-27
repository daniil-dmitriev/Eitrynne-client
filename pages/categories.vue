<script setup>
import { useToast } from "vue-toastification";

const toast = useToast();

const {
  data: categories,
  pending,
  refresh,
} = useLazyFetch("/api/categories", {
  method: "get",
});
const tableHeader = ["Категория", "Комментарий"];

const category = ref({
  modal: false,
  data: {
    id: "",
    value: "",
    comment: "",
  },
});

const deleteCategory = ref({
  modal: false,
  data: {},
});

function toggleEditCategory(item) {
  category.value.data = item;
  category.value.modal = true;
}

function toggleDeleteCategory(item) {
  deleteCategory.value.data = item;
  deleteCategory.value.modal = true;
}

function confirmDeleteCategory() {
  const response = $fetch(`/api/categories/${deleteCategory.value.data.id}`, {
    method: "delete",
  });
  response.then(() => {
    deleteCategory.value.modal = false;
    toast.success(
      `Категория ${deleteCategory.value.data.value} успешно удалена`
    );
    refresh();
  });
  response.catch(() => {
    deleteCategory.value.modal = false;
    toast.error(
      "Во время удаления произогла ошибка! Попробуйте снова или обратитесь к администратору."
    );
  });
}

function toggleAddCategory() {
  category.value = {
    modal: true,
    data: {
      id: "",
      value: "",
      coomment: "",
    },
  };
}

function confirmAddCategory() {
  if (!category.value.data.id) {
    const response = $fetch("/api/categories", {
      method: "post",
      body: category.value.data,
    });

    response.then(() => {
      category.value.modal = false;
      toast.success(
        `Категория ${category.value.data.value} была успешно добавлена!`
      );
      refresh();
    });
    response.catch((e) => {
      category.value.modal = false;
      toast.error(
        `Ошибка при добавлении категории! Повторите снова или обратитесь к администратору. ${e}`
      );
    });
  } else {
    const response = $fetch(`/api/categories/${category.value.data.id}`, {
      method: "put",
      body: category.value.data,
    });
    response.then(() => {
      category.value.modal = false;
      toast.success(
        `Обновление категории «${category.value.data.value}» произведено успешно!`
      );
      refresh();
    });
    response.catch((e) => {
      category.value.modal = false;
      toast.error(
        `При обновление категории «${category.value.data.value}» возникла ошибка! Попробуйте снова или обратитесь к администратору программы! ${e}`
      );
    });
  }
}
</script>

<template>
  <div>
    <UIContainer>
      <UIContainerHeader
        title="Категории"
        description="Категории посетителей студии, на основании которых система проводит все необходимые вычисления."
      >
        <div class="flex justify-end">
          <UIButtonMain name="Добавить" icon="plus" @click="toggleAddCategory" />
          <UIButtonBack :loading="false" />
        </div>
      </UIContainerHeader>
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
        <tbody v-if="pending" class="h-96">
          <tr>
            <td colspan="4" align="center">
              <UILoading class="fill-indigo-600" />
            </td>
          </tr>
        </tbody>

        <tbody v-if="categories && !categories.length" class="h-96">
          <tr>
            <td colspan="6" align="center">
              <h3 class="text-md text-gray-800">
                Так сложились обстоятельства, что категории не найдены!
              </h3>
            </td>
          </tr>
        </tbody>
        <tbody class="divide-y" v-else>
          <tr v-for="(item, index) in categories" :key="item.id">
            <td class="py-2.5 px-3.5">
              {{ index + 1 }}
            </td>
            <td class="py-2.5 px-3.5">
              {{ item.value.toUpperCase() }}
            </td>
            <td class="py-2.5 px-3.5 first-letter:uppercase">
              {{ item.comment }}
            </td>
            <td class="py-2.5 px-3.5 text-center">
              <UIPopupMenu
                icon="more_vert"
                :options="[
                  { name: 'Изменить', icon: 'info', event: 'editCategory' },
                  { name: 'Удалить', icon: 'delete', event: 'deleteCategory' },
                ]"
                @editCategory="toggleEditCategory(item)"
                @deleteCategory="toggleDeleteCategory(item)"
                class="text-xs"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </UIContainer>
    <UIModalConfirm
      v-show="!pending"
      header="Вы действительно хотите удалить данную категорию?"
      description="При удалении категории также удалятся все посетители, имеющие данную категорию (100шт)!"
      v-model="deleteCategory"
      @confirm="confirmDeleteCategory()"
      @cancel="deleteCategory.modal = false"
    />
    <UIModalCategories
      v-model="category"
      @close="category.modal = false"
      @add="confirmAddCategory()"
    />
  </div>
</template>
