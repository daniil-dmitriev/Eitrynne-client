<script setup>
import {useFetch, useHead, useLazyFetch} from "nuxt/app";
import {ref} from "vue";
import InputLiveSearchMultiplie from "~/components/UI/InputLiveSearchMultiplie";
import {useToast} from "vue-toastification";

useHead({
  title: "Eitrynne. Отчеты"
})





const toast = useToast();
// report options
const reportOptions = [
  {
    value: 'all',
    name: "По всем"
  },
  {
    value: "single",
    name: "По одному"
  },
]
const reportOption = ref("all")
const dates = ref({
  begin: "",
  end: new Date(Date.now()).toLocaleDateString("ru")
})
const clients = ref([])

const {data: reportData, refresh} = useLazyFetch("/api/reports", {
  method: "post",
  body: {
    dates: dates.value,
    type: reportOption.value,
    clients: clients.value
  }
})

async function createReport() {
  if (!dates.value.begin) return toast.error(`Укажите дату с которой необходимо формировать отчет`);

  await refresh();
}

</script>

<template>
  <div>
  <UIContainer>
    <UIContainerHeader title="Отчеты" description="Формирование отчетов по записям студии. Статистические отчеты.">
      <div class="flex justify-between items-center">
      <UIButtonMain icon="plus" name="Сформировать отчет" @click.prevent="createReport" />
      <UIButtonBack />
      </div>
    </UIContainerHeader>
    <form class="flex space-x-3">
      <div class="flex basis-1/3 flex-col space-y-1.5">
        <label class="pl-1.5 text-xs font-bold text-gray-700">Парамерты отчета</label>
        <UI-select
            :options="reportOptions"
            v-model="reportOption"
            icon="list"
        />
      </div>
      <div class="flex basis-1/3 flex-col space-y-1.5" v-show="reportOption === 'single'">
        <label class="pl-1.5 text-xs font-bold text-gray-700">Начальная дата отчета</label>
<!--        <InputLiveSearchMultiplie icon="person" placeholder="Введите имя клиента" v-model="clients" />-->
      </div>
      <div class="flex basis-1/3 flex-col space-y-1.5">
        <label class="pl-1.5 text-xs font-bold text-gray-700">Начальная дата отчета</label>
        <UI-input icon="event" mask="##.##.####" placeholder="Начальная дата" v-model="dates.begin" />
      </div>
      <div class="flex basis-1/3 flex-col space-y-1.5">
        <label class="pl-1.5 text-xs font-bold text-gray-700">Конечная дата отчета</label>
        <UI-input icon="event" mask="##.##.####" placeholder="Конечная дата" v-model="dates.end" />
      </div>
    </form>
  </UIContainer>
    <UI-container>
      {{reportData}}
    </UI-container>
  </div>
</template>