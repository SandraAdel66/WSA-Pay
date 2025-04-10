<template>
  <Breadcrumb
    title="Admin"
    :items="[{ label: 'List of admins', to: '/admins' }]"
    :add="true"
    :filters="false"
    @openModal="handleOpenModal"
  />

  <!-- Modal -->
  <Modal
    :showModal="showModal"
    @update:showModal="showModal = $event"
    :formFields="formFields"
    :title="title"
    :apiTitle="apiTitle"
    :id="id"
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
    @edit-item="handleEditItem"
    @delete-item="handleDeleteItem"
    @delete-selected="handleDeleteSelected"
    @deleted-items="getDeletedItems"
    @get-items="getAllItems"
  />
</template>

<script setup>
import { ref } from "vue";
import Breadcrumb from "@/components/theme/Breadcrumb.vue";
import Modal from "@/components/theme/Modal.vue";
import Table from "@/components/theme/Table.vue";
const { $swal } = useNuxtApp();

// Reusable constants and state
const showModal = ref(false);
const id = ref(null);
const title = ref("");
const apiTitle = ref("add");
const formFields = ref([]);
const showDeleted = ref(false);

const columns = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
];

const formFieldsConfig = [
  { name: "name", label: "Name", type: "text", placeholder: "Enter your name", required: true, class: "form-control" },
  { name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true, class: "form-control" },
  { name: "password", label: "Password", type: "password", required: false, class: "form-control" },
];
const currentPage = ref(1);
const perPage = ref(5);
const search = ref("");
// API Hook for fetching admins
const { data: admins, pending, error, refresh } = useApiIndex({
  api: "admin",
  key: "admins-list",
  watch: [currentPage, perPage, search],
  params: () => ({ page: currentPage.value, per_page: perPage.value, search: search.value }),
});



// Handlers
const handleOpenModal = () => {
  title.value = "Add Admin";
  formFields.value = formFieldsConfig.map(field => ({ ...field, value: "" }));
  showModal.value = true;
};

const handleEditItem = (item) => {
  title.value = "Edit Admin";
  apiTitle.value = "update";
  showModal.value = true;
  id.value = item.id;
  formFields.value = formFieldsConfig.map(field => ({
    ...field,
    value: field.name === "password" ? "" : item[field.name],
  }));
};

// Pagination and Search Handlers
function handlePageChange(url) {
  const page = new URL(url).searchParams.get("page");
  if (page) currentPage.value = Number(page);
}

function handlePerPageChange(value) {
  perPage.value = Number(value);
  currentPage.value = 1;
}

function handleSearchChange(value) {
  search.value = value;
  currentPage.value = 1;
}

// Delete Handlers
async function handleDeleteItem(id) {
  const confirm = await confirmDelete();
  if (confirm) {
    const { data, error } = await useApiDelete({ api: "admin", ids: [id] });
    if (data) {
      showSuccessAlert();
      refresh();
    }
  }
}

async function handleDeleteSelected(ids) {
  const confirm = await confirmDelete(ids.length);
  if (confirm) {
    const { data, error } = await useApiDelete({ api: "admin", ids });
    if (data) {
      showSuccessAlert();
      refresh();
    }
  }
}

async function confirmDelete(itemCount = 1) {
  const confirm = await $swal.fire({
    title: "Are you sure?",
    text: `You’re deleting ${itemCount} item(s)!`,
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
}

function showSuccessAlert() {
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
}

// Fetch deleted items
function getDeletedItems() {
  showDeleted.value = true;
  return useApiIndex({
    api: "admin",
    key: "admins-deleted-list",
    params: () => ({
      page: currentPage.value,
      per_page: perPage.value,
      search: search.value,
      delete: showDeleted.value,
    }),
  });
}

function getAllItems() {
  showDeleted.value = false;
  return useApiIndex({
    api: "admin",
    key: "admins-deleted-list",
    params: () => ({
      page: currentPage.value,
      per_page: perPage.value,
      search: search.value,
      delete: showDeleted.value,
    }),
  });
}

definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "Admins",
});
</script>

<style scoped>
/* Add your custom styles here */
</style>
