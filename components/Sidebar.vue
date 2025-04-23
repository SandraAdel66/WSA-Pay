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
            <h2 class="brand-text mb-0">WSAPAY</h2>
          </a>
        </li>
        <li class="nav-item nav-toggle">
          <a class="nav-link modern-nav-toggle pr-0" @click="toggleSidebar">
            <!-- Mobile Toggle -->
            <i class="feather icon-x d-block d-xl-none font-medium-4 primary toggle-icon"></i>
            <!-- Desktop Toggle -->
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
      <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
        <li class="navigation-header"><span>Analytics</span></li>

        <!-- Dashboard -->
        <li class="nav-item" :class="{ active: route.path === '/dashboard' }">
          <NuxtLink to="/dashboard">
            <i class="feather icon-home"></i>
            <span class="menu-item">Dashboard</span>
          </NuxtLink>
        </li>

        <!-- Members -->
        <li class="nav-item" :class="{ open: openMenu === 'members' }">
          <a href="javascript:void(0)" @click="toggleMenu('members')">
            <i class="feather icon-users"></i>
            <span class="menu-title">Members</span>
            <i
              class="feather float-right mr-0"
              :class="{
                'icon-chevron-down': openMenu === 'members',
                'icon-chevron-right': openMenu !== 'members'
              }"
            ></i>
          </a>
          <ul class="menu-content">
            <li
              :class="{
                active:
                  route.path === '/dashboard/members' ||
                  route.path == `/dashboard/members/${route.params.id}` ||
                  route.path == `/dashboard/members/transactions/${route.params.id}`
              }"
            >
              <NuxtLink to="/dashboard/members">
                <i class="feather icon-circle"></i>
                <span class="menu-item">List</span>
              </NuxtLink>
            </li>
            <li :class="{ active: route.path.startsWith('/dashboard/members/pending') }">
              <NuxtLink to="/dashboard/members/pending">
                <i class="feather icon-circle"></i>
                <span class="menu-item">Pending</span>
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- Reports -->
        <li class="nav-item" :class="{ open: openMenu === 'reports' }">
          <a href="javascript:void(0)" @click="toggleMenu('reports')">
            <i class="feather icon-file"></i>
            <span class="menu-title">Reports</span>
            <i
              class="feather float-right mr-0"
              :class="{
                'icon-chevron-down': openMenu === 'reports',
                'icon-chevron-right': openMenu !== 'reports'
              }"
            ></i>
          </a>
          <ul class="menu-content">
            <li :class="{ active: route.path === '/dashboard/transactions' }">
              <NuxtLink to="/dashboard/transactions">
                <i class="feather icon-circle"></i>
                <span class="menu-item">Transactions</span>
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- Settings -->
        <li class="nav-item" :class="{ open: openMenu === 'settings' }">
          <a href="javascript:void(0)" @click="toggleMenu('settings')">
            <i class="feather icon-settings"></i>
            <span class="menu-title">Settings</span>
            <i
              class="feather float-right mr-0"
              :class="{
                'icon-chevron-down': openMenu === 'settings',
                'icon-chevron-right': openMenu !== 'settings'
              }"
            ></i>
          </a>
          <ul class="menu-content">
            <li :class="{ active: route.path === '/dashboard/admins' }">
              <NuxtLink to="/dashboard/admins">
                <i class="feather icon-users"></i>
                <span class="menu-item">Admins</span>
              </NuxtLink>
            </li>
            <li :class="{ active: route.path === '/dashboard/roles' }">
              <NuxtLink to="/dashboard/roles">
                <i class="feather icon-lock"></i>
                <span class="menu-item">Roles</span>
              </NuxtLink>
            </li>
            <li :class="{ active: route.path === '/dashboard/countries' }">
              <NuxtLink to="/dashboard/countries">
                <i class="feather icon-globe"></i>
                <span class="menu-item">Countries</span>
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  <!-- END: Main Menu-->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuCollapsed = ref(false)
const openMenu = ref(null)

function toggleSidebar() {
  menuCollapsed.value = !menuCollapsed.value
  document.body.classList.toggle('menu-collapsed', menuCollapsed.value)
  document.body.classList.toggle('menu-expanded', !menuCollapsed.value)
}

function toggleMenu(menuName) {
  openMenu.value = openMenu.value === menuName ? null : menuName
}

onMounted(() => {
  document.body.classList.add('menu-expanded')
})
</script>

<style scoped>
/* You can add additional styles if needed */
</style>
