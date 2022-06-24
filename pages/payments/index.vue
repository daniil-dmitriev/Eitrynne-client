<script setup>
const tableHeader = ["Имя клиента", "Сумма", "Комментарий"];
onMounted(() => {
  refresh();
});

const { data: payments, refresh, pending } = useFetch("/api/payments");
</script>

<template>
  <UI-container>
    <UI-container-header title="Платежи" description="Список всех платежей">
      <UIButtonBack />
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
          <td colspan="5" align="center">
            <UI-loading class="fill-indigo-600"></UI-loading>
          </td>
        </tr>
        <tr v-else>
          <td colspan="5" align="center">
            <h3 class="text-md text-gray-800">
              Так сложились обстоятельства, что платежи не найдены...
            </h3>
          </td>
        </tr>
      </tbody>
      <tbody class="divide-y" v-else>
        <tr v-for="(payment, index) in payments" :key="payment.id">
          <td class="py-2.5 px-3.5">{{ index + 1 }}</td>
          <td class="py-2.5 px-3.5">ClientName</td>
          <td class="py-2.5 px-3.5">{{ payment.value }}</td>
          <td class="py-2.5 px-3.5">{{ payment.comment }}</td>
        </tr>
      </tbody>
    </table>
  </UI-container>
</template>
