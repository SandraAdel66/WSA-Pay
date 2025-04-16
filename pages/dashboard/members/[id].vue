<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
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
                    :src="
                      member.data?.logo ??
                      '/app-assets/images/portrait/small/avatar-s-12.jpg'
                    "
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
                      class="align-middle"
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
            <div class="bg-primary avatar m-0" @click="openAddModal">
              <div class="avatar-content">
                <i
                  class="feather icon-plus font-medium-3"
                  v-if="
                    !member.data?.balances || member.data?.balances.length === 0
                  "
                ></i>
                <i class="feather icon-repeat font-medium-3" v-else></i>
              </div>
            </div>
          </h5>

          <div v-if="member.data?.balances && member.data?.balances.length">
            <div class="card mb-0">
              <div
                class="card-header balance-header"
                v-for="item in member.data?.balances"
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
            <h5 class="card-title d-flex justify-content-between align-items-center">
              <div>
                <i class="feather icon-lock mr-50"></i>
              Latest Transactions
              </div>
              <div class="chip bg-chip cursor-pointer">
                <div class="chip-body">
                  <span class="chip-text">
                    <i class="feather icon-eye"></i>
                    view details</span
                  >
                </div>
              </div>
            </h5>
            <div
              v-if="
                member.data?.lastTransactions &&
                member.data?.lastTransactions.length
              "
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
                      :class="
                        sub.type === 'add' ? 'text-success' : 'text-danger'
                      "
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
    </section>
  </div>
</template>

<script setup >
const route = useRoute();
const memberId = route.params.id;
import { useNotify } from "~/composables/useNotify";
import Modal from "@/components/theme/Modal.vue";

const notify = useNotify();
const {
  data: member,
  pending,
  error,
} = useApiItem({
  api: "members",
  id: memberId,
});
// Refs & Reactive States
const showModal = ref(false);

const modalTitle = ref("");
const apiTitle = ref("add");
const formFields = ref([]);
const apINewOrOldBalance = ref("");
const currencies = [
  { label: "USD", value: "USD", name: "USD" },
  { label: "EUR", value: "EUR", name: "EUR" },
  { label: "AUD", value: "AUD", name: "AUD" },
];

const transactionTypes = [
  { label: "Withdraw", value: "withdraw" },
  { label: "Deposit", value: "add" },
];

// Modal Form Fields Config
const baseFormFields = [
  {
    name: "currency",
    label: "Currency",
    type: "select",
    placeholder: "Choose Currency",
    required: true,
    class: "form-control",
    options: currencies,
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
const openAddModal = () => {
  modalTitle.value = "Manage Balance";
  apiTitle.value = "add";

  const hasBalances = member?.value?.data?.balances?.length > 0;

  // Set the appropriate API endpoint
  apINewOrOldBalance.value = hasBalances
    ? `members/${memberId}/wallet/transaction`
    : `members/${memberId}/wallet`;

  // Prepare form fields
  formFields.value = [
    ...baseFormFields,
    ...(hasBalances ? extendedFormFields : []),
  ].map((f) => ({ ...f, value: "" }));

  showModal.value = true;
};

// ===================================

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
</script>
