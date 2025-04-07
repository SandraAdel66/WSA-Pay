import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore();  // Access the user store directly

    if (userStore.user || userStore.token) {
        return navigateTo('/');
    }
});
