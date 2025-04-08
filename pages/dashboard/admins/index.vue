<template>
  <Breadcrumb
    title="Admin"
    :items="[{ label: 'List of admins', to: '/admins' }]"
  />
  <!-- Button to trigger the modal -->
  <button
    type="button"
    class="btn btn-outline-primary"
    @click="openModal"
  >
    Add
  </button>
  <Table
    :columns="[
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
    ]"
    :data="admins.data"
    :meta="admins.meta"
    @change-page="handlePageChange"
    @change-per-page="handlePerPageChange"
    @change-search="handleSearchChange"
  />

  <!-- Modal -->
  <div
    class="modal text-left"
    v-show="showModal" 
    tabindex="-1"
    role="dialog"
    aria-labelledby="myModalLabel1"
    aria-hidden="!showModal"
    id="animation" 
  >
    <div class="modal-dialog modal-dialog-scrollable" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel1">Basic Modal with Form</h4>
          <button
            type="button"
            class="close"
            @click="closeModal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">

          <!-- Use the FormComponent and pass the formFields prop -->
          <FormComponent :fields="formFields" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="closeModal">
            Submit
          </button>
          <button type="button" class="btn btn-danger" @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import Breadcrumb from "@/components/theme/Breadcrumb.vue";
import FormComponent from "@/components/theme/FormComponent.vue";
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
    required: true,
    class: "form-control", // Add form-control class here
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter your name",
    required: true,
    class: "form-control", // Add form-control class here
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
    class: "form-control", // Add form-control class here
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    placeholder: "Enter your date",
    required: true,
    class: "form-control", // Add form-control class here
  },
]);


const openModal = () => {
  showModal.value = true;
  nextTick(() => {
    // Initialize the modal after the DOM is updated
    const modalElement = document.getElementById('animation');
    const modal = new bootstrap.Modal(modalElement);
    modal.show(); // Show the modal using Bootstrap's JavaScript API
  });
};

// Close the modal
const closeModal = () => {
  showModal.value = false;
  nextTick(() => {
    const modalElement = document.getElementById('animation');
    const modal = new bootstrap.Modal(modalElement);
    modal.hide(); // Hide the modal using Bootstrap's JavaScript API
    
    // Manually remove the backdrop (if it exists)
    const backdropElement = document.querySelector('.modal-backdrop');
    if (backdropElement) {
      backdropElement.classList.remove('show');
      // Optionally, you can remove it entirely from the DOM:
      backdropElement.parentNode.removeChild(backdropElement);
    }
  });
};

definePageMeta({
  layout: "default",
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
</script>

<style scoped>
/* Add your custom styles here if needed */
</style>
