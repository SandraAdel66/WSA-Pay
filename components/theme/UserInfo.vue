<template>
  <div class="table-report">
    <div class="parent-image">
      <img
        src="https://api.wsa-network.com/storage/media/2023/10/11/746/PFS-100.jpg"
        alt=""
        srcset=""
      />
    </div>
    <div>
      <h4 class="text-bold-600">{{ name ?? "F.H.BERTLING AB" }}</h4>
      <p class="text-bold-700 fx-2">
        {{ name ?? "Sweden" }}, <span class="primary">Egypt</span>
      </p>
      <p
        class="text-bold-500 cursor-pointer email"
        @click="copyToClipboard(email || 'kennet.sjostrand@bertling.com')"
      >
        {{ email || "kennet.sjostrand@bertling.com" }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useNotify } from '~/composables/useNotify'
const notify = useNotify()

// Props
const props = defineProps({
  name: { type: String, default: "Sweden" },
  email: { type: String, default: "kennet.sjostrand@bertling.com" },
});

const copyToClipboard = () => {
  navigator.clipboard.writeText('kennet.sjostrand@bertling.com').then(() => {
    notify.success('Copied to clipboard!')
  }).catch(() => {
    notify.error('Failed to copy')
  })
}
</script>

<style scoped>
.user-info {
  max-width: 300px;
}
.table-report {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
.parent-image {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
}
.table-report img {
  width: 100%;
  border-radius: 5px;
  border-width: 1px;
  --tw-border-opacity: 1;
  border: 1px solid rgb(197 197 197);
  background-color: #f8f9fa;
  padding: 5px;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  height: 3.5rem;
}
.table-report h4 {
  font-size: 14px;
  line-height: 0.5;
  color: #212529;
  margin-top: 5px;
}

.table-report p {
  font-size: 13px;
  line-height: 1;
  color: #212529;
  margin-bottom: 5px;
}
.table-report b {
  font-size: 13px;
}
.table-report p.font-bold {
  font-size: 13px;
  color: #212529;
}
.email:hover {
  color: #8a7ff2;
  text-decoration: underline;
}
</style>