<template>
  <div class="">
    <form @submit.prevent="handleSubmit">
      <div v-for="(field, index) in fields" :key="index" class="form-group">
        <label :for="field.name">{{ field.label }}</label>

        <!-- Render input field dynamically based on type -->
        <component
          :is="getFieldComponent(field)"
          v-model="formData[field.name]"
          :name="field.name"
          :type="field.type"
          :placeholder="field.placeholder"
          :value="field.value"
          :options="field.options"
          :class="['form-control', field.required && !validity[field.name] ? 'is-invalid' : '']"
          @blur="validateField(field)"
        />

        <!-- Validation error message -->
        <div v-if="field.required && !validity[field.name]" class="invalid-feedback">
          This field is required.
        </div>
      </div>

      <div class="modal-footer">
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
        <button type="button" class="btn btn-danger" @click="$emit('close')">
          Close
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
});

const formData = ref({});
const validity = ref({}); // Tracks validity of each field

// Initialize formData and validity state
const initFormData = () => {
  props.fields.forEach((field) => {
    formData.value[field.name] = field.value || '';
    validity.value[field.name] = true;
  });
};

onMounted(() => {
  initFormData();

  // Watch input changes for real-time validation
  props.fields.forEach((field) => {
    watch(() => formData.value[field.name], (newValue) => {
      if (field.required) {
        validity.value[field.name] = newValue !== '';
      }
    });
  });
});

// Determine which component to render
const getFieldComponent = (field) => {
  switch (field.type) {
    case 'select':
      return 'select';
    case 'textarea':
      return 'textarea';
    default:
      return 'input';
  }
};

// Validate a single field
const validateField = (field) => {
  if (field.required) {
    validity.value[field.name] = formData.value[field.name] !== '';
  }
};

// Handle form submission
const handleSubmit = () => {
  props.fields.forEach((field) => {
    if (field.required) {
      validity.value[field.name] = formData.value[field.name] !== '';
    }
  });

  const isFormValid = Object.values(validity.value).every((valid) => valid);

  if (isFormValid) {
    console.log('Form Data:', formData.value);
    // Emit data or send to API here
  } else {
    console.log('Form is invalid');
  }
};
</script>

