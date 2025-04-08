<script setup lang="ts">
const toast = useToastStore();
import { ref, watch } from 'vue';

const showToast = ref(true);

// Automatically hide the toast after the specified duration
const hideToast = (duration: number) => {
  setTimeout(() => {
    showToast.value = false;
  }, duration);
};

// Watch for changes to toast items and reset the visibility
watch(() => toast.items, () => {
  showToast.value = true;
  hideToast(5000); // 5000ms = 5 seconds
});
</script>

<template>
  <div
    v-for="(item, index) in toast.items"
    :key="item.key"
    v-show="showToast"
    :class="['toast', `toast-${item.type}`, { 'show': showToast }]"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    :data-autohide="false"
    @transitionend="hideToast(item.duration || 5000)"
  >
    <div class="">

      <button
        type="button"
        class="mr-1 mt-1 close"
        data-dismiss="toast"
        aria-label="Close"
        @click="toast.removeToast(index)"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="toast-body">
      <strong>{{ item.title }}</strong>
      <p>{{ item.message }}</p>
    </div>
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1050;
  opacity: 0;
  width: 300px;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  transform: translateX(100%);
}

.toast.show {
  opacity: 1;
  transform: translateX(0);
}

.toast-header {
  display: flex;
  align-items: center;
}

.toast-header img {
  width: 30px;
  height: 30px;
}

.toast-header .close {
  color: inherit;
  background: transparent;
  border: none;
  font-size: 1.5rem;
}

.toast-body {
  padding: 10px;
}

.toast-error {
  background-color: #f44336;
  color: white;
  border-left: 5px solid #d32f2f;
}

.toast-success {
  background-color: #4caf50;
  color: white;
  border-left: 5px solid #388e3c;
}

.toast-info {
  background-color: #2196f3;
  color: white;
  border-left: 5px solid #1976d2;
}

.toast-warning {
  background-color: #ff9800;
  color: white;
  border-left: 5px solid #f57c00;
}

.toast-error .close,
.toast-success .close,
.toast-info .close,
.toast-warning .close {
  color: white;
}

.toast-body p {
  font-size: 0.875rem;
  margin: 0;
}

.toast-body strong {
  font-weight: bold;
  font-size: 1rem;
}
</style>
