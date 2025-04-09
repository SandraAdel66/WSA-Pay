import { defineStore } from 'pinia';
import type { LocationQueryValue } from 'vue-router';
import { useToast } from '~/composables/useToast';

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
  const token = useCookie('PFS_AUTH_TOKEN', { maxAge: 60 * 60 * 2 }); // Store token in cookie for 2 hours

  // Computed property to check if the user is authenticated
  const hasUser = computed(() => !!user.value);

  const setToken = (data?: string) => {
    token.value = data || ''; // Set token value in the cookie
  };

  const setUser = (data?: Employee | null) => {
    user.value = data || null; // Set user data
  };

  const login = async (data: Credential, path?: string | LocationQueryValue) => {
    try {
      const { data: userData, token: authToken } = await useApiFetch('/api/admin/login', {
        method: 'POST',
        body: data,
      });
  
      if (userData && authToken) {
        const userResponse = userData as { data: Employee };
  
        setToken(authToken); // must set token first if fetchAuthUser depends on it
        await fetchAuthUser(); // ✅ important: ensure user is fetched and reactive
  
        // ✅ Optional: give nextTick() time for layout/middleware to react
        await nextTick();
  
        navigateTo(path || '/dashboard');
  
        useToast({
          title: 'Welcome',
          message: 'Logged in Successfully',
          type: 'success',
          duration: 5000,
        });
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };
  

  const fetchAuthUser = async () => {
    try {
      // Fetch authenticated user data
      const { data: res, error } = await useApiFetch('/api/admin/details');

      if (res) {
        setUser(res as Employee); // Set the authenticated user data
      } else if (error) {
        const message = error.data.message || 'Failed to fetch authenticated user.';
        setUser(null);
        await logout();
      }
    } catch (err) {
      console.error('Error fetching authenticated user:', err);
      setUser(null);
      await logout();
    }
  };

  const logout = async () => {
    try {
      // Logout request
      await useApiFetch('/api/admin/logout', { method: 'POST' });

      // Reset user and token
      setToken();
      setUser();

      // Redirect to login page
      navigateTo('/login');

      // Show success toast
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return {
    user,
    token,
    hasUser,
    logout,
    login,
    fetchAuthUser,
    setUser,
    setToken,
  };
});
