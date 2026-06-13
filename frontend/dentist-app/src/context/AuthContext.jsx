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

        const resInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                const status = error.response?.status;

                const isVerifyCall = originalRequest?.url?.includes('/api/dentists/verify');

                if ((status === 401 || status === 403) && originalRequest && !originalRequest._retried && !isVerifyCall) {
                    originalRequest._retried = true;

                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject, config: originalRequest });
                        });
                    }

                    isRefreshing = true;

                    try {
                        const verifyRes = await axios.get('/api/dentists/verify', { withCredentials: true });
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

    const verifyUser = async () => {
        try {
            const response = await axios.get('/api/dentists/verify', { withCredentials: true });

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

    useEffect(() => {
        if (loading) return;
        if (user) return;

        const publicPaths = ['/', '/dentist-login', '/dentist-signup'];
        if (!publicPaths.includes(location.pathname)) {
            navigate('/', { replace: true });
        }
    }, [loading, user, location.pathname]);

    const handleDentistLogin = async (email, password) => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const response = await axios.post('/api/dentists/login', { email, password }, { withCredentials: true });

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

    const isAuthenticated = () => {
        return !!user;
    };

    const hasRole = (requiredRole) => {
        return user?.role === requiredRole;
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/dentists/logout', {}, { withCredentials: true });
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
            handleDentistLogin,
            handleLogout,
            isAuthenticated,
            hasRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
