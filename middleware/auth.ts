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
  
    try {
      await userStore.fetchAuthUser();
  
      if (userStore.user || userStore.token) {
        // User is logged in, allow access to requested page
        return;
      }
  
      // Redirect to login if not authenticated
      return navigateTo({ path: '/login', query: { redirect: to.fullPath } });
    } catch (err) {
      // In case of error, redirect to login page
      return navigateTo('/login');
    }
  });
  