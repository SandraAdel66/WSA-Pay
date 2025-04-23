<template>
  <div v-for="(field, index) in fields" :key="index" class="mb-1">
    <label :for="field.name" class="form-label">{{ field.label }}</label>

    <!-- Input Types -->
    <input
      v-if="['text', 'number', 'email', 'password'].includes(field.type)"
      v-model="field.value"
      :type="field.type"
      :name="field.name"
      :placeholder="field.placeholder"
      :class="['form-control', { 'is-invalid': field.error }]"
      :required="field.required"
    />

    <!-- Textarea -->
    <textarea
      v-if="field.type === 'textarea'"
      v-model="field.value"
      :name="field.name"
      :placeholder="field.placeholder"
      :class="['form-control', { 'is-invalid': field.error }]"
      :required="field.required"
    ></textarea>

    <!-- Select -->
    <select
      v-if="field.type === 'select'"
      v-model="field.value"
      :name="field.name"
      :class="['form-control', { 'is-invalid': field.error }]"
      :required="field.required"
    >
      <option value="" disabled selected>Select an option</option>
      <option
        v-for="(option, optionIndex) in field.options"
        :key="optionIndex"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Checkbox Group -->
    <div v-if="field.type === 'checkbox'">
      <div class="divider mt-0">
    <div class="divider-text">Permissions</div>
  </div>
  <!-- Select All -->
  <fieldset class="checkbox mb-2">
    <div class="vs-checkbox-con vs-checkbox-primary">
      <input
        type="checkbox"
        :checked="isAllSelected(field)"
        @change="toggleSelectAll(field)"
      />
      <span class="vs-checkbox">
        <span class="vs-checkbox--check">
          <i class="vs-icon feather icon-check"></i>
        </span>
      </span>
      <label class="form-check-label"> All </label>
    </div>
  </fieldset>
 
  <!-- Options Grid with Bootstrap -->
  <div class="row mb-1">
    <div
      class="col-6 "
      v-for="(option, optionIndex) in field.options"
      :key="optionIndex"
    >
      <fieldset class="checkbox">
        <div class="vs-checkbox-con vs-checkbox-primary">
          <input
            type="checkbox"
            :id="option.value + index"
            :value="option.value"
            v-model="field.value"
          />
          <span class="vs-checkbox">
            <span class="vs-checkbox--check">
              <i class="vs-icon feather icon-check"></i>
            </span>
          </span>
          <label class="form-check-label" :for="option.value + index">
            {{ option.label }}
          </label>
        </div>
      </fieldset>
    </div>
  </div>
</div>


    <!-- Error Message -->
    <div v-if="field.error" class="invalid-feedback">{{ field.error }}</div>
  </div>

  <div class="modal-footer">
    <button type="button" @click="handleSubmit" class="btn btn-primary">
      {{ apiTitle === "update" ? "Update" : "Submit" }}
    </button>
    <button type="button" class="btn btn-danger" @click="$emit('close')">
      Close
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useApiStoreOrEdit } from "@/composables/useApiStoreOrEdit";
const { $swal } = useNuxtApp();

const emit = defineEmits(["close", "refresh"]);
const props = defineProps({
  apiName: String,
  fields: Array,
  apiTitle: String,
  id: [String, Number],
});

// Ensure checkbox field values are arrays
watch(
  () => props.fields,
  (fields) => {
    fields.forEach((field) => {
      if (field.type === "checkbox" && !Array.isArray(field.value)) {
        field.value = [];
      }
    });
  },
  { immediate: true, deep: true }
);

// Select all checkbox handler
const isAllSelected = (field) => {
  if (!Array.isArray(field.value)) return false;
  return field.options.every((option) =>
    field.value.includes(option.value)
  );
};

const toggleSelectAll = (field) => {
  if (isAllSelected(field)) {
    field.value = [];
  } else {
    field.value = field.options.map((option) => option.value);
  }
};

// Handle form submit
const handleSubmit = async () => {
  let isValid = true;

  props.fields.forEach((field) => {
    if (field.required && (!field.value || (Array.isArray(field.value) && field.value.length === 0))) {
      isValid = false;
      field.error = `${field.label} is required.`;
    } else {
      field.error = null;
    }
  });

  if (!isValid) return;

  const formData = props.fields.reduce((data, field) => {
    data[field.name] = field.value;
    return data;
  }, {});

  const { data, error } = await useApiStoreOrEdit({
    api: props.apiName,
    id: props.apiTitle === "update" ? props.id : null,
    method: props.apiTitle === "update" ? "PATCH" : "POST",
    params: () => formData,
  });

  $swal.fire({
    icon: "success",
    title: "Success",
    text: "Data saved successfully.",
    confirmButtonText: "OK",
    customClass: { popup: "custom-swal-popup" },
    didOpen: () => {
      const popup = document.querySelector(".swal2-popup");
      if (popup) popup.style.gridRow = "1";
    },
  });

  emit("close");
  emit("refresh");

  const backdropElement = document.querySelector(".modal-backdrop");
  if (backdropElement) {
    backdropElement.classList.remove("show");
    backdropElement.parentNode.removeChild(backdropElement);
  }
};
</script>
