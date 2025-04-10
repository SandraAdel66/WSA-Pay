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
    @deleted-items="getDeletedItems"
    @get-items="getAllItems"
  />
</template>

<script setup>
import { ref } from "vue";
import Breadcrumb from "@/components/theme/Breadcrumb.vue";
import Modal from "@/components/theme/Modal.vue";
import Table from "@/components/theme/Table.vue";
import { useApiIndex } from "~/composables/useApiIndex";
const { $swal } = useNuxtApp();

const showModal = ref(false); // Control the visibility of the modal

const id = ref(null); // ID of the item being edited
const title = ref(""); // Title for the modal
const apiTitle = ref("add"); // Title for the form
// Define the fields for the dynamic form
const formFields = ref([]);
const showDeleted = ref(false); // Control the visibility of deleted items

// Handle opening the modal
const handleOpenModal = () => {
  title.value = "Add Admin"; // Set the title for adding
  formFields.value = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter your name",
      value: "",
      required: true,
      class: "form-control", // Add form-control class here
    },
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
      name: "password",
      label: "Password",
      type: "password",
      value: "",
      required: false,
      class: "form-control",
    },
  ]; // Reset form fields if needed
  showModal.value = true;
};

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
  title.value = "Edit Admin"; // Set the title for editing
  apiTitle.value = "update"; // Set the form title for editing
  showModal.value = true; // Show the modal for editing
  id.value = item.id; // Set the ID of the item being edited
  formFields.value = [
    {
      name: "name",
      label: "Name",
      type: "text",
      value: item.name,
      required: true,
      class: "form-control",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      value: item.email,
      required: true,
      class: "form-control",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      value: "",
      required: false,
      class: "form-control",
    },
    // Add more fields as necessary
  ];
}


async function handleDeleteItem(id) {
  const confirm = await $swal.fire({
    title: "Are you sure?",
    text: "You won’t be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    customClass: {
      popup: "custom-swal-popup",
    },
    didOpen: () => {
      const popup = document.querySelector(".swal2-popup");
      if (popup) popup.style.gridRow = "1";
    },
  });

  if (confirm.isConfirmed) {
    const { data, error } = useApiDelete({
      api: "admin",
      ids: [id],
    });

    $swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Item has been deleted.",
      confirmButtonText: "OK",
      customClass: {
        popup: "custom-swal-popup",
      },
      didOpen: () => {
        const popup = document.querySelector(".swal2-popup");
        if (popup) popup.style.gridRow = "1";
      },
    });
    refresh(); // Refresh the data after deletion

  }
}

async function handleDeleteSelected(ids) {
  const confirm = await $swal.fire({
    title: "Are you sure?",
    text: `You are deleting ${ids.length} item(s)!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete them!",
    customClass: {
      popup: "custom-swal-popup",
    },
    didOpen: () => {
      const popup = document.querySelector(".swal2-popup");
      if (popup) popup.style.gridRow = "1";
    },
  });

  if (confirm.isConfirmed) {
    const { data, error } = useApiDelete({
      api: "admin",
      ids,
    });

    $swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Selected items have been deleted.",
      confirmButtonText: "OK",
      customClass: {
        popup: "custom-swal-popup",
      },
      didOpen: () => {
        const popup = document.querySelector(".swal2-popup");
        if (popup) popup.style.gridRow = "1";
      },
    });
    refresh(); // Refresh the data after deletion
  }
}

function getDeletedItems() {
  showDeleted.value = true;
  return useApiIndex({
    api: "admin",
    key: "admins-deleted-list", // Use a different key to avoid conflict with default list
    watch: [], // Optional: no watchers unless you want reactivity
    params: () => ({
      page: currentPage.value,
      per_page: perPage.value,
      search: search.value,
      delete: showDeleted.value, // ✅ THIS is the main part
    }),
  });
}

function getAllItems() {
  showDeleted.value = false;
  return useApiIndex({
    api: "admin",
    key: "admins-deleted-list", // Use a different key to avoid conflict with default list
    watch: [], // Optional: no watchers unless you want reactivity
    params: () => ({
      page: currentPage.value,
      per_page: perPage.value,
      search: search.value,
      delete: showDeleted.value, // ✅ THIS is the main part
    }),
  });
}

</script>

<style scoped>
/* Add your custom styles here if needed */
</style>
