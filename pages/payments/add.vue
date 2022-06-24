<script setup lang="ts">
import { useToast } from "vue-toastification";
import { Ref } from "vue";
import { Client } from "../../types/clientStore";

interface Payment {
  id: string;
  client: Client;
  value: string;
  comment: string;
}

const toast = useToast();

const initClient: Client = {
  name: "",
  role: "client",
};

const initPayment: Payment = {
  id: "",
  client: { ...initClient },
  value: "",
  comment: "Пополнение баланса",
};

const payments: Ref<Payment[]> = ref([
  { ...initPayment, id: Math.random().toString(16).slice(2) },
]);

const modal: Ref<boolean> = ref(false);

function addPayment() {
  payments.value.push({
    ...initPayment,
    id: Math.random().toString(16).slice(2),
  });
}

async function savePayments() {
  for (let payment of payments.value) {
    if (
      !payment.client.name ||
      !payment.value ||
      payment.value === "0" ||
      !payment.comment
    ) {
      toast.error(
        `Ошибка при добавлении платежа, проверьте правильность введенных данных!`
      );

      return;
    }

    const response = $fetch("/api/payments", {
      method: "post",
      body: {
        clientId: payment.client.id,
        value: payment.value,
        comment: payment.comment,
      },
    });

    response.then(() => {
      toast.success(
        `Платеж "${payment.client.name} - ${payment.value}" успешно добавлен!`
      );
      deletePayment(payment.id);
    });

    response.catch(() => {
      toast.error(
        "Ошибка при добавлении платежа! Попробуйте снова или обратитесь к администратору!"
      );
    });
  }
}

function deletePayment(id: string): void {
  const index = payments.value.findIndex((item: Payment) => item.id === id);

  if (payments.value.length > 1) {
    payments.value.splice(index, 1);
    return;
  }

  payments.value = [
    {
      ...initPayment,
      id: Math.random().toString(16).slice(2),
    },
  ];
}
</script>

<template>
  <div>
    <UI-container>
      <UI-container-header
        title="Платежи"
        description="Добавление новых платежей"
      >
        <UIButtonBack />
      </UI-container-header>
    </UI-container>

    <UI-container>
      <form class="flex flex-col space-y-3" @keypress.enter.prevent>
        <div
          class="flex w-full space-x-3"
          v-for="payment in payments"
          :key="payment.id"
        >
          <div class="flex basis-1/3 flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700"
              >Имя Клиента</label
            >
            <UI-input-live-search
              icon="person"
              placeholder="Иванов Иван"
              v-model="payment.client"
              type="all"
            />
          </div>
          <div class="flex basis-1/4 flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700">Сумма</label>
            <UI-input
              icon="attach_money"
              placeholder="Сумма платежа"
              mask="#######"
              v-model="payment.value"
            />
          </div>
          <div class="flex basis-1/3 flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700"
              >Комментарий</label
            >
            <UI-input
              icon="attach_money"
              placeholder="Например: Пополнение баланса"
              v-model="payment.comment"
            />
          </div>
          <div class="flex flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700">&nbsp;</label>
            <UIButtonMain
              icon="trash"
              @click.prevent="deletePayment(payment.id)"
            />
          </div>
        </div>
      </form>
      <div class="mt-4 flex items-center justify-between">
        <UIButtonMain name="Добавить" icon="plus" @click.prevent="addPayment" />
        <UIButtonMain
          name="Сохранить"
          icon="save"
          @click.prevent="savePayments"
        />
      </div>
    </UI-container>
  </div>
</template>
