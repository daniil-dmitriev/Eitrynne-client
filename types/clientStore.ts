import { Category } from "~~/stores/categories";

export interface Client {
  id?: string;
  name: string;
  birthdate?: Date;
  balance?: number;
  subs_fee?: number;
  record_fee?: number;
  active?: boolean;
  email?: string;
  deposit?: number;
  score?: number;
  category?: Category;
  phone?: string;
  password?: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AddClient {
  id?: string;
  name: string;
  birthdate: string;
  role: string;
}

export interface Select {
  name: string;
  value: string;
  selected: boolean;
}

interface ClientSearch {
  name: string;
  role: string;
  balance: string;
  rowPerPage: string;
  roleOptions: Select[];
  balanceOptions: Select[];
  rowPerPageOptions: Select[];
}

interface Pagination {
  total: number;
  current: number;
}

export interface ClientIndexState {
  loading: boolean;
  error: boolean;
  indexTable: {
    header: string[];
    clients: Client[] | undefined[];
  };
  search: ClientSearch;
  pagination: Pagination;
}
export interface ClientDetailsState {
  loading: boolean;
  error: boolean;
  client: Client | null;
  activities: [];
  favoriteEmployees: [];
  records: [];
}
