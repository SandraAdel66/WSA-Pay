<template>
  <section id="data-list-view" class="data-list-view-header">
    <div class="action-btns d-none">
      <div class="btn-dropdown mr-1 mb-1">
        <div class="btn-group dropdown actions-dropodown">
          <button
            type="button"
            class="btn btn-white px-1 py-1 dropdown-toggle waves-effect waves-light"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Actions
          </button>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="#"
              ><i class="feather icon-trash"></i>Delete</a
            >
            <a class="dropdown-item" href="#"
              ><i class="feather icon-archive"></i>Archive</a
            >
            <a class="dropdown-item" href="#"
              ><i class="feather icon-file"></i>Print</a
            >
            <a class="dropdown-item" href="#"
              ><i class="feather icon-save"></i>Another Action</a
            >
          </div>
        </div>
      </div>
    </div>

    <!-- add new sidebar starts -->
    <div class="add-new-data-sidebar">
      <div class="overlay-bg" :class="{ show: modalFilter }"></div>
      <div class="add-new-data" :class="{ show: modalFilter }">
        <div
          class="div mt-2 px-2 d-flex new-data-title justify-content-between"
        >
          <div>
            <h4 class="text-uppercase">{{ title }}</h4>
          </div>
          <div class="hide-data-sidebar" @click="closeModal">
            <i class="feather icon-x"></i>
          </div>
        </div>
        <div class="pb-2">
          <div class="data-fields px-2 py-2">
            <FilterComponent
              :fields="items"
              @close="closeModal"
              :id="id"
              :title="title"
              @filter-filters="submitFilters"
              @reset-filters="resetFilters"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- add new sidebar ends -->
  </section>
  <!-- Data list view end -->
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import FilterComponent from "@/components/theme/FilterComponent.vue";

// Props
const props = defineProps({
  title: { type: String, default: "" },
  items: {
    type: Array,
    default: () => [],
  },
  modalFilter: { type: Boolean, default: false },
});

// Emits
const emit = defineEmits(["close", "submit", "filter-filters", "reset-filters"]);

// Close the modal
const closeModal = () => {
  emit("close", false);
};
// Submit the filters
const submitFilters = (filters) => {
  emit("filter-filters", filters);
  
};
// Reset the filters
const resetFilters = () => {
  // Emit the reset-filters event to the parent component
  emit("reset-filters");
};
</script>
