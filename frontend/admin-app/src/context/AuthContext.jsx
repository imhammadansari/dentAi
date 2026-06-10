import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    // Initialise from localStorage so user is never null on first render
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const navigate = useNavigate();

    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);

    // loading = true only during the very first silent verify call.
    // Once that resolves, it stays false — page navigation never triggers it again.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Guard so we don't set up interceptors more than once
    const interceptorsSet = useRef(false);

    useEffect(() => {
        if (interceptorsSet.current) return;
        interceptorsSet.current = true;

        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

        // ── Request interceptor: attach latest tokens on every request
        const reqInterceptor = axios.interceptors.request.use((config) => {
            const token = localStorage.getItem('accessToken');
            const refresh = localStorage.getItem('refreshToken');
            if (token) config.headers['Authorization'] = `Bearer ${token}`;
            if (refresh) config.headers['X-Refresh-Token'] = refresh;
            return config;
        });

        // ── Response interceptor:
        //    1. If server issued a new access token in the header, save it.
        //    2. If we got a 401 and we still have a refreshToken, retry once.
        let isRefreshing = false;
        let failedQueue = [];

        const processQueue = (error, token = null) => {
            failedQueue.forEach(({ resolve, reject, config }) => {
                if (error) {
                    reject(error);
                } else {
                    config.headers['Authorization'] = `Bearer ${token}`;
                    resolve(axios(config));
                }
            });
            failedQueue = [];
        };

        const resInterceptor = axios.interceptors.response.use(
            (response) => {
                // Pick up a silently refreshed token from any successful response
                const newToken = response.headers['x-new-access-token'];
                if (newToken) {
                    localStorage.setItem('accessToken', newToken);
                    setAccessToken(newToken);
                }
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // Only attempt refresh on 401, and only once per request
                if (
                    error.response?.status === 401 &&
                    !originalRequest._retry
                ) {
                    const refreshToken = localStorage.getItem('refreshToken');

                    if (!refreshToken) {
                        // No refresh token — log user out
                        _clearSession();
                        navigate('/');
                        return Promise.reject(error);
                    }

                    if (isRefreshing) {
                        // Queue this request until refresh resolves
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject, config: originalRequest });
                        });
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    try {
                        // Hit any protected endpoint with the refresh token header;
                        // verifyToken middleware will issue a new access token.
                        const refreshRes = await axios.get('/api/users/verify', {
                            headers: {
                                'X-Refresh-Token': refreshToken,
                                'Authorization': '' // force the middleware to use X-Refresh-Token
                            }
                        });

                        const newToken =
                            refreshRes.headers['x-new-access-token'] ||
                            localStorage.getItem('accessToken');

                        if (newToken) {
                            localStorage.setItem('accessToken', newToken);
                            setAccessToken(newToken);
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                            processQueue(null, newToken);
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
                        processQueue(refreshError, null);
                        _clearSession();
                        navigate('/');
                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(reqInterceptor);
            axios.interceptors.response.eject(resInterceptor);
        };
    }, []);

    const _clearSession = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setAccessToken(null);
    };

    // Silent background verify — runs once on app boot.
    // Does NOT block the UI; if it fails we keep the cached user from localStorage.
    const verifyUser = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            let endpoint = '/api/users/verify';
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                if (parsedUser.role === 'admin') endpoint = '/api/admin/verify';
                else if (parsedUser.role === 'dentist') endpoint = '/api/dentists/verify';
            }

            const response = await axios.get(endpoint, { withCredentials: true });

            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                const storedToken = localStorage.getItem("accessToken");
                if (storedToken) setAccessToken(storedToken);
            }
        } catch (err) {
            console.log("Background verify error:", err.message);
            // Don't clear the session here — the response interceptor handles 401 retry.
            // If verify truly fails (network), keep the cached user so the layout stays intact.
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifyUser();
    }, []);

    const handleAdminLogin = async (email, password) => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const response = await axios.post('/api/admin/login', { email, password });

            if (response.data.success) {
                setSuccess('Login successful! Redirecting...');
                toast.success('Login successful!');

                const userData = {
                    id: response.data.data.id,
                    name: response.data.data.name,
                    email: response.data.data.email,
                    role: 'admin',
                    permissions: response.data.data.permissions
                };

                setUser(userData);
                setAccessToken(response.data.data.accessToken);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);

                return { success: true };
            }
        } catch (error) {
            if (error.response?.status === 404) toast.error("Email or Password Incorrect");
            const errorMessage = error.response?.data?.message || error.message || 'Login failed.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const handleDentistLogin = async (email, password) => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const response = await axios.post('/api/dentists/login', { email, password });

            if (response.data.success) {
                setSuccess('Login successful! Redirecting...');
                toast.success('Login successful!');

                const userData = {
                    id: response.data.data.id,
                    name: response.data.data.name,
                    email: response.data.data.email,
                    role: 'dentist',
                    specialty: response.data.data.specialty,
                    approvalStatus: response.data.data.approvalStatus
                };

                setUser(userData);
                setAccessToken(response.data.data.accessToken);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);

                setTimeout(() => navigate('/dentist-dashboard/home'), 1000);
                return { success: true };
            }
        } catch (error) {
            if (error.response?.status === 404) toast.error("Email or Password Incorrect");
            const errorMessage = error.response?.data?.message || error.message || 'Login failed.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const handlePatientLogin = async (email, password) => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const response = await axios.post('/api/users/login', { email, password });

            if (response.data.success) {
                setSuccess('Login successful! Redirecting...');
                toast.success('Login successful!');

                const userData = {
                    id: response.data.data.id,
                    name: response.data.data.name,
                    email: response.data.data.email,
                    role: 'patient'
                };

                setUser(userData);
                setAccessToken(response.data.data.accessToken);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);

                setTimeout(() => navigate('/patient-dashboard/home'), 1000);
                return { success: true };
            }
        } catch (error) {
            if (error.response?.status === 404) toast.error("Email or Password Incorrect");
            const errorMessage = error.response?.data?.message || error.message || 'Login failed.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = () => {
        return !!user && (!!accessToken || !!localStorage.getItem("accessToken"));
    };

    const hasRole = (requiredRole) => {
        return user?.role === requiredRole;
    };

    const handleLogout = async () => {
        try {
            const role = user?.role;
            let endpoint = '/api/users/logout';
            if (role === 'admin') endpoint = '/api/admin/logout';
            else if (role === 'dentist') endpoint = '/api/dentists/logout';

            await axios.post(endpoint, {}, { withCredentials: true });
            toast.success("Logged out successfully");
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            _clearSession();
            setError('');
            setSuccess('');
            navigate('/');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            accessToken,
            loading,
            error,
            success,
            setError,
            setSuccess,
            handleAdminLogin,
            handleDentistLogin,
            handlePatientLogin,
            handleLogout,
            isAuthenticated,
            hasRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;