<template>
    <div class="col-lg-3 col-md-6 col-12">
      <div class="card">
        <div class="card-header d-flex align-items-baseline pb-0">
          <div :class="bgClss" class="avatar p-50 m-0">
            <div class="avatar-content">
              <i :class="[iconClass, colorMain]" class="font-medium-5"></i>
            </div>
          </div>
          <div>
            <h2 class="text-bold-700 mt-1 mb-25">{{ count }}</h2>
          </div>
        </div>
        <div class="card-content">
          <div class="p-2">
            <p class="mb-0">{{ label }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  defineProps({
    count: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    iconClass: {
      type: String,
      default: "feather icon-users",
    },
    colorMain: {
      type: String,
      default: "text-primary",
    },
    bgClss: {
      type: String,
      default: "bg-rgba-primary",
    },
  });
  </script>
    <style scoped>

  .card {
    border: 3px dashed #e1e1e1;
    border-radius: 10px;
  }
    </style>