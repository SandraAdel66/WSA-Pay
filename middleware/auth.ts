export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $pinia } = useNuxtApp();
  const userStore = useUserStore($pinia);

  // Check if the user is already on the login page
  if (to.path === '/login') {
    // If user is already logged in, redirect to the dashboard
    if (userStore.user || userStore.token) {
      return navigateTo('/dashboard');
    }
    // If not logged in, stay on the login page
    return;
  }

  // Check if we have a user token already in cookies or localStorage
  if (userStore.token) {
    try {
      // Check if the user is valid (if not, redirect to login)
      await userStore.fetchAuthUser();
      return; // Continue to the requested page
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }

  // If no valid user or token, redirect to login
  return navigateTo({ path: '/login', query: { redirect: to.fullPath } });
});
