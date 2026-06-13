import axios from 'axios';

const BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject, config }) => {
        if (error) reject(error);
        else resolve(api(config));
    });
    failedQueue = [];
};

// If a request fails with 401 (accessToken cookie missing/expired), hit
// /verify once — verifyToken middleware will use the refreshToken cookie to
// issue a new accessToken cookie. On success, retry the original request.
// On failure, both tokens are dead — redirect to login.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if ((status === 401 || status === 403) && originalRequest && !originalRequest._retried) {
            originalRequest._retried = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, config: originalRequest });
                });
            }

            isRefreshing = true;

            try {
                await axios.get(`${BASE_URL}/api/users/verify`, { withCredentials: true });
                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                window.location.href = '/';
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
