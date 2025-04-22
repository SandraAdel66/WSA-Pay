<template>
  <ClientOnly>
    <Breadcrumb
      title="Transactions"
      :items="[{ label: 'List of transactions', to: '/transactions' }]"
      :add="false"
      :filter="(filter = true)"
      @open-filter="openModalFilter"
    />
  </ClientOnly>

  <ModalFilter
    v-if="filter"
    :title="'Filter Members'"
    :items="filterItems"
    :modalFilter="modalFilter"
    @close="modalFilter = false"
    @filter-filters="submitFilters"
    @reset-filters="resetFilters"
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
    :tableTitle="'transactions'"
  />
</template>
  
  <script setup>
import { ref, watch } from "vue";
import Breadcrumb from "@/components/theme/Breadcrumb.vue";
import Table from "@/components/theme/Table.vue";
import ModalFilter from "@/components/theme/ModalFilter.vue";
const currentPage = ref(1);
const perPage = ref(5);
const search = ref("");
const sortColumn = ref(null);
const sortDirection = ref(null);
const showDeleted = ref(false);

const transactions = ref(null);
const appliedFilters = ref({});

const showModal = ref(false);
const filter = ref(false);
const modalFilter = ref(false);

const filterItems = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter name",
    class: "form-control",
  },
];
// Table Columns
const columns = [
  { label: "Amount", key: "amount" },
  { label: "Balance Type", key: "type" },
  { label: "Currency", key: "currency" },
  { label: "Created At", key: "created_at" },
];

// API Data Fetch
const { data, refresh } = useApiIndex({
  api: `transactions`,
  key: "transactions-list",
  watch: [
    currentPage,
    perPage,
    search,
    sortColumn,
    sortDirection,
    showDeleted,
    appliedFilters,
  ],
  params: () => ({
    page: currentPage.value,
    per_page: perPage.value,
    search: search.value,
    order_by: sortColumn.value,
    sort: sortDirection.value,
    deleted: showDeleted.value,
    filters: {
      ...appliedFilters.value,
    },
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

// ========== Filter Submission ==========
const submitFilters = (filters) => {
  if (filters && Object.keys(filters).length > 0) {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, v]) => v !== null && v !== "" && v !== undefined
      )
    );

    appliedFilters.value = cleanedFilters;
    refresh(); // refresh the API call with updated filters
  }
};
const openModalFilter = () => {
  modalFilter.value = true;
};
// ========== Cleanup ==========
onBeforeUnmount(() => {
  appliedFilters.value = {};
});
// Cleanup applied filters when modal is closed
watch(showModal, (newValue) => {
  if (!newValue) {
    appliedFilters.value = {};
  }
});
// Cleanup applied filters when modal is closed

const resetFilters = () => {
  appliedFilters.value = {};
};
</script>
  