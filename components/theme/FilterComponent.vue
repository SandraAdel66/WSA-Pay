<template>
 
 <div v-for="(field, index) in processedFields" :key="index" class="mb-1">
  <label :for="field.name" class="form-label">{{ field.label }}</label>

  <input
    v-if="['text', 'email', 'password'].includes(field.type)"
    v-model="field.value"
    :type="field.type"
    :name="field.name"
    :placeholder="field.placeholder"
    class="form-control"
  />
  <textarea
    v-if="field.type === 'textarea'"
    v-model="field.value"
    :name="field.name"
    :placeholder="field.placeholder"
    class="form-control"
  ></textarea>

  <VSelect
    v-if="field.type === 'select'"
    v-model="field.value"
    :options="field.data || []"
    :reduce="option => option.code"
    :get-option-label="option => `${option.name}`"
  >
    <template #option="{ name, flag }" v-if="field.name === 'country'">
      <img :src="flag" width="20" class="w-5 h-5 inline-block mr-1" />
      {{ name }}
    </template>
  </VSelect>

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
import { ref, computed } from 'vue'
const { $swal } = useNuxtApp()

// Emits
const emit = defineEmits(['close', 'refresh'])

// Props
const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  apiTitle: {
    type: String,
    default: '',
  },
  id: {
    type: [String, Number],
    default: null,
  },
})

// ✅ Status list
const statuses = [
  { name: 'Pending', code: 'pending' },
  { name: 'Approved', code: 'approved' },
  { name: 'Suspended', code: 'suspended' },
  { name: 'Blacklisted', code: 'blacklisted' },
]

// ✅ Call unconditionally, but use only if needed
const { data: countries } = useCountries()

// ✅ Determine if countries should be injected
const needsCountries = computed(() =>
  props.fields.some(field => field.type === 'select' && field.name === 'country')
)

// ✅ Process fields
const processedFields = computed(() => {
  return props.fields.map(field => {
    if (field.type === 'select' && field.name === 'country') {
      return { ...field, data: needsCountries.value ? countries.value?.data || [] : [] }
    }
    if (field.type === 'select' && field.name === 'status') {
      return { ...field, data: statuses }
    }
    return field
  })
})

const handleSubmit = async () => {
  // your submit logic
}
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