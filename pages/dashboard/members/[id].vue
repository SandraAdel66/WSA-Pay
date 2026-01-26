<template>
  <!-- Add refresh controls row -->
  <div class="row mb-3">
    <div class="col-md-10">
      <ThemeBreadcrumb
        title="Member"
        :items="[{ label: 'member details', to: '/countries' }]"
        :add="false"
        :filters="false"
        :exportBtn="false"
      />
    </div>
    <div class="col-md-2 d-flex align-items-center justify-content-end gap-2">
      <!-- Status filter -->
      <select
        v-model="status"
        @change="onStatusChange($event.target.value)"
        class="bg-select"
      >
        <option
          v-for="option in statusOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
  <div v-if="member === null" class="bg-white">
    <ThemeSkelton/>
  </div>
  <div v-if="member && member.data">
    <Modal
      :showModal="showModal"
      @update:showModal="showModal = $event"
      :formFields="formFields"
      :title="modalTitle"
      :apiTitle="apiTitle"
      :apiName="apINewOrOldBalance"
    />
    <section class="user-details">
      <div class="row">
        <!-- Account Info -->
        <div class="col-md-6">
          <h5 class="card-title">
            <i class="feather icon-user mr-50"></i>
            Account Info
          </h5>
          <div class="card shadow-sm mb-0">
            <div class="card-body card-padding">
              <div class="media">
                <a href="javascript: void(0);">
                  <img
                    :src="member.data?.logo ?? '/app-assets/images/logo/no-image-icon.png'"
                    class="rounded mr-75"
                    alt="profile image"
                    height="64"
                    width="64"
                  />
                </a>
                <div class="media-body d-grid">
                  <label
                    class="ml-50 mb-sm-0 cursor-pointer text-bold-600 waves-effect waves-light"
                    for="account-upload"
                    >{{ member.data?.name }}</label
                  >
                  <label
                    class="ml-50 mb-sm-0 cursor-pointer text-bold-600 waves-effect waves-light"
                    for="account-upload"
                  >
                    <img
                      :src="member.data?.country?.flag ?? ''"
                      width="20"
                      class="align-middle radius-2"
                    />
                    {{ member.data?.country?.name ?? "no data" }}
                  </label>
                  <label
                    class="table-text ml-50 text-bold-600 cursor-pointer email"
                    @click="copyToClipboard(member.data?.email)"
                  >
                    <small>
                      <i class="feather icon-mail"></i>
                      {{ member.data?.email }}</small
                    >
                  </label>
                </div>
              </div>

              <table class="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <th class="text-muted">Display Name</th>
                    <td class="table-text">
                      {{ member.data?.displayName ?? "--" }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">Phone</th>
                    <td class="table-text">{{ member.data?.phone ?? "--" }}</td>
                  </tr>
                  <tr>
                    <th class="text-muted">Address</th>
                    <td class="table-text">
                      {{ member.data?.address ?? "--" }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">State</th>
                    <td class="table-text">{{ member.data?.state ?? "--" }}</td>
                  </tr>
                  <tr>
                    <th class="text-muted">Postal Code</th>
                    <td class="table-text">
                      {{ member.data?.postalCode ?? "--" }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">Created At</th>
                    <td class="table-text">
                      {{ member.data?.createdAt ?? "--" }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">Status</th>
                    <td>
                      <div
                        :class="[
                          'text-bold-600',
                          'chip',
                          {
                            'chip-semi-dark': member.data?.status === 'pending',
                            'chip-success': member.data?.status === 'approved',
                            'chip-warning': member.data?.status === 'suspended',
                            'chip-danger': member.data?.status === 'deactivate',
                          },
                        ]"
                      >
                        <div class="chip-body">
                          <div class="chip-text capitalize">
                            {{ member.data?.status }}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Balances -->
        <div class="col-md-6 col-12">
          <h5
            class="card-title d-flex align-items-center justify-content-between"
          >
            <div>
              <i class="feather icon-save mr-50"></i>
              Balances
            </div>
            <div>
              <!-- Manage button: Show only when at least 1 balance exists -->
              <div
                class="btn btn-primary avatar m-0 btn-icon p-0 justify-start"
                @click="openAddModal('manage')"
                v-if="hasBalancesToManage"
              >
                <div class="avatar-content">
                  <i class="feather icon-repeat font-medium-3"></i>
                </div>
              </div>
              <!-- Add button: Show when no balances OR less than 3 balances -->
              <div
                class="btn btn-primary avatar ml-2 btn-icon p-0 justify-end"
                @click="openAddModal('add')"
                v-if="canAddMoreBalances"
              >
                <div class="avatar-content">
                  <i class="feather icon-plus font-medium-3"></i>
                </div>
              </div>
            </div>
          </h5>

          <!-- Display only balances with balance > 0 -->
          <div v-if="activeBalances && activeBalances.length">
            <div class="card mb-0">
              <div
                class="card-header balance-header"
                v-for="item in activeBalances"
                :key="item.currency"
              >
                <h4>{{ item.balance }} {{ item.currency }}</h4>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="card mb-0">
              <div
                class="card-header balance-header"
                v-for="item in currencies"
                :key="item.value"
              >
                <h4>0 {{ item.label }}</h4>
              </div>
            </div>
          </div>
          <div class="">
            <h5
              class="card-title d-flex justify-content-between align-items-center"
            >
              <div>
                <i class="feather icon-lock mr-50"></i>
                Latest Transactions
              </div>
              <div class="chip bg-chip cursor-pointer" @click="allTransactions">
                <div class="chip-body">
                  <span class="chip-text">
                    <i class="feather icon-eye"></i>
                    view details</span
                  >
                </div>
              </div>
            </h5>
            <div
              v-if="member.data?.lastTransactions && member.data?.lastTransactions.length"
            >
              <div
                v-for="sub in member.data?.lastTransactions"
                :key="sub.id"
                class="card shadow-sm border card-balance"
              >
                <div class="card-body card-padding">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <strong class="text-capitalize text-dark">
                      {{ sub.type === "add" ? "Deposit" : "Withdrawal" }}
                    </strong>
                    <span
                      :class="sub.type === 'add' ? 'text-success' : 'text-danger'"
                      class="fw-bold"
                    >
                      {{ sub.type === "add" ? "+" : "-" }}{{ sub.amount }}
                      {{ sub.currency }}
                    </span>
                  </div>
                  <p class="text-muted fst-italic mb-0">
                    {{ sub.description }}
                  </p>
                  <div class="text-end text-secondary">
                    {{ sub.createdAt }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="card shadow-sm mb-0 border card-balance">
                <div class="card-body card-padding">
                  <div
                    class="d-flex justify-content-center p-2 align-items-center"
                  >
                    <strong class="text-capitalize text-muted text-center">
                      There are no transactions to display at the moment.
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sub Accounts -->
        <div class="col-12">
          <h5 class="card-title">
            <i class="feather icon-lock mr-50"></i>
            Sub Accounts
          </h5>

          <div class="card">
            <div class="card-body card-padding">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Display Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="sub in member.data?.subAccounts" :key="sub.id">
                      <td>{{ sub.name }}</td>
                      <td>{{ sub.displayName }}</td>
                      <td>{{ sub.email }}</td>
                      <td>{{ sub.phone }}</td>
                      <td>{{ sub.createdAt }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
const route = useRoute();
const memberId = route.params.id;

import { useRouter } from "vue-router";
const router = useRouter();
const { updateStatus } = useApiStatusUpdate();
import Modal from "@/components/theme/Modal.vue";
const status = ref(null);
const notify = useNotify();

// ========== AUTO-REFRESH SETUP ==========
const autoRefreshEnabled = ref(true);
const refreshInterval = ref(null);
const lastRefreshTime = ref(null);
const isRefreshing = ref(false);

// Auto-refresh every 15 seconds (15000ms)
const AUTO_REFRESH_INTERVAL = 15000;

// Keep your original useApiItem hook
const {
  data: member,
  pending,
  error,
  refresh: refreshMemberData,
} = useApiItem({
  api: "members",
  id: memberId,
});

// ========== AUTO-REFRESH FUNCTIONS ==========
const startAutoRefresh = () => {
  stopAutoRefresh();
  
  refreshInterval.value = setInterval(async () => {
    if (autoRefreshEnabled.value && document.visibilityState === 'visible') {
      await refreshAllData();
    }
  }, AUTO_REFRESH_INTERVAL);
};

const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
    refreshInterval.value = null;
  }
};

const toggleAutoRefresh = () => {
  autoRefreshEnabled.value = !autoRefreshEnabled.value;
  if (autoRefreshEnabled.value) {
    startAutoRefresh();
    notify.success('Auto-refresh enabled');
  } else {
    stopAutoRefresh();
    notify.info('Auto-refresh disabled');
  }
};

const refreshAllData = async () => {
  if (isRefreshing.value) return;
  
  isRefreshing.value = true;
  lastRefreshTime.value = new Date();
  
  try {
    if (refreshMemberData) {
      await refreshMemberData();
    }
  } catch (error) {
    console.error('Auto-refresh failed:', error);
  } finally {
    isRefreshing.value = false;
  }
};

const manualRefresh = async () => {
  await refreshAllData();
  notify.success('Data refreshed!');
};

// ========== LIFE CYCLE HOOKS ==========
onMounted(() => {
  if (autoRefreshEnabled.value) {
    startAutoRefresh();
  }
  
  if (process.client) {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
});

onBeforeUnmount(() => {
  stopAutoRefresh();
  if (process.client) {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  }
});

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && autoRefreshEnabled.value) {
    refreshAllData();
    startAutoRefresh();
  } else if (document.visibilityState === 'hidden') {
    stopAutoRefresh();
  }
};
// ===========================================

// Refs & Reactive States
const showModal = ref(false);

// Initialize status after member data loads
watch(member, (newMember) => {
  if (newMember?.data) {
    status.value = newMember.data.status ?? "pending";
  }
}, { immediate: true });

const modalTitle = ref("");
const apiTitle = ref("add");
const formFields = ref([]);
const apINewOrOldBalance = ref("");
const currencies = [
  { label: "USD", value: "USD", name: "USD" },
  { label: "EUR", value: "EUR", name: "EUR" },
  { label: "GBP", value: "GBP", name: "GBP" },
];

const transactionTypes = [
  { label: "Withdraw", value: "withdraw" },
  { label: "Deposit", value: "add" },
];

// Function to remove zero balances from the member data array
const cleanZeroBalances = () => {
  if (member.value?.data?.balances) {
    // Filter out balances that are 0 or less
    const nonZeroBalances = member.value.data.balances.filter(balance => 
      parseFloat(balance.balance) > 0
    );
    
    // Update the member data with filtered balances
    member.value.data.balances = nonZeroBalances;
  }
};

// Watch for member data changes and clean zero balances
watch(() => member.value?.data?.balances, (newBalances) => {
  if (newBalances) {
    // Check if any balance is 0 and clean immediately
    const hasZeroBalance = newBalances.some(balance => parseFloat(balance.balance) <= 0);
    if (hasZeroBalance) {
      cleanZeroBalances();
    }
  }
}, { deep: true, immediate: true });

// Computed property to get active balances (should only contain balances > 0 after cleaning)
const activeBalances = computed(() => {
  if (!member.value?.data?.balances) return [];
  return member.value.data.balances;
});

// Computed properties for button visibility
const hasBalancesToManage = computed(() => {
  return activeBalances.value.length > 0;
});

const canAddMoreBalances = computed(() => {
  return !member.value?.data?.balances || 
         member.value.data.balances.length < 3;
});

// Modal Form Fields Config
const baseFormFields = [
  {
    name: "currency",
    label: "Currency",
    type: "select",
    placeholder: "Choose Currency",
    required: true,
    class: "form-control",
  },
  {
    name: "balance",
    label: "Balance",
    type: "number",
    placeholder: "Enter Balance",
    required: true,
    class: "form-control",
  },
];

const extendedFormFields = [
  {
    name: "type",
    label: "Transaction Type",
    type: "select",
    placeholder: "Choose Type",
    required: true,
    class: "form-control",
    options: transactionTypes,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter Description",
    required: false,
    class: "form-control",
  },
];

// ========== Modal Functions ==========
const openAddModal = (actionType = 'add') => {
  if (actionType === 'manage') {
    modalTitle.value = "Manage Balance";
    apiTitle.value = "manage";
  } else {
    modalTitle.value = "Add Balance";
    apiTitle.value = "add";
  }

  if (actionType === 'manage') {
    apINewOrOldBalance.value = `members/${memberId}/wallet/transaction`;
  } else {
    apINewOrOldBalance.value = `members/${memberId}/wallet`;
  }

  if (actionType === 'add') {
    // For add modal - show currencies that don't already exist in balances
    // Since zero balances are removed, this will include currencies that were removed
    const existingCurrencies = member.value?.data?.balances?.map(b => b.currency) || [];
    const availableCurrencies = currencies.filter(currency => 
      !existingCurrencies.includes(currency.value)
    );
    
    formFields.value = [
      {
        name: "currency",
        label: "Currency",
        type: "select",
        placeholder: "Choose Currency",
        required: true,
        class: "form-control",
        options: availableCurrencies,
        value: availableCurrencies.length === 1 ? availableCurrencies[0].value : ""
      },
      {
        name: "balance",
        label: "Initial Balance",
        type: "number",
        placeholder: "Enter Balance",
        required: true,
        class: "form-control",
        min: 0.01, // Prevent adding 0 balance
        step: "0.01",
        value: ""
      }
    ];
  } else {
    // For manage modal - show only currencies that exist (all should have balance > 0)
    const manageCurrencyOptions = activeBalances.value.map(balance => ({
      label: balance.currency,
      value: balance.currency,
      name: balance.currency
    }));
    
    formFields.value = [
      {
        name: "currency",
        label: "Currency",
        type: "select",
        placeholder: "Choose Currency",
        required: true,
        class: "form-control",
        options: manageCurrencyOptions,
        value: manageCurrencyOptions.length === 1 ? manageCurrencyOptions[0].value : ""
      },
      {
        name: "balance",
        label: "Balance",
        type: "number",
        placeholder: "Enter Balance",
        required: true,
        class: "form-control",
        value: ""
      },
      {
        name: "type",
        label: "Transaction Type",
        type: "select",
        placeholder: "Choose Type",
        required: true,
        class: "form-control",
        options: transactionTypes,
        value: ""
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter Description",
        required: false,
        class: "form-control",
        value: ""
      }
    ];
  }

  showModal.value = true;
};

// Handle modal form submission
const handleModalSubmit = async (formData) => {
  try {
    const response = await $fetch(`/api/${apINewOrOldBalance.value}`, {
      method: 'POST',
      body: formData
    });
    
    setTimeout(() => {
      refreshAllData();
    }, 1000);
    
    notify.success('Transaction completed successfully!');
  } catch (error) {
    notify.error('Transaction failed: ' + (error.message || 'Unknown error'));
  }
};

watch(showModal, (newVal) => {
  if (!newVal) {
    setTimeout(() => refreshAllData(), 500);
  }
});

const copyToClipboard = (email) => {
  navigator.clipboard
    .writeText(email)
    .then(() => {
      notify.success("Copied to clipboard!");
    })
    .catch(() => {
      notify.error("Failed to copy");
    });
};

const allTransactions = () => {
  router.push(`transactions/${memberId}`);
};

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Suspended", value: "suspended" },
  { label: "Deactivate", value: "deactivate" },
];

// Change handler (with API call)
const onStatusChange = async (newStatus) => {
  try {
    await updateStatus({
      api: "members",
      type: "status",
      id: memberId,
      method: "POST",
      status: newStatus,
    });

    notify.success("Status Changed Successfully");
    
    if (member.value?.data) {
      member.value.data.status = newStatus;
    }
    
    setTimeout(() => refreshAllData(), 1000);
  } catch (error) {
    notify.error("Failed to change status");
    status.value = member.value?.data?.status;
  }
};
</script>

<style>
.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bg-select {
  background-color: #e6e6e6;
  transition: 0.3s ease-in-out;
  font-weight: 500;
  box-shadow: 1px 1px 2px 1px #cacaca;
  display: inline-flex;
  margin-bottom: 5px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  vertical-align: middle;
  -webkit-align-self: center;
  -ms-flex-item-align: center;
  align-self: center;
  border: none;
  border-radius: 15px;
  font-size: 13px;
  padding: 5px 10px;
  cursor: pointer;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
}

.balance-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.balance-header:last-child {
  border-bottom: none;
}
</style>