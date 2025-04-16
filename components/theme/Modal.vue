<template>
  <transition name="fade">
    <div
      class="modal d-block text-left"
      v-if="showModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myModalLabel1"
      aria-hidden="true"
      id="animation"
    >
      <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel1">{{ title }}</h4>
            <button type="button" class="close" @click="closeModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <FormComponent
              :fields="formFields"
              @close="closeModal"
              @refresh="refresh"
              :id="id"
              :apiTitle="apiTitle"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import FormComponent from "@/components/theme/FormComponent.vue";

// Props
const props = defineProps({
  showModal: { type: Boolean, default: false },
  formFields: { type: Array, default: () => [] },
  apiTitle: { type: String, default: '' },
  title: { type: String, default: 'Modal Title' },
  id: { type: [String, Number], default: null },
  refresh: { type: Function, default: () => {} },
});

// Emits
const emit = defineEmits(['update:showModal', 'submit']);

// Close the modal
const closeModal = () => {
  emit('update:showModal', false);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
