<template>
  <Breadcrumb
    title="Admin"
    :items="[{ label: 'List of admins', to: '/admins' }]"
    :add="true"
    :filters="false"
    @openModal="showModal = true"
  />

  <!-- Modal -->
  <Modal
    :showModal="showModal"
    @update:showModal="showModal = $event"
    :formFields="formFields"
    title="Add Admin"
  />

  <Table
    v-if="admins && admins.data"
    :columns="[
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
    ]"
    :data="admins.data"
    :meta="admins.meta"
    @change-page="handlePageChange"
    @change-per-page="handlePerPageChange"
    @change-search="handleSearchChange"
    @edit-item="handleEditItem"
    @delete-item="handleDeleteItem"
    @delete-selected="handleDeleteSelected"
  />
</template>

<script setup>
import { ref } from "vue";
import Breadcrumb from "@/components/theme/Breadcrumb.vue";
import Modal from "@/components/theme/Modal.vue";
import Table from "@/components/theme/Table.vue";
import { useApiIndex } from "~/composables/useApiIndex";

const showModal = ref(false); // Control the visibility of the modal

// Define the fields for the dynamic form
const formFields = ref([
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    value: "",
    required: true,
    class: "form-control", // Add form-control class here
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter your name",
    value: "",
    required: true,
    class: "form-control", // Add form-control class here
  },
]);

definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "Admins",
});

const currentPage = ref(1);
const perPage = ref(5);
const search = ref("");

const {
  data: admins,
  pending,
  error,
  refresh,
} = useApiIndex({
  api: "admin",
  key: "admins-list",
  watch: [currentPage, perPage, search],
  params: () => ({
    page: currentPage.value,
    per_page: perPage.value,
    search: search.value,
  }),
});

// Handle pagination and search changes
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

// Handle editing item
function handleEditItem(item) {
  showModal.value = true; // Show the modal for editing
  formFields.value = [
    {
      name: "email",
      label: "Email",
      type: "email",
      value: item.email,
      required: true,
      class: "form-control",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      value: item.name,
      required: true,
      class: "form-control",
    },
    // Add more fields as necessary
  ];
}

// Handle deleting item
function handleDeleteItem(id) {
  // Implement delete logic (e.g., call an API to delete the item)
  console.log("Deleting item with ID:", id);
}

// Handle deleting selected items
function handleDeleteSelected(ids) {
  // Implement delete logic for selected items
  console.log("Deleting selected items with IDs:", ids);
}
</script>

<style scoped>
/* Add your custom styles here if needed */
</style>
