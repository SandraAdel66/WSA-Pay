<template>
  <Breadcrumb
    title="Admin"
    :items="[{ label: 'List of admins', to: '/admins' }]"
    :add="true"
    :filters="false"
    @openModal="openAddModal"
  />

  <!-- Modal -->
  <Modal
    :showModal="showModal"
    @update:showModal="showModal = $event"
    :formFields="formFields"
    :title="modalTitle"
    :apiTitle="apiTitle"
    :id="selectedId"
    :refresh="refresh"
  />

  <Table
    v-if="admins && admins.data"
    :columns="columns"
    :data="admins.data"
    :meta="admins.meta"
    @change-page="handlePageChange"
    @change-per-page="handlePerPageChange"
    @change-search="handleSearchChange"
    @edit-item="openEditModal"
    @delete-item="handleDeleteItem"
    @delete-selected="handleDeleteSelected"
    @deleted-items="fetchDeletedItems"
    @get-items="fetchAllItems"
    @sort-data="handleSortData"
  />
</template>

<script setup>
import { ref } from "vue";
import Breadcrumb from "@/components/theme/Breadcrumb.vue";
import Modal from "@/components/theme/Modal.vue";
import Table from "@/components/theme/Table.vue";

const { $swal } = useNuxtApp();

// Refs
const showModal = ref(false);
const modalTitle = ref("");
const apiTitle = ref("add");
const selectedId = ref(null);
const formFields = ref([]);
const showDeleted = ref(false);
const currentPage = ref(1);
const perPage = ref(5);
const search = ref("");

// Table columns
const columns = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
];

// Modal form fields
const formFieldsConfig = [
  { name: "name", label: "Name", type: "text", placeholder: "Enter your name", required: true, class: "form-control" },
  { name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true, class: "form-control" },
  { name: "password", label: "Password", type: "password", required: false, class: "form-control" },
];

// Fetch data
const { data: admins, refresh } = useApiIndex({
  api: "admin",
  key: "admins-list",
  watch: [currentPage, perPage, search],
  params: () => ({
    page: currentPage.value,
    per_page: perPage.value,
    search: search.value,
  }),
});

// ========== Modal Handlers ==========
const openAddModal = () => {
  modalTitle.value = "Add Admin";
  apiTitle.value = "add";
  selectedId.value = null;
  formFields.value = formFieldsConfig.map(field => ({ ...field, value: "" }));
  showModal.value = true;
};

const openEditModal = (item) => {
  modalTitle.value = "Edit Admin";
  apiTitle.value = "update";
  selectedId.value = item.id;
  formFields.value = formFieldsConfig.map(field => ({
    ...field,
    value: field.name === "password" ? "" : item[field.name],
  }));
  showModal.value = true;
};

// ========== Table Handlers ==========
const handlePageChange = (url) => {
  const page = new URL(url).searchParams.get("page");
  if (page) currentPage.value = Number(page);
};

const handlePerPageChange = (value) => {
  perPage.value = Number(value);
  currentPage.value = 1;
};

const handleSearchChange = (value) => {
  search.value = value;
  currentPage.value = 1;
};

// ========== Deletion ==========
const handleDeleteItem = async (id) => {
  if (await confirmDelete()) {
    const { data } = await useApiDelete({ api: "admin", ids: [id] });
    if (data) {
      showDeleteSuccess();
      refresh();
    }
  }
};

const handleDeleteSelected = async (ids) => {
  if (await confirmDelete(ids.length)) {
    const { data } = await useApiDelete({ api: "admin", ids });
    if (data) {
      showDeleteSuccess();
      refresh();
    }
  }
};

// ========== Sorting and Filter ==========
const handleSortData = (column) => {
  return useApiIndex({
    api: "admin",
    key: "admins-list",
    order_by: column.key,
    sort: column.sort,
    params: () => ({
      page: currentPage.value,
      per_page: perPage.value,
      search: search.value,
      delete: showDeleted.value,
    }),
  });
};

// ========== Deleted / All Items ==========
const fetchDeletedItems = () => {
  showDeleted.value = true;
  return fetchItems("admins-deleted-list");
};

const fetchAllItems = () => {
  showDeleted.value = false;
  return fetchItems("admins-deleted-list");
};

const fetchItems = (key) => {
  return useApiIndex({
    api: "admin",
    key,
    params: () => ({
      page: currentPage.value,
      per_page: perPage.value,
      search: search.value,
      delete: showDeleted.value,
    }),
  });
};

// ========== Alerts ==========
const confirmDelete = async (count = 1) => {
  const confirm = await $swal.fire({
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
  return confirm.isConfirmed;
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

// ========== Meta ==========
definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "Admins",
});
</script>

<style scoped>
/* Add your custom styles here */
</style>
