<template>
  <!-- BEGIN: Main Menu-->
  <div
    class="main-menu menu-fixed menu-light menu-accordion menu-shadow"
    data-scroll-to-active="true"
  >
    <div class="navbar-header">
      <ul class="nav navbar-nav flex-row">
        <li class="nav-item mr-auto">
          <a class="navbar-brand" href="#">
            <div class="brand-logo"></div>
            <h2 class="brand-text mb-0">Vuexy</h2>
          </a>
        </li>
        <li class="nav-item nav-toggle">
          <a class="nav-link modern-nav-toggle pr-0" @click="toggleSidebar">
            <!-- Mobile Toggle -->
            <i
              class="feather icon-x d-block d-xl-none font-medium-4 primary toggle-icon"
            ></i>
            <!-- Desktop Toggle Icon -->
            <i
              class="toggle-icon feather font-medium-4 d-none d-xl-block collapse-toggle-icon primary"
              :class="menuCollapsed ? 'icon-circle' : 'icon-disc'"
            ></i>
          </a>
        </li>
      </ul>
    </div>

    <div class="shadow-bottom"></div>

    <div class="main-menu-content">
      <ul
        class="navigation navigation-main"
        id="main-menu-navigation"
        data-menu="menu-navigation"
      >
        <li class="navigation-header"><span>Analytics</span></li>

        <!-- Dashboard -->
        <li class="nav-item" :class="{ active: route.path === '/dashboard' }">
          <NuxtLink to="/dashboard">
            <i class="feather icon-home"></i>
            <span class="menu-item">Dashboard</span>
          </NuxtLink>
        </li>

        <!-- Members Dropdown -->
        <li class="nav-item" :class="{ open: isOpen }">
          <a href="javascript:void(0)" @click="toggleMenu">
            <i class="feather icon-users"></i>
            <span class="menu-title">Members</span>
            <i
              class="feather float-right mr-0"
              :class="{
                'icon-chevron-right': isOpen,
                'icon-chevron-down': !isOpen,
              }"
            ></i>
          </a>
          <ul class="menu-content">
            <li
              :class="{
                active:
                  route.path === '/dashboard/members' ||
                  route.path == `/dashboard/members/${route.params.id}` ||
                  route.path ==
                    `/dashboard/members/transactions/${route.params.id}`,
              }"
            >
              <NuxtLink to="/dashboard/members">
                <i class="feather icon-circle"></i>
                <span class="menu-item">List</span>
              </NuxtLink>
            </li>
            <li
              :class="{
                active: route.path.startsWith('/dashboard/members/pending'),
              }"
            >
              <NuxtLink to="/dashboard/members/pending">
                <i class="feather icon-circle"></i>
                <span class="menu-item">Pending</span>
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- transactions -->
        <li
          class="nav-item"
          :class="{ active: route.path === '/dashboard/transactions' }"
        >
          <NuxtLink to="/dashboard/transactions">
            <i class="feather icon-server"></i>
            <span class="menu-item">Transactions</span>
          </NuxtLink>
        </li>
        <!-- Admins -->
        <li
          class="nav-item"
          :class="{ active: route.path === '/dashboard/admins' }"
        >
          <NuxtLink to="/dashboard/admins">
            <i class="feather icon-users"></i>
            <span class="menu-item">Admins</span>
          </NuxtLink>
        </li>
        <!-- countries -->

        <li
          class="nav-item"
          :class="{ active: route.path === '/dashboard/countries' }"
        >
          <NuxtLink to="/dashboard/countries">
            <i class="feather icon-globe"></i>
            <span class="menu-item">Countries</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
  <!-- END: Main Menu-->
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

const route = useRoute();

const isOpen = ref(false);
const menuCollapsed = ref(false);

// Toggle Members dropdown
function toggleMenu() {
  isOpen.value = !isOpen.value;
}

// Toggle Sidebar Collapse/Expand
function toggleSidebar() {
  menuCollapsed.value = !menuCollapsed.value;
  document.body.classList.toggle("menu-collapsed", menuCollapsed.value);
  document.body.classList.toggle("menu-expanded", !menuCollapsed.value);
}

// Optional: on load, ensure one class is set
onMounted(() => {
  document.body.classList.add("menu-expanded");
});
</script>

<style scoped>
/* Optional styling if needed */
</style>
