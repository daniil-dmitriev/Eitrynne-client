import { defineStore } from "pinia";
import { Client } from "../types/clientStore";

interface IRecord {
  id: string;
  date: Date;
  employee: Client | undefined;
  clients: Client[] | undefined[];
  duration: number;
}

interface IRecordState {
  records: IRecord[];
  initRecord: IRecord;
}

const state = () => ({
  records: [],
});

const getters = {
  getRecords: (state: IRecordState) => {
    return state.records;
  },
};
const actions = {
  async fetchRecords(state: IRecordState) {
    state.records = await $fetch("/api/records", { method: "get" });
  },
};

export const useRecordsStore = defineStore("records", {
  state,
  getters,
  actions,
});
