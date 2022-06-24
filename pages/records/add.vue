<script setup lang="ts">
import { useToast } from "vue-toastification";
import { Ref } from "vue";
import { Client } from "../../types/clientStore";

interface IRecord {
  id: string;
  employee: Client;
  clients: Client[];
  date: string;
  duration: string;
}

const toast = useToast();
const durationOptions = [
  { value: "30", name: "30" },
  { value: "45", name: "45" },
  { value: "60", name: "60" },
  { value: "90", name: "90" },
];

const initRecord: IRecord = {
  id: Math.random().toString(16).slice(2),
  employee: {
    name: "",
    role: "employee",
  },
  clients: [],
  date: "",
  duration: "45",
};
const records: Ref<IRecord[]> = ref([{ ...initRecord }]);

function addRecord() {
  const [lastRecord] = records.value.slice(-1);
  records.value.push({
    ...initRecord,
    id: Math.random().toString(16).slice(2),
    employee: lastRecord.employee || null,
    date: lastRecord.date || "",
    duration: lastRecord.duration || "",
  });
}

async function saveRecords() {
  for (let record of records.value) {
    try {
      const { id, ...body } = record;
      const recordDate = body.date + "." + new Date().getFullYear();
      const dateArray = recordDate.split(".");
      [dateArray[0], dateArray[1]] = [dateArray[1], dateArray[0]];
      const date = dateArray.join(".");

      const response = $fetch("/api/records", {
        method: "post",
        body: { ...body, date, duration: parseInt(body.duration) },
      });

      response.then(() => {
        toast.success(
          `Запись для ${record.employee.name} была успешно добавлена!`
        );
      });
    } catch (e) {
      toast.error(
        "При добавлнеии записи возникли ошибки! Попробуйте снова или обратитесь к адмиинистратору!"
      );
      console.log(e);
    } finally {
      records.value = [
        {
          ...initRecord,
          id: Math.random().toString(16).slice(2),
          employee: { name: "", role: "employee" },
          clients: [],
        },
      ];
    }
  }
}
</script>

<template>
  <div class="space-y-3">
    <UIContainer>
      <UIContainerHeader title="Записи" description="Добавление новой записи">
        <UIButtonBack />
      </UIContainerHeader>
    </UIContainer>

    <UIContainer>
      <form class="flex flex-col space-y-3">
        <div
          class="flex w-full space-x-3"
          v-for="record in records"
          :key="record.id"
        >
          <div class="flex basis-1/3 flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700"
              >Имя сотрудника</label
            >
            <UIInputLiveSearch
              icon="person"
              placeholder="Иванов Иван"
              v-model="record.employee"
              type="employee"
            />
          </div>
          <div class="flex basis-1/6 flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700">Дата</label>
            <UIInput
              icon="event"
              placeholder="Дата"
              mask="##.##"
              v-model="record.date"
            />
          </div>
          <div class="flex basis-full flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700"
              >Клиенты</label
            >
            <UIInputLiveSearchMultiplie
              icon="person"
              placeholder="Начните вводить имя клиента"
              v-model="record.clients"
            />
          </div>
          <div class="flex basis-4 flex-col space-y-1.5">
            <label class="pl-1.5 text-xs font-bold text-gray-700"
              >Длительность</label
            >
            <UISelect
              icon="timer"
              :options="durationOptions"
              v-model="record.duration"
            />
          </div>
        </div>
      </form>
      <div class="mt-4 flex items-center justify-between">
        <UIButtonMain name="Добавить" icon="add" @click.prevent="addRecord" />
        <UIButtonMain
          name="Сохранить"
          icon="save"
          @click.prevent="saveRecords"
        />
      </div>
    </UIContainer>
  </div>
</template>

<style lang="css">
/* .page-enter-active,
.page-leave-active {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-duration: 500ms;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
} */
</style>
