<template>
  <div v-for="(field, index) in fields" :key="index" class="mb-1">
    <label :for="field.name" class="form-label">{{ field.label }}</label>

    <!-- Check for the type of input (textarea, select, or input) -->
    <input
      v-if="
        field.type === 'text' ||
        field.type === 'email' ||
        field.type === 'password'
      "
      v-model="field.value"
      :type="field.type"
      :name="field.name"
      :placeholder="field.placeholder"
      :class="['form-control', { 'is-invalid': field.error }]"
      :required="field.required"
    />
    <textarea
      v-if="field.type === 'textarea'"
      v-model="field.value"
      :name="field.name"
      :placeholder="field.placeholder"
      :class="['form-control', { 'is-invalid': field.error }]"
      :required="field.required"
    ></textarea>
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

    <!-- Display error message if validation fails -->
    <div v-if="field.error" class="invalid-feedback">{{ field.error }}</div>
  </div>

  <div class="modal-footer">
    <!-- Change the button text based on apiTitle -->
    <button type="button" @click="handleSubmit" class="btn btn-primary">
      {{ apiTitle === "update" ? "Update" : "Submit" }}
    </button>
    <button type="button" class="btn btn-danger" @click="$emit('close')">
      Close
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useApiStoreOrEdit } from "@/composables/useApiStoreOrEdit"; // Make sure to import your composable
const { $swal } = useNuxtApp();

// Define emits
const emit = defineEmits(["close", "refresh"]);
// Define props
const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  apiTitle: {
    type: String,
    default: "",
  },
  id: {
    type: [String, Number],
    default: null,
  },
});

// Define a method to handle form submission
const handleSubmit = async () => {
  // Validate form data
  let isValid = true;

  // Check for required fields based on field type
  props.fields.forEach((field) => {
    if (field.required && !field.value) {
      isValid = false;
      field.error = `${field.label} is required.`; // Display error message for required fields
    } else {
      field.error = null; // Clear error message if field is valid
    }

    // Additional validation for other field types (e.g., select, textarea)
    if (field.type === "select" && field.required && !field.value) {
      isValid = false;
      field.error = `${field.label} is required.`;
    }

    if (field.type === "textarea" && field.required && !field.value) {
      isValid = false;
      field.error = `${field.label} is required.`;
    }
  });

  if (isValid) {
    // Prepare data for submission
    const formData = props.fields.reduce((data, field) => {
      data[field.name] = field.value;
      return data;
    }, {});

    // Call the composable function to either store or update based on `apiTitle`
    const { data, error } = await useApiStoreOrEdit({
      api: "admin", // Replace with appropriate API
      id: props.apiTitle === "update" ? props.id : null, // Use ID for updating
      method: props.apiTitle === "update" ? "PATCH" : "POST", // Use PUT for updating, POST for creating
      params: () => formData,
    });
    $swal.fire({
      icon: "success",
      title: "Success",
      text: "Data saved successfully.",
      confirmButtonText: "OK",
      customClass: {
        popup: "custom-swal-popup",
      },
      didOpen: () => {
        const popup = document.querySelector(".swal2-popup");
        if (popup) {
          popup.style.gridRow = "1";
        }
      },
    });

    emit("close");
    emit("refresh");

    const backdropElement = document.querySelector(".modal-backdrop");
    if (backdropElement) {
      backdropElement.classList.remove("show");
      backdropElement.parentNode.removeChild(backdropElement);
    }
  }
};
</script>
