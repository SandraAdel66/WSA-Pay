<template>
  <section class="dashboard">
    <div class="row">
      <div class="col-lg-3 col-md-6 col-12">
        <Card
          count="1.2M"
          label="Pending"
          iconClass="feather icon-clock"
          colorMain="text-primary"
          bgClss="bg-rgba-primary"
        />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <Card
          count="1.2M"
          label="Approved"
          iconClass="feather icon-users"
          colorMain="text-success"
          bgClss="bg-rgba-success"
        />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <Card
          count="1.2M"
          label="Suspended"
          iconClass="feather icon-circle"
          colorMain="text-primary"
          bgClss="bg-rgba-primary"
        />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <Card
          count="1.2M"
          label="Deactivate"
          iconClass="feather icon-lock"
          colorMain="text-danger"
          bgClss="bg-rgba-danger"
        />
      </div>
    </div>

    <div class="row match-height">
      <div class="col-md-12">
        <div class="card p-2 h-full">
          <BarChart />
        </div>
      </div>
      <div class="col-md-12">
        <div class="card p-2 h-full">
          <LineChart />
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import Card from "@/components/theme/Card.vue";
import LineChart from "@/components/theme/LineChart.vue";
import BarChart from "@/components/theme/BarChart.vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "Analytics",
});
</script>
