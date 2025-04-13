<template>
  <div
    class="modal text-left"
    v-show="showModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="myModalLabel1"
    aria-hidden="!showModal"
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
          <FormComponent :fields="formFields" @close="closeModal" @refresh="refresh" :id="id" :apiTitle="apiTitle" />
        </div>
      </div>
    </div>
  </div>
</template>

  <script setup>
  import { defineProps, defineEmits, nextTick, ref, watch } from 'vue';
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
    nextTick(() => {
      const modalElement = document.getElementById("animation");
      const modal = new bootstrap.Modal(modalElement);
      modal.hide(); // Hide the modal using Bootstrap's JavaScript API

      // Manually remove the backdrop (if it exists)
      const backdropElement = document.querySelector(".modal-backdrop");
      if (backdropElement) {
        backdropElement.classList.remove("show");
        backdropElement.parentNode.removeChild(backdropElement);
      }
    });
  };

  // Open the modal using Bootstrap's Modal API
  onUpdated(() => {
    if (props.showModal) {
      const modalElement = document.getElementById("animation");
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Show the modal when showModal is true
    }
  });
  </script>
