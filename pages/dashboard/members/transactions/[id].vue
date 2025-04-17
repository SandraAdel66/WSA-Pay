<template>
  <Breadcrumb
    title="Member Transactions"
    :items="[{ label: 'List of transactions', to: '/transactions' }]"
    :add="false"
    :filters="false"
  />

  <Table
    v-if="transactions && transactions.data"
    :columns="columns"
    :data="transactions.data"
    :meta="transactions.meta"
    @change-page="handlePageChange"
    @change-per-page="handlePerPageChange"
    @change-search="handleSearchChange"
    @sort-data="handleSortData"
    :deleteBtns="false"

  />
</template>

<script setup>
import { ref, watch } from "vue";
import Breadcrumb from "@/components/theme/Breadcrumb.vue";
import Table from "@/components/theme/Table.vue";

const route = useRoute();
const memberId = route.params.id;

const currentPage = ref(1);
const perPage = ref(5);
const search = ref("");
const sortColumn = ref(null);
const sortDirection = ref(null);
const showDeleted = ref(false);

const transactions = ref(null);

// Table Columns
const columns = [
  { label: "Amount", key: "amount" },
  { label: "Balance Type", key: "type" },
  { label: "Currency", key: "currency" },
  { label: "Created At", key: "created_at" },

];

// API Data Fetch
const { data, refresh } = useApiIndex({
  api: `history-wallet-transactions/${memberId}`,
  key: "transactions-list",
  watch: [currentPage, perPage, search, sortColumn, sortDirection, showDeleted],
  params: () => ({
    page: currentPage.value,
    per_page: perPage.value,
    search: search.value,
    order_by: sortColumn.value,
    sort: sortDirection.value,
    deleted: showDeleted.value,
  }),
});
// Sync data on change or page reload
watch(
  data,
  (newData) => {
    transactions.value = newData;
  },
  { immediate: true }
);

// Page Meta
definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "Transactions",
});

// ========== Table Handlers ==========
const handlePageChange = (url) => {
  const page = new URL(url).searchParams.get("page");
  if (page) currentPage.value = Number(page);
};

const handlePerPageChange = (value) => {
  perPage.value = Number(value);
};

const handleSearchChange = (value) => {
  search.value = value;
};

const handleSortData = (column) => {
  sortColumn.value = column.key;
  sortDirection.value = column.sort;
};


</script>
