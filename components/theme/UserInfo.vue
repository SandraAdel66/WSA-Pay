<template>
  <div class="table-report">
    <div class="parent-image">
      <img
        :src="logo ?? '/app-assets/images/logo/no-image-icon.png'"
        class="companYlogo"
        srcset=""
      />
    </div>
    <div>
      <h4 class="text-bold-600">{{ name ?? "F.H.BERTLING AB" }}</h4>
      <p class="text-bold-700 fx-2 ">
        <img :src="countryFlag" width="20" class="radius-2">
        {{ city ?? "Sweden" }}, <span class="primary">{{countryName}}</span>
      </p>
      
      <p
        class="text-bold-700 cursor-pointer email"
        @click="copyToClipboard(email)"
      >
      <i class="feather icon-mail"></i>
        {{ email }}
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
  logo: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    city: {
        type: String,
        default: null,
    },
    countryFlag: {
        type: String,
        default: null,
    },
    
    countryName: {
        type: String,
        default: null,
    },
    
});

const copyToClipboard = (email) => {
  navigator.clipboard.writeText(email).then(() => {
    notify.success('Copied to clipboard!')
  }).catch(() => {
    notify.error('Failed to copy')
  })
}


</script>

<style scoped>

</style>