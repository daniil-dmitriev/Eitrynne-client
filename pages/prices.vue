<script setup>
import { useToast } from "vue-toastification";

const toast = useToast();
const { data: categories } = useFetch("/api/categories", { method: "get" });
const { data: prices } = useFetch("/api/prices", { method: "get" });
const { data: employees } = useFetch(
  "/api/clients?count=5&offset=0&role=employee&balance=all&name=",
  {
    method: "get",
  }
);
const saveDisabled = ref(true);
const changedPrices = [];
const changedEmployees = [];

function handleChangePrice(id, value) {
  changedPrices.push({
    id,
    value: value | 0,
  });
  saveDisabled.value = false;
}
function handleChangeEmployee(employee, value) {
  employee.record_fee = parseInt(value);
  changedEmployees.push({
    ...employee,
  });

  saveDisabled.value = false;
}

async function savePrices() {
  try {
    for (let updatedPrice of changedPrices) {
      await $fetch(`/api/prices/${updatedPrice.id}`, {
        method: "put",
        body: {
          value: updatedPrice.value,
        },
      });
    }
  } catch (e) {
    toast.error(
      "При обновлении расценок произошла ошибка! Попробуйте снова или обратитесь к администратору!"
    );
    return;
  }

  try {
    for (let updatedEmployee of changedEmployees) {
      await $fetch(`/api/clients/${updatedEmployee.id}`, {
        method: "put",
        body: {
          record_fee: updatedEmployee.record_fee,
          category: updatedEmployee.category.value,
        },
      });
    }
  } catch (e) {
    toast.error(
      `При обновлении ставок произошла ошибка! Попробуйте снова или обратитесь к администратору! ${e}`
    );
    return;
  }

  toast.success("Цены сотрудников были успешно обновлены!");
  saveDisabled.value = true;
}
</script>

<template>
  <div class="space-y-3">
    <UIContainer>
      <UIContainerHeader
        title="Прайс-лист"
        description="Расценки педагогов студии"
      >
        <UIButtonBack />
      </UIContainerHeader>
    </UIContainer>
    <UIContainer class="!px-0">
      <UIContainerHeader
        description="Для добавление новой категории или педагога, перейдите в соответствующий раздел системы"
        class="px-5"
      >
        <UIButtonMain
          name="Сохранить"
          icon="save"
          :disabled="saveDisabled"
          @click.prevent="savePrices"
        />
      </UIContainerHeader>
      <table class="mt-4 rounded-md bg-white text-sm">
        <thead>
          <tr class="text-md divide-x bg-stone-100 text-center text-gray-600">
            <td class="py-3 px-4">Имя педагога</td>
            <td class="py-3 px-4">Ставка</td>
            <td
              v-for="category in categories"
              :key="category.id"
              class="py-3 px-4 font-bold"
            >
              {{ category.value.toUpperCase() }}
            </td>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="employee in employees" :key="employee.id" class="divide-x">
            <td class="py-1.5 px-4">{{ employee.name }}</td>
            <td class="py-1.5 px-4">
              <UIInput
                icon="currency_ruble"
                class="text-gray-600"
                :iconLast="true"
                :noBorder="true"
                v-model="employee.record_fee"
                @change="handleChangeEmployee(employee, $event.target.value)"
                mask="########"
              />
            </td>
            <td
              v-for="price in prices.filter(
                (item) => item.employee.id === employee.id
              )"
              :key="price.id"
              class="py-1.5 px-4"
            >
              <UIInput
                icon="currency_ruble"
                class="text-gray-600"
                :iconLast="true"
                :noBorder="true"
                v-model="price.value"
                @change="handleChangePrice(price.id, $event.target.value)"
                mask="########"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </UIContainer>
  </div>
</template>
