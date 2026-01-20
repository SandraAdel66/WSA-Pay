export default defineNuxtRouteMiddleware(async (to, from) => {
  // Avoid SSR issues
  if (!process.client) return;

  const userStore = useUserStore();

  // Only fetch user on client side to avoid SSR-related issues
  await userStore.fetchAuthUser();

  if (userStore.user || userStore.token) {
    return navigateTo('/dashboard');
  }
});
