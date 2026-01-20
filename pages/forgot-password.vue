<script setup lang="ts">
import { email, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { ref, computed } from "vue";

definePageMeta({
  layout: "auth",
  title: "Forgot Password",
  middleware: "guest",
});

interface ResetRequest {
  email: string;
}

const resetData = ref<ResetRequest>({ email: "" });
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Validation Rules
const rules = computed(() => ({
  email: { required, email },
}));
const v$ = useVuelidate(rules, resetData);

// Handle reset request
async function requestReset() {
  const result = await v$.value.$validate();
  if (!result) return;

  isLoading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    // Use the same store as your login page
    const userStore = useUserStore();
    
    // If your user store has forgotPassword method, use it
    // Otherwise use direct fetch
    const response = await $fetch("/api/auth/forgot-password", {
      method: "POST",
      body: { email: resetData.value.email },
    });

    // Show success message
    successMessage.value = 
      "Password reset instructions have been sent to your email. " +
      "Please check your inbox and follow the link to reset your password.";
    
    // Clear form data
    resetData.value.email = "";
    v$.value.$reset();
    
  } catch (error: any) {
    console.error("Reset request failed:", error);
    
    // Handle different error types
    if (error.statusCode === 404 || error.message?.includes("not found")) {
      errorMessage.value = "No account found with this email address.";
    } else if (error.statusCode === 429 || error.message?.includes("too many")) {
      errorMessage.value = "Too many reset attempts. Please try again later.";
    } else if (error.message?.includes("Network") || error.message?.includes("fetch")) {
      errorMessage.value = "Network error. Please check your connection.";
    } else {
      errorMessage.value = error.message || "Failed to send reset link. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
}

// Navigate back to login
function goToLogin() {
  navigateTo("/login");
}
</script>


<template>
  <section class="d-flex justify-content-center align-items-center min-vh-100 main-login">
    <div class="d-flex justify-content-center">
      <div class="card bg-authentication">
        <div class="row m-0">
          <!-- Left Image Section -->
          <div class="col-lg-6 d-lg-block d-none text-center align-self-center px-1 py-0">
            <img src="/app-assets/images/pages/forgot-password.png" alt="forgot password" />
          </div>
          
          <!-- Right Form Section -->
          <div class="col-lg-6 col-12 p-0">
            <div class="card h-100">
              <div class="card-header pb-1">
                <div class="card-title">
                  <h4 class="mb-0">Forgot Password</h4>
                </div>
              </div>
              
              <p class="px-2">Enter your email address and we'll send you instructions to reset your password.</p>
              
              <div class="card-content">
                <div class="card-body pt-1">
                  <!-- Success Message -->
                  <div v-if="successMessage" class="alert alert-success" role="alert">
                    <div class="alert-body">
                      <i class="feather icon-check-circle mr-1"></i>
                      {{ successMessage }}
                    </div>
                    <div class="mt-2">
                      <button @click="goToLogin" class="btn btn-primary btn-sm">
                        Back to Login
                      </button>
                    </div>
                  </div>
                  
                  <!-- Reset Form -->
                  <form v-else @submit.prevent="requestReset" class="forgot-password-form">
                    <!-- Email Field -->
                    <fieldset class="form-label-group form-group position-relative has-icon-left">
                      <input
                        v-model="resetData.email"
                        type="email"
                        class="form-control"
                        id="reset-email"
                        placeholder="Email"
                        :class="{
                          'border border-danger': !v$.email.$pending && v$.email.$error,
                        }"
                        :disabled="isLoading"
                      />
                      <div class="form-control-position">
                        <i class="feather icon-mail"></i>
                      </div>
                      <label for="reset-email">Email Address</label>

                      <!-- Email Error Message -->
                      <div v-if="!v$.email.$pending && v$.email.$error" class="text-danger">
                        <small v-if="v$.email.required.$invalid">Email is required.</small>
                        <small v-else-if="v$.email.email.$invalid">Please enter a valid email address.</small>
                      </div>
                    </fieldset>

                    <!-- Error Message -->
                    <div v-if="errorMessage" class="alert alert-danger" role="alert">
                      <div class="alert-body">
                        <i class="feather icon-alert-circle mr-1"></i>
                        {{ errorMessage }}
                      </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="form-group">
                      <button
                        type="submit"
                        :disabled="isLoading || v$.$invalid"
                        class="btn btn-primary btn-block btn-inline"
                      >
                        <template v-if="isLoading">
                          <span class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                          Sending...
                        </template>
                        <template v-else>
                          <i class="feather icon-send mr-1"></i>
                          Send Reset Link
                        </template>
                      </button>
                    </div>

                    <!-- Back to Login Link -->
                    <div class="text-center mt-2">
                      <NuxtLink to="/login" class="card-link">
                        <i class="feather icon-arrow-left mr-1"></i>
                        Back to Login
                      </NuxtLink>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>



<style>
.main-login {
  background: url('/app-assets/images/pages/vuexy-login-bg.jpg') center center no-repeat;
  background-size: cover;
}

.bg-authentication {
  background-color: #eff2f7;
}
</style>