<template>
  <Breadcrumb
    title="Admin"
    :items="[{ label: 'List of admins', to: '/admins' }]"
  />

  <Table
    :columns="[
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' }
    ]"
    :data="admins.data"
    :meta="admins.meta"
    @change-page="handlePageChange"
    @change-per-page="handlePerPageChange"
    @change-search="handleSearchChange"
  />
</template>

<script setup>
import Breadcrumb from "@/components/theme/Breadcrumb.vue";
import Table from "@/components/theme/Table.vue";
import { useApiIndex } from "~/composables/useApiIndex";

definePageMeta({
  layout: "default",
});

const currentPage = ref(1);
const perPage = ref(5);
const search = ref("");

const { data: admins, pending, error, refresh } = useApiIndex({
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
