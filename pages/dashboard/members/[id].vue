<script setup >
const route = useRoute();
const memberId = route.params.id;
import Card from "@/components/theme/Card.vue";
const {
  data: member,
  pending,
  error,
} = useApiItem({
  api: "members",
  id: memberId,
});
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <section class="page-users-view">
      <div class="row">
        <!-- Account Info -->
        <div class="col-md-6">
          <h5 class="card-title ">
            <i class="feather icon-user mr-50"></i>
            Account Info
          </h5>
          <div class="card shadow-sm">
            <div class="card-body card-padding">
              <div class="media">
                <a href="javascript: void(0);">
                  <img
                    :src="
                      member.data.logo ??
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
                    >{{ member.data.name }}</label
                  >
                  <label
                    class="ml-50 mb-sm-0 cursor-pointer text-bold-600 waves-effect waves-light"
                    for="account-upload"
                  >
                    <img
                      :src="member.data.country.flag ?? ''"
                      width="20"
                      class="align-middle"
                    />
                    {{ member.data.country.name }}
                  </label>
                  <label class="table-text ml-50 text-bold-600">
                    <small>{{ member.data.email }}</small>
                  </label>
                </div>
              </div>

              <table class="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <th class="text-muted">Display Name</th>
                    <td class="table-text">{{ member.data.displayName }}</td>
                  </tr>
                  <tr>
                    <th class="text-muted">Phone</th>
                    <td class="table-text">{{ member.data.phone }}</td>
                  </tr>
                  <tr>
                    <th class="text-muted">Address</th>
                    <td class="table-text">{{ member.data.address }}</td>
                  </tr>
                  <tr>
                    <th class="text-muted">State</th>
                    <td class="table-text">{{ member.data.state }}</td>
                  </tr>
                  <tr>
                    <th class="text-muted">Postal Code</th>
                    <td class="table-text">{{ member.data.postalCode }}</td>
                  </tr>
                  <tr>
                    <th class="text-muted">Created At</th>
                    <td class="table-text">{{ member.data.createdAt }}</td>
                  </tr>
                  <tr>
                    <th class="text-muted">Status</th>
                    <td>
                      <div
                        :class="[
                          'text-bold-600',
                          'chip',
                          {
                            'chip-semi-dark': member.data.status === 'pending',
                            'chip-success': member.data.status === 'approved',
                            'chip-warning': member.data.status === 'suspended',
                            'chip-danger': member.data.status === 'deactivate',
                          },
                        ]"
                      >
                        <div class="chip-body">
                          <div class="chip-text capitalize">
                            {{ member.data.status }}
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
          <h5 class="card-title ">
            <i class="feather icon-save mr-50"></i>
            Balances
          </h5>
          <div v-for="balance in member.data.balances" :key="balance.currency">
            <Card
              :count="balance.balance"
              :label="`${balance.currency} Balance`"
              iconClass="feather icon-cast"
              colorMain="text-primary"
              bgClss="bg-rgba-primary"
            />
          </div>

          <div class="">
            <h5 class="card-title ">
              <i class="feather icon-lock mr-50"></i>
              Latest Transactions
            </h5>

            <div
              v-for="sub in member.data.lastTransactions"
              :key="sub.id"
              class="card shadow-sm border card-balance"
            >
              <div class="card-body card-padding">
                <div class="d-flex justify-content-between align-items-center">
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
                <p class="text-muted fst-italic mb-0">{{ sub.description }}</p>
                <div class="text-end text-secondary">
                  {{ sub.createdAt }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sub Accounts -->

        <!-- Sub Accounts -->
        <div class="col-12">
          <h5 class="card-title ">
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
                  <tr v-for="sub in member.data.subAccounts" :key="sub.id">
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


<style scoped>
.text-muted {
  color: #292929 !important;
  font-size: 13px;
}

table tr {
  border-top: 1px dashed #eee;
}
.media {
  border-bottom: 1px dashed #eee;
  padding-bottom: 10px;
}
.media-body label {
  font-size: 13px;
}
table tr:first-child {
  border-top: none;
}
table tr:last-child {
  border-bottom: none;
}
.d-grid {
  display: grid;
}

.table-text {
  font-size: 13px;
}

.text-secondary{
  color: #494949 !important;
  font-weight: 500;
  font-size: 12px !important;

}
.card-padding {
  padding: 15px;
}
.card-balance {
  margin-bottom: 5px;
  font-size: 12px
}
.card-title {
  margin-bottom: 10px;
  margin-top: 10px;

}
</style>