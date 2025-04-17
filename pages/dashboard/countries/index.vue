<template>
  <Breadcrumb
    title="Countries"
    :items="[{ label: 'List of countries', to: '/countries' }]"
    :add="false"
    :filters="false"
  />

  <Table
    v-if="countries && countries.data"
    :columns="columns"
    :data="countries.data"
    :meta="countries.meta"
    @change-page="handlePageChange"
    @change-per-page="handlePerPageChange"
    @change-search="handleSearchChange"
    @sort-data="handleSortData"
    @change-status="handleStatus"
    :deleteBtns="false"
    :tableTitle="'countries'"
  />
</template>
  
  <script setup>
import { ref, watch } from "vue";
import Breadcrumb from "@/components/theme/Breadcrumb.vue";
import Table from "@/components/theme/Table.vue";
const { updateStatus } = useApiStatusUpdate();

const notify = useNotify();
const currentPage = ref(1);
const perPage = ref(5);
const search = ref("");
const sortColumn = ref(null);
const sortDirection = ref(null);
const showDeleted = ref(false);

const countries = ref(null);

// Table Columns
const columns = [
  { label: "Name", key: "name" },
  { label: "Key", key: "key" },
  { label: "Active", key: "active" },
  { label: "Created At", key: "createdAt" },
];

// API Data Fetch
const { data, refresh } = useApiIndex({
  api: `country`,
  key: "countries-list",
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
    countries.value = newData;
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
const handleStatus = async ({ id, value }) => {
  await updateStatus({
    api: "country",
    id,
    status: value, // true or false
  });

  notify.success("Satus Changed Successfully");
};
</script>
  