import type { UseFetchOptions } from "#app";
import { useNotify } from '~/composables/useNotify'
const notify = useNotify()

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl; // Already includes `/backend`

    if (!path.startsWith('/')) {
        path = '/' + path; // Ensure the path starts with a slash
    }

    let headers: Record<string, string> = {
        accept: 'application/json',
        referer: config.public.appUrl,
    };

    const token = useCookie('XSRF-TOKEN');
    if (token.value) {
        headers['X-XSRF-TOKEN'] = token.value as string;
    }

    const userStore = useUserStore();
    const bearerToken = userStore.token;
    if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    return $fetch<T>(`${apiUrl}${path}`, {
        ...options,
        headers: {
            ...headers,
            ...(options.headers || {}),
        },
        onResponseError({ response }) {
            if (response.status === 401) {
                const message = response?._data.message || 'Login failed, please try again.';
           
                notify.error(message);

                userStore.setToken();
                userStore.setUser();
                navigateTo('/login');
            }
        },
    });
}
