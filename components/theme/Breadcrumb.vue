<template>
  <div class="content-header row">
    <div class="content-header-left col-md-9 col-12 mb-2">
      <div class="row breadcrumbs-top">
        <div class="col-12">
          <h2 class="content-header-title float-left mb-0">
            {{ title }}
          </h2>
          <div class="breadcrumb-wrapper col-12">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <NuxtLink to="/">dashboard</NuxtLink>
              </li>
              <li
                v-for="(item, index) in items"
                :key="index"
                class="breadcrumb-item"
                :class="{ active: index === items.length - 1 }"
              >
                <span v-if="index === items.length - 1">{{ item.label }}</span>
                <NuxtLink v-else :to="item.to">{{ item.label }}</NuxtLink>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <div class="content-header-right text-md-right col-md-3 col-12">
      <div class="d-flex justify-content-end">
        <button type="button" class="btn btn-primary btn-icon mar" v-if="add" @click="openModal">
          <i class="feather icon-plus"></i>
        </button>
        <button type="button" class="btn btn-primary btn-icon mar" v-if="filter" @click="openModalFilter">
          <i class="feather icon-filter"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['openModal', 'open-filter']);  // Emitting openModal to notify parent

defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  add: {
    type: Boolean,
    default: false,
  },
  filter: {
    type: Boolean,
    default: false,
  }
});

// Emitting the event to open the modal
const openModal = () => {
  emit('openModal', true);
};
const openModalFilter = () => {
  console.log('openModalFilter');
  
  emit('open-filter', true);
};
</script>

<style scoped>
.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 1rem;
}
.mar {
  margin-right: 5px;
}
</style>
