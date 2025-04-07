export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore();
    await userStore.fetchAuthUser();

    if (userStore.user || userStore.token) {
        if (userStore.user?.firstLoginAt === null) {
            if (to.path !== '/profile/complete-profile') {
                return navigateTo('/profile/complete-profile');
            }
        } else if (to.path === '/profile/complete-profile') {
            return navigateTo('/profile/edit');
        }

        // Role-based layout selection
        if (userStore.user?.role === 'employee') {
            to.meta.layout = 'employee'; // Set layout to `employee.vue`
            if (to.path === '/') return navigateTo('/employee');
        } else if (userStore.user?.role === 'admin') {
            to.meta.layout = 'default'; // Set layout to `default.vue`
            if (to.path === '/employee') return navigateTo('/');
        }
        
        return;
    }

    return navigateTo({ path: '/login', query: { redirect: to.fullPath } });
});
