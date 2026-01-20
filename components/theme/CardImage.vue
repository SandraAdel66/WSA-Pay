<template>
  <div class="country">
    <div class="d-flex">
      
      <img :src="flag" width="60" class="radius " />
      <div class="inline-grid">
          <span class="primary text-bold-600">{{ name }}</span>
        <span class="primary">{{ code }}</span>
        </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
const notify = useNotify();

// Props
const props = defineProps({
  name: {
    type: String,
    default: null,
  },

  code: {
    type: String,
    default: null,
  },
  flag: {
    type: String,
    default: null,
  },
});

const copyToClipboard = (email) => {
  navigator.clipboard
    .writeText(email)
    .then(() => {
      notify.success("Copied to clipboard!");
    })
    .catch(() => {
      notify.error("Failed to copy");
    });
};
</script>

<style scoped>
.country {
  padding: 10px 0;
}
.radius{
  border-radius: 10px;
}
.inline-grid {
  display: inline-grid;
  margin-left: 8px;
}
</style>