import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
const toast = useToast();
export interface Category {
  id: string;
  value: string;
  comment?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CategoriesState {
  indexTable: {
    header: string[];
    categories: Category[] | undefined[];
  };
  loading: boolean;
}

const state = (): CategoriesState => ({
  indexTable: {
    header: ["Категория", "Комментарии"],
    categories: [],
  },
  loading: true,
});

const getters = {};
const actions = {
  async fetchCategories() {
    this.loading = true;
    this.indexTable.categories = await $fetch("/api/categories", {
      method: "get",
    });
    this.loading = false;
  },
  async addCategory(body: Category) {
    this.loading = true;
    const response = await $fetch("/api/categories", {
      method: "post",
      body,
    });
    this.loading = false;
  },
  async updateCategory(body: Category) {
    this.loading = true;
    const response = await $fetch(`/api/categories/${body.id}`, {
      method: "put",
      body,
    });
    this.loading = false;
  },
  async removeCategory(category: Category) {
    this.loading = true;
    const response = await $fetch(`/api/categories/${category.id}`, {
      method: "delete",
    });
    this.loading = false;
    toast.success(
      `Категория ${category.value} (${category.comment}) была успешно удалена!`
    );
    return response;
  },
};

export const useCategoriesStore = defineStore("categories", {
  state,
  getters,
  actions,
});
