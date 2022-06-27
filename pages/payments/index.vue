<script setup>
import { useToast } from "vue-toastification";

const toast = useToast();

const tableHeader = ["Имя клиента", "Сумма", "Комментарий", "Дата"];
onMounted(() => {
  refresh();
});

const { data: payments, refresh, pending } = useFetch("/api/payments");

function deletePayment(payment) {
  const response = $fetch(`/api/payments/${payment.id}`, {
    method: "delete",
  });

  response.then(() => {
    toast.success(
      `Платеж ${payment.client.name} - ${payment.value} (${payment.comment}) удален!`
    );

    refresh();
  });

  response.catch((e) => {
    toast.error(
      `Ошибка при удалении платежа! Попробуйте снва или обратитесь к администратору! ${e}`
    );
  });
}
</script>

<template>
  <UI-container>
    <UI-container-header title="Платежи" description="Список всех платежей">
      <div class="flex">
        <UIButtonMain name="Добавить" icon="plus" link="/payments/add" />
        <UIButtonBack />
      </div>
    </UI-container-header>
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
      <tbody v-if="pending || payments.length == 0" class="h-96">
        <tr v-if="pending">
          <td colspan="6" align="center">
            <UI-loading class="fill-indigo-600"></UI-loading>
          </td>
        </tr>
        <tr v-else>
          <td colspan="6" align="center">
            <h3 class="text-md text-gray-800">
              Так сложились обстоятельства, что платежи не найдены...
            </h3>
          </td>
        </tr>
      </tbody>
      <tbody class="divide-y" v-else>
        <tr v-for="(payment, index) in payments" :key="payment.id">
          <td class="py-2.5 px-3.5">{{ index + 1 }}</td>
          <td class="py-2.5 px-3.5">{{ payment.client.name }}</td>
          <td class="py-2.5 px-3.5">{{ payment.value }}</td>
          <td class="py-2.5 px-3.5">{{ payment.comment }}</td>
          <td class="py-2.5 px-3.5">
            {{ new Date(payment.date).toLocaleDateString("ru") }}
          </td>
          <td class="py-2.5 px-3.5">
            <UIPopupMenu
              icon="more"
              :options="[
                { name: 'Удалить', icon: 'trash', event: 'deletePayment' },
              ]"
              class="text-xs"
              @deletePayment="deletePayment(payment)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </UI-container>
</template>
