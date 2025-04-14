<template>
  <section>
    <div class="row">
      <Card count="1.2M" label="Pending" 
        iconClass="feather icon-clock"
        colorMain="text-primary"
        bgClss="bg-rgba-primary"
      />
      <Card count="1.2M" label="Approved" 
        iconClass="feather icon-users"
        colorMain="text-success"
        bgClss="bg-rgba-success"
      />
      <Card count="1.2M" label="Suspended" 
        iconClass="feather icon-circle"
        colorMain="text-primary"
        bgClss="bg-rgba-primary"
      />
      <Card count="1.2M" label="Deactivate" 
        iconClass="feather icon-lock"
        colorMain="text-danger"
        bgClss="bg-rgba-danger"
      />
      
    </div>

    <div class="row match-height">
      <div class="col-lg-6 col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Activity Timeline</h4>
          </div>
          <div class="card-content">
            <div class="card-body">
              <ul class="activity-timeline timeline-left list-unstyled">
                <li>
                  <div class="timeline-icon bg-primary">
                    <i class="feather icon-plus font-medium-2 align-middle"></i>
                  </div>
                  <div class="timeline-info">
                    <p class="font-weight-bold mb-0">Client Meeting</p>
                    <span class="font-small-3"
                      >Bonbon macaroon jelly beans gummi bears jelly lollipop
                      apple</span
                    >
                  </div>
                  <small class="text-muted">25 mins ago</small>
                </li>
                <li>
                  <div class="timeline-icon bg-warning">
                    <i
                      class="feather icon-alert-circle font-medium-2 align-middle"
                    ></i>
                  </div>
                  <div class="timeline-info">
                    <p class="font-weight-bold mb-0">Email Newsletter</p>
                    <span class="font-small-3"
                      >Cupcake gummi bears soufflé caramels candy</span
                    >
                  </div>
                  <small class="text-muted">15 days ago</small>
                </li>
                <li>
                  <div class="timeline-icon bg-danger">
                    <i
                      class="feather icon-check font-medium-2 align-middle"
                    ></i>
                  </div>
                  <div class="timeline-info">
                    <p class="font-weight-bold mb-0">Plan Webinar</p>
                    <span class="font-small-3"
                      >Candy ice cream cake. Halvah gummi bears</span
                    >
                  </div>
                  <small class="text-muted">20 days ago</small>
                </li>
                <li>
                  <div class="timeline-icon bg-success">
                    <i
                      class="feather icon-check font-medium-2 align-middle"
                    ></i>
                  </div>
                  <div class="timeline-info">
                    <p class="font-weight-bold mb-0">Launch Website</p>
                    <span class="font-small-3">Candy ice cream cake. </span>
                  </div>
                  <small class="text-muted">25 days ago</small>
                </li>
                <li>
                  <div class="timeline-icon bg-primary">
                    <i
                      class="feather icon-check font-medium-2 align-middle"
                    ></i>
                  </div>
                  <div class="timeline-info">
                    <p class="font-weight-bold mb-0">Marketing</p>
                    <span class="font-small-3"
                      >Candy ice cream. Halvah bears Cupcake gummi bears.</span
                    >
                  </div>
                  <small class="text-muted">28 days ago</small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import Card from "@/components/theme/Card.vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "Analytics",
});
</script>
