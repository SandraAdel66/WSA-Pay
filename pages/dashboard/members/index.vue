<template>
   <Breadcrumb
      title="List"
      :items="[{ label: 'list of members', to: '/members' }]"
    />
</template>


<script setup>

import Breadcrumb from '@/components/theme/Breadcrumb.vue'

definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "All Members",
});

</script>