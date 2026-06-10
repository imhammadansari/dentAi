import axios from 'axios';

const BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// ─── Request interceptor ──────────────────────────────────────────────────────
// Attach accessToken + refreshToken from localStorage on every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        const refresh = localStorage.getItem('refreshToken');
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        if (refresh) config.headers['X-Refresh-Token'] = refresh;
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────────
// 1. If server silently refreshed the token (X-New-Access-Token header) → save it
// 2. If 401/403 → the server already tried to refresh via verifyToken middleware.
//    If it succeeded it returned X-New-Access-Token — save it and retry.
//    If it failed (no refresh token or refresh expired) → clear session + redirect.
api.interceptors.response.use(
    (response) => {
        // Server issued a new access token silently (expired token was refreshed)
        const newToken = response.headers['x-new-access-token'];
        if (newToken) {
            localStorage.setItem('accessToken', newToken);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if ((status === 401 || status === 403) && !originalRequest._retried) {
            originalRequest._retried = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Call the refresh endpoint directly with plain axios (not api)
                    // to avoid interceptor loop
                    const res = await axios.post(
                        `${BASE_URL}/api/users/refresh-token`,
                        {},
                        {
                            headers: { 'X-Refresh-Token': refreshToken },
                            withCredentials: true,
                        }
                    );

                    const newToken = res.data?.accessToken || res.headers['x-new-access-token'];

                    if (newToken) {
                        localStorage.setItem('accessToken', newToken);
                        // Retry the original request with the new token
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return api(originalRequest);
                    }
                } catch (_) {
                    // Refresh failed — fall through to clear session
                }
            }

            // No refresh token or refresh failed → clear session and redirect to login
            const role = (() => {
                try { return JSON.parse(localStorage.getItem('user'))?.role; } catch { return null; }
            })();

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            const loginPath = role === 'admin' ? '/admin-login'
                : role === 'dentist' ? '/dentist-login'
                    : '/home';

            window.location.href = loginPath;
        }

        return Promise.reject(error);
    }
);

export default api;