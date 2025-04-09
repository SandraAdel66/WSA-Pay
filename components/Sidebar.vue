<template>
  <!-- BEGIN: Main Menu-->
  <div
    class="main-menu menu-fixed menu-light menu-accordion menu-shadow"
    data-scroll-to-active="true"
  >
    <div class="navbar-header">
      <ul class="nav navbar-nav flex-row">
        <li class="nav-item mr-auto">
          <a class="navbar-brand" href="index-2.html">
            <div class="brand-logo"></div>
            <h2 class="brand-text mb-0">Vuexy</h2></a
          >
        </li>
        <li class="nav-item nav-toggle">
          <a class="nav-link modern-nav-toggle pr-0" data-toggle="collapse"
            ><i
              class="feather icon-x d-block d-xl-none font-medium-4 primary toggle-icon"
            ></i
            ><i
              class="toggle-icon feather icon-disc font-medium-4 d-none d-xl-block collapse-toggle-icon primary"
              data-ticon="icon-disc"
            ></i
          ></a>
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
        <li class="nav-item" :class="{ active: route.path === '/dashboard' }">
          <NuxtLink to="/dashboard">
            <i class="feather icon-home"></i>
            <span class="menu-item">Dashboard</span>
          </NuxtLink>
        </li>

        <!-- Members Dropdown -->
        <li
          class="nav-item"
          :class="{ open: route.path.startsWith('/dashboard/members') }"
        >
          <a href="javascript:void(0)">
            <i class="feather icon-users"></i>
            <span class="menu-title">Members</span>
            <span class="badge badge badge-warning badge-pill float-right mr-2"
              >2</span
            >
          </a>
          <ul class="menu-content">
            <li :class="{ active: route.path === '/dashboard/members' }">
              <NuxtLink to="/dashboard/members">
                <i class="feather icon-circle"></i>
                <span class="menu-item">List</span>
              </NuxtLink>
            </li>
            <li
              :class="{ active: route.path === '/dashboard/members/pending' }"
            >
              <NuxtLink to="/dashboard/members/pending">
                <i class="feather icon-circle"></i>
                <span class="menu-item">Pending</span>
              </NuxtLink>
            </li>
          </ul>
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
      </ul>
    </div>
  </div>
  <!-- END: Main Menu-->
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>
