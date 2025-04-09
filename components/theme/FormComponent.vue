<template>
  <div>
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
          :options="field.options"
          :class="[
            'form-control',
            FormError && !validity[field.name] ? 'is-invalid' : ''
          ]"
          :value="formData[field.name] || field.value"
          @blur="validateField(field)"
        />

        <!-- Validation error message, shown only when field is empty and form is submitted -->
        <span v-if="FormError && !validity[field.name]" class="invalid-feedback">This field is required.</span>
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
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const FormError = ref(false); // Error message for form submission
const formData = ref({}); // Form data
const validity = ref({}); // Tracks validity of each field

// Reset formData to null for empty values (when modal opens)
const resetFormData = () => {
  props.fields.forEach((field) => {
    formData.value[field.name] = field.value || '';  // Set form field to field.value (if available) or empty string
    validity.value[field.name] = true; // Set initial validity to true
  });
};

// Watch for changes in isEditing and reset formData when false (Add mode)
watch(() => props.isEditing, (newVal) => {
  if (!newVal) {
    resetFormData();  // Reset fields when isEditing is false (Add mode)
  }
});

// Initialize formData and validity state when modal opens
onMounted(() => {
  if (!props.isEditing) {
    resetFormData(); // Reset fields for the Add form when the component is mounted in Add mode
  }
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
    if (field.type === 'email') {
      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      validity.value[field.name] = emailRegex.test(formData.value[field.name]);
    } else {
      // Check for empty value
      validity.value[field.name] = formData.value[field.name] !== '';
    }
  }
};

// Handle form submission
const handleSubmit = () => {
  FormError.value = false;  // Reset FormError before submission

  let isValid = true;

  // Validate all fields before submission
  props.fields.forEach((field) => {
    if (field.required) {
      if (field.type === 'email') {
        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        validity.value[field.name] = emailRegex.test(formData.value[field.name]);
      } else {
        validity.value[field.name] = formData.value[field.name] !== '';  // Validate for empty fields only
      }
      isValid = isValid && validity.value[field.name];  // Check if all required fields are valid
    }
  });

  FormError.value = !isValid;  // Set FormError to true if the form is invalid

  if (isValid) {
    // Proceed with the form submission
    console.log('Form is valid, submitting...');
  } else {
    console.log('Form is invalid, please correct the errors.');
  }
};
</script>
