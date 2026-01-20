<template>
  <div v-for="(field, index) in processedFields" :key="index" class="mb-1">
    <label :for="field.name" class="form-label">{{ field.label }}</label>

    <!-- Text, Email, Password -->
    <input
      v-if="['text', 'email', 'password', 'date'].includes(field.type)"
      v-model="field.value"
      :type="field.type"
      :name="field.name"
      :placeholder="field.placeholder"
      class="form-control"
    />

    <!-- Textarea -->
    <textarea
      v-if="field.type === 'textarea'"
      v-model="field.value"
      :name="field.name"
      :placeholder="field.placeholder"
      class="form-control"
    ></textarea>

    <!-- Select -->
    <VSelect
      v-if="field.type === 'select'"
      v-model="field.value"
      :options="field.data || []"
      :reduce="(option) => option.id"
      :get-option-label="(option) => `${option.name}`"
    >
      <!-- Custom country display -->
      <template #option="{ name, flag }" v-if="field.name === 'country_id'">
        <img :src="flag" width="20" class="w-5 h-5 inline-block mr-1" />
        {{ name }}
      </template>
    </VSelect>

    <!-- Error message -->
    <div v-if="field.error" class="invalid-feedback">{{ field.error }}</div>
  </div>

  <!-- Modal Footer Buttons -->
  <div class="modal-footer">
    <button type="button" @click="handleSubmit" class="btn btn-primary">
      Search
    </button>
    <button type="button" @click="resetFilters" class="btn btn-primary">
      Reset
    </button>
    <button type="button" class="btn btn-danger" @click="$emit('close')">
      Close
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const { $swal } = useNuxtApp();

// Emits
const emit = defineEmits(["close", "filter-filters", "reset-filters"]);

// Props
const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },

});

// Status list
const statuses = [
  { id: "pending", name: "Pending", code: "pending" },
  { id: "approved", name: "Approved", code: "approved" },
  { id: "suspended", name: "Suspended", code: "suspended" },
  { id: "blacklisted", name: "Blacklisted", code: "blacklisted" },
];

// Status list
const currencies = [
  { id: "USD", name: "USD", code: "usd" },
  { id: "EUR", name: "EUR", code: "eur" },
  { id: "AUD", name: "AUD", code: "AUD" },
];

// Status list
const types = [
  { id: "withdraw", name: "Withdraw" },
  { id: "add", name: "Add" }
];
// Use countries composable
const { data: countries } = useCountries();

// Determine if countries should be injected
const needsCountries = computed(() =>
  props.fields.some(
    (field) => field.type === "select" && field.name === "country_id"
  )
);

// Process and enrich fields
const processedFields = computed(() => {
  return props.fields.map((field) => {
    if (field.type === "select" && field.name === "country_id") {
      return {
        ...field,
        data: needsCountries.value ? countries.value?.data || [] : [],
      };
    }
    if (field.type === "select" && field.name === "status") {
      return { ...field, data: statuses };
    }
    if (field.type === "select" && field.name === "currency") {
      return { ...field, data: currencies };
    }
    if (field.type === "select" && field.name === "type") {
      return { ...field, data: types };
    }
    return field;
  });
});

// Handle Search
const handleSubmit = async () => {
  const formValues = {};
  processedFields.value.forEach((field) => {
    formValues[field.name] = field.value;
  });
  emit("filter-filters", formValues);
};

// Handle Reset
const resetFilters = () => {
  props.fields.forEach((field) => {
    field.value = null; // or use field.default ?? null
  });
  emit("reset-filters");
};
</script>

<style>
.vs__search,
.vs__selected-options {
  font-size: 12px !important;
}
.vs__selected-options {
  padding: 5px 2px !important;
}
</style>
