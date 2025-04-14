<template>
  <Breadcrumb
    title="Memebers"
    :items="[{ label: 'List of members', to: '/members' }]"
    :add="true"
    :filter="(filter = true)"
    @open-filter="openModalFilter"
    @openModal="openAddModal"
  />
  <div class="row">
    <Card
      count="1.2M"
      label="Pending"
      iconClass="feather icon-clock"
      colorMain="text-primary"
      bgClss="bg-rgba-primary"
    />
    <Card
      count="1.2M"
      label="Approved"
      iconClass="feather icon-users"
      colorMain="text-success"
      bgClss="bg-rgba-success"
    />
    <Card
      count="1.2M"
      label="Suspended"
      iconClass="feather icon-circle"
      colorMain="text-primary"
      bgClss="bg-rgba-primary"
    />
    <Card
      count="1.2M"
      label="Deactivate"
      iconClass="feather icon-lock"
      colorMain="text-danger"
      bgClss="bg-rgba-danger"
    />
  </div>

  <Modal
    :showModal="showModal"
    @update:showModal="showModal = $event"
    :formFields="formFields"
    :title="modalTitle"
    :apiTitle="apiTitle"
    :id="selectedId"
    :refresh="refresh"
  />
  <ModalFilter
    v-if="filter"
    :title="'Filter Members'"
    :items="filterItems"
    :modalFilter="modalFilter"
    @close="modalFilter = false"
  />
  <Table
    v-if="members && members.data"
    :columns="columns"
    :data="members.data"
    :meta="members.meta"
    @change-page="handlePageChange"
    @change-per-page="handlePerPageChange"
    @change-search="handleSearchChange"
    @edit-item="openEditModal"
    @delete-item="handleDeleteItem"
    @delete-selected="handleDeleteSelected"
    @deleted-items="showDeletedItems"
    @get-items="showAllItems"
    @sort-data="handleSortData"
  />
</template>

<script setup>
import { ref, watch } from "vue";
import { useNuxtApp } from "#app";
import Breadcrumb from "@/components/theme/Breadcrumb.vue";
import Modal from "@/components/theme/Modal.vue";
import ModalFilter from "@/components/theme/ModalFilter.vue";
import Card from "@/components/theme/Card.vue";

import Table from "@/components/theme/Table.vue";

const { $swal } = useNuxtApp();

// Refs & Reactive States
const showModal = ref(false);
const filter = ref(false);

const modalTitle = ref("");
const apiTitle = ref("add");
const selectedId = ref(null);
const formFields = ref([]);

const currentPage = ref(1);
const perPage = ref(5);
const search = ref("");
const sortColumn = ref(null);
const sortDirection = ref(null);
const showDeleted = ref(false);
const modalFilter = ref(false);

console.log(modalFilter.value);

const members = ref(null);

const filterItems = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter name",
    class: "form-control",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email",
    class: "form-control",
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    class: "form-control",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    class: "form-control",
  },
];

// Table Columns
const columns = [
  { label: "Name", key: "name" },
  { label: "Status", key: "status" },

];

// Modal Form Fields Config
const formFieldsConfig = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter name",
    required: true,
    class: "form-control",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email",
    required: true,
    class: "form-control",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: false,
    class: "form-control",
  },
];

// API Data Fetch
const { data, refresh } = useApiIndex({
  api: "members",
  key: "members-list",
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
    members.value = newData;
  },
  { immediate: true }
);

// Page Meta
definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "members",
});

// ========== Modal Functions ==========
const openAddModal = () => {
  modalTitle.value = "Add Memeber";
  apiTitle.value = "add";
  selectedId.value = null;
  formFields.value = formFieldsConfig.map((f) => ({ ...f, value: "" }));
  showModal.value = true;
};

const openEditModal = (item) => {
  modalTitle.value = "Edit Memeber";
  apiTitle.value = "update";
  selectedId.value = item.id;
  formFields.value = formFieldsConfig.map((f) => ({
    ...f,
    value: f.name === "password" ? "" : item[f.name],
  }));
  showModal.value = true;
};

// ===================================

const openModalFilter = () => {
  modalFilter.value = true;
};
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

// ========== Deletion ==========
const handleDeleteItem = async (id) => {
  if (await confirmDelete()) {
    const { data } = await useApiDelete({ api: "members", ids: [id] });
    if (data) {
      showDeleteSuccess();
      refresh();
    }
  }
};

const handleDeleteSelected = async (ids) => {
  if (await confirmDelete(ids.length)) {
    const { data } = await useApiDelete({ api: "members", ids });
    if (data) {
      showDeleteSuccess();
      refresh();
    }
  }
};

// ========== Toggle Deleted ==========
const showDeletedItems = () => {
  showDeleted.value = true;
  currentPage.value = 1;
};

const showAllItems = () => {
  showDeleted.value = false;
  currentPage.value = 1;
};

// ========== Alerts ==========
const confirmDelete = async (count = 1) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `You’re deleting ${count} item(s)!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    customClass: { popup: "custom-swal-popup" },
    didOpen: () => {
      const popup = document.querySelector(".swal2-popup");
      if (popup) popup.style.gridRow = "1";
    },
  });
  return result.isConfirmed;
};

const showDeleteSuccess = () => {
  $swal.fire({
    icon: "success",
    title: "Deleted!",
    text: "The item(s) have been deleted.",
    confirmButtonText: "OK",
    customClass: { popup: "custom-swal-popup" },
    didOpen: () => {
      const popup = document.querySelector(".swal2-popup");
      if (popup) popup.style.gridRow = "1";
    },
  });
};
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
