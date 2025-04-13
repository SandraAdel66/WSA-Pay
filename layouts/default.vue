<template>
  <div id="app" class="">
    <Sidebar />
    <Navbar />
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-header row"></div>
        <!-- Replace <router-view /> with <NuxtPage /> -->
        <NuxtPage />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
components: {
  Sidebar,
  Navbar,
  Footer,
},
mounted() {
  document.body.classList.add(
    "vertical-layout",
    "vertical-menu-modern",
    "2-columns",
    "navbar-floating",
    "footer-static",
    // "dark-layout",
  );
  document.body.setAttribute("data-open", "click");
  document.body.setAttribute("data-menu", "vertical-menu-modern");
  document.body.setAttribute("data-col", "2-columns");
},
};
</script>
