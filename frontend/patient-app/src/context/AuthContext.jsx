import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // loading = true while we silently verify the session via cookies on app boot
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const _clearSession = () => {
        setUser(null);
    };

    useEffect(() => {
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

        let isRefreshing = false;
        let failedQueue = [];

        const processQueue = (error) => {
            failedQueue.forEach(({ resolve, reject, config }) => {
                if (error) reject(error);
                else resolve(axios(config));
            });
            failedQueue = [];
        };

        // If a request fails with 401/403 (e.g. accessToken cookie missing/expired),
        // try hitting /verify once — the verifyToken middleware will use the
        // refreshToken cookie to issue a new accessToken cookie. If that
        // succeeds, retry the original request. If it also fails, both tokens
        // are dead — clear session and send the user to the home page.
        const resInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                const status = error.response?.status;

                // Don't intercept the /verify call itself — that path is
                // handled directly by verifyUser() to avoid double-calls
                // and redirect loops.
                const isVerifyCall = originalRequest?.url?.includes('/api/users/verify');

                if ((status === 401 || status === 403) && originalRequest && !originalRequest._retried && !isVerifyCall) {
                    originalRequest._retried = true;

                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject, config: originalRequest });
                        });
                    }

                    isRefreshing = true;

                    try {
                        const verifyRes = await axios.get('/api/users/verify', { withCredentials: true });
                        if (verifyRes.data?.success) setUser(verifyRes.data.user);
                        processQueue(null);
                        return axios(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError);
                        _clearSession();
                        navigate('/', { replace: true });
                        return Promise.reject(error);
                    } finally {
                        isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(resInterceptor);
    }, []);

    // Silent background verify — runs once on app boot.
    // The accessToken (and refreshToken) httpOnly cookies are sent automatically.
    // If the accessToken is expired, the verifyToken middleware transparently
    // issues a new one using the refreshToken cookie before this call returns.
    const verifyUser = async () => {
        try {
            const response = await axios.get('/api/users/verify', { withCredentials: true });

            if (response.data.success) {
                setUser(response.data.user);
            } else {
                _clearSession();
            }
        } catch (err) {
            console.log("Background verify error:", err.message);
            _clearSession();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifyUser();
    }, []);

    // If verification finished, there's no user, and we're on a protected
    // (non-login/signup/landing) page, kick the user back to the home page.
    useEffect(() => {
        if (loading) return;
        if (user) return;

        const publicPaths = ['/', '/patient-login', '/patient-signup'];
        if (!publicPaths.includes(location.pathname)) {
            navigate('/', { replace: true });
        }
    }, [loading, user, location.pathname]);

    const handlePatientLogin = async (email, password) => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const response = await axios.post('/api/users/login', { email, password }, { withCredentials: true });

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
        return !!user;
    };

    const hasRole = (requiredRole) => {
        return user?.role === requiredRole;
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/users/logout', {}, { withCredentials: true });
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
            loading,
            error,
            success,
            setError,
            setSuccess,
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
