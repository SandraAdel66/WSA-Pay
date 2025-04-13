<template>
  <Breadcrumb
    title="Admin"
    :items="[{ label: 'List of admins', to: '/admins' }]"
    :add="true"
    :filters="false"
    @openModal="openAddModal"
  />

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
    @deleted-items="showDeletedItems"
    @get-items="showAllItems"
    @sort-data="handleSortData"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useNuxtApp } from '#app'
import Breadcrumb from '@/components/theme/Breadcrumb.vue'
import Modal from '@/components/theme/Modal.vue'
import Table from '@/components/theme/Table.vue'

const { $swal } = useNuxtApp()

// Refs & Reactive States
const showModal = ref(false)
const modalTitle = ref("")
const apiTitle = ref("add")
const selectedId = ref(null)
const formFields = ref([])

const currentPage = ref(1)
const perPage = ref(5)
const search = ref("")
const sortColumn = ref(null)
const sortDirection = ref(null)
const showDeleted = ref(false)

const admins = ref(null)

// Table Columns
const columns = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },

]

// Modal Form Fields Config
const formFieldsConfig = [
  { name: "name", label: "Name", type: "text", placeholder: "Enter name", required: true, class: "form-control" },
  { name: "email", label: "Email", type: "email", placeholder: "Enter email", required: true, class: "form-control" },
  { name: "password", label: "Password", type: "password", required: false, class: "form-control" },

]

// API Data Fetch
const { data, refresh } = useApiIndex({
  api: "admin",
  key: "admins-list",
  watch: [currentPage, perPage, search, sortColumn, sortDirection, showDeleted],
  params: () => ({
    page: currentPage.value,
    per_page: perPage.value,
    search: search.value,
    order_by: sortColumn.value,
    sort: sortDirection.value,
    deleted: showDeleted.value,
  }),
})

// Sync data on change or page reload
watch(data, (newData) => {
  admins.value = newData
}, { immediate: true })

// Page Meta
definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "Admins",
})

// ========== Modal Functions ==========
const openAddModal = () => {
  modalTitle.value = "Add Admin"
  apiTitle.value = "add"
  selectedId.value = null
  formFields.value = formFieldsConfig.map(f => ({ ...f, value: "" }))
  showModal.value = true
}

const openEditModal = (item) => {
  modalTitle.value = "Edit Admin"
  apiTitle.value = "update"
  selectedId.value = item.id
  formFields.value = formFieldsConfig.map(f => ({
    ...f,
    value: f.name === "password" ? "" : item[f.name]
  }))
  showModal.value = true
}

// ========== Table Handlers ==========
const handlePageChange = (url) => {
  const page = new URL(url).searchParams.get("page")
  if (page) currentPage.value = Number(page)
}

const handlePerPageChange = (value) => {
  perPage.value = Number(value)
}

const handleSearchChange = (value) => {
  search.value = value
}

const handleSortData = (column) => {
  sortColumn.value = column.key
  sortDirection.value = column.sort
  
  
}

// ========== Deletion ==========
const handleDeleteItem = async (id) => {
  if (await confirmDelete()) {
    const { data } = await useApiDelete({ api: "admin", ids: [id] })
    if (data) {
      showDeleteSuccess()
      refresh()
    }
  }
}

const handleDeleteSelected = async (ids) => {
  if (await confirmDelete(ids.length)) {
    const { data } = await useApiDelete({ api: "admin", ids })
    if (data) {
      showDeleteSuccess()
      refresh()
    }
  }
}

// ========== Toggle Deleted ==========
const showDeletedItems = () => {
  showDeleted.value = true
  currentPage.value = 1
}

const showAllItems = () => {
  showDeleted.value = false
  currentPage.value = 1
}

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
      const popup = document.querySelector(".swal2-popup")
      if (popup) popup.style.gridRow = "1"
    }
  })
  return result.isConfirmed
}

const showDeleteSuccess = () => {
  $swal.fire({
    icon: "success",
    title: "Deleted!",
    text: "The item(s) have been deleted.",
    confirmButtonText: "OK",
    customClass: { popup: "custom-swal-popup" },
    didOpen: () => {
      const popup = document.querySelector(".swal2-popup")
      if (popup) popup.style.gridRow = "1"
    }
  })
}
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
