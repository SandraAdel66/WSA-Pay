<template>
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
          :required="field.required"
           :class="field.class"
        />
        
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    fields: {
      type: Array,
      required: true,
    },
  });
  
  const formData = ref({});
  
  // Initialize formData with empty values for each field dynamically
  const initFormData = () => {
    props.fields.forEach((field) => {
      formData.value[field.name] = field.value || ''; // default value if any
    });
  };
  initFormData();
  
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
  
  const handleSubmit = () => {
    console.log('Form Data:', formData.value);
    // Perform submit logic or emit to parent, etc.
  };
  </script>
  