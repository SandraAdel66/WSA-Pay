import { defineStore } from 'pinia';
import type { LocationQueryValue } from 'vue-router';

type Employee = {
    id: number;
    name: string;
    email: string;
};

type Credential = {
    email: string;
    password: string;
};

export const useUserStore = defineStore('user', () => {
    const user = ref<Employee | null>(null);
    const token = useCookie('PFS_AUTH_TOKEN', { maxAge: 60 * 60 * 2 });

    // Computed property to check if the user is authenticated
    const hasUser = computed(() => !!user.value);

    const setToken = (data?: string) => {
        token.value = data || '';
    };

    const setUser = (data?: Employee | null) => {
        user.value = data || null;
    };

    const login = async (data: Credential, path?: string | LocationQueryValue) => {
        try {
            // Fetch CSRF token
            await useApiFetch('/sanctum/csrf-cookie');

            // Call login API
            const { data: userData, error } = await useApiFetch('/api/login', {
                method: 'POST',
                body: data,
            });

            // Handle successful login
            if (userData.value) {
                const userResponse = userData.value as { data: Employee; token: string };
                setUser(userResponse.data);
                setToken(userResponse.token);

                // Redirect after login
                if (path) {
                    navigateTo(path);
                } else {
                    navigateTo('/');
                }
                useToast({ title: 'Welcome', message: 'Logged in Successfully', type: 'success', duration: 5000 });
            }

            // Handle error from login response
            if (error?.value) {
                const message = error.value.data.message || 'Login failed, please try again.';
                useToast({ title: 'Error', message, type: 'error', duration: 5000 });
            }
        } catch (err) {
            console.error('Login error:', err);
            useToast({ title: 'Error', message: 'An error occurred during login. Please try again.', type: 'error', duration: 5000 });
        }
    };

    const fetchAuthUser = async () => {
        try {
            // Fetch authenticated user
            const { data: res, error } = await useApiFetch('/api/fetch-auth');
            
            if (res.value) {
                setUser(res.value as Employee);
            } else if (error?.value) {
                const message = error.value.data.message || 'Failed to fetch authenticated user.';
                useToast({ title: 'Error', message, type: 'error', duration: 5000 });
                setUser(null);
                await logout();
            }
        } catch (err) {
            console.error('Error fetching authenticated user:', err);
            useToast({ title: 'Error', message: 'An error occurred while fetching user data.', type: 'error', duration: 5000 });
            setUser(null);
            await logout();
        }
    };

    const logout = async () => {
        try {
            // Logout request
            await useApiFetch('/sanctum/csrf-cookie');
            await useApiFetch('/api/logout', { method: 'POST' });

            // Reset user and token
            setToken();
            setUser();

            // Redirect to login
            navigateTo('/login');
        } catch (err) {
            console.error('Error during logout:', err);
            useToast({ title: 'Error', message: 'An error occurred during logout. Please try again.', type: 'error', duration: 5000 });
        }
    };

    return {
        user,
        token,
        hasUser,    // Computed property to check if the user is authenticated
        logout,
        login,
        fetchAuthUser,
        setUser,
        setToken,
    };
});
function useToast(arg0: { title: string; message: string; type: string; duration: number; }) {
    throw new Error('Function not implemented.');
}

