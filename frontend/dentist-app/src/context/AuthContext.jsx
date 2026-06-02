import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const navigate = useNavigate();

    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = 'http://localhost:8000';

        const reqInterceptor = axios.interceptors.request.use((config) => {
            const token = localStorage.getItem('accessToken');
            const refresh = localStorage.getItem('refreshToken');
            if (token) config.headers['Authorization'] = `Bearer ${token}`;
            if (refresh) config.headers['X-Refresh-Token'] = refresh;
            return config;
        });

        const resInterceptor = axios.interceptors.response.use((response) => {
            const newToken = response.headers['x-new-access-token'];
            if (newToken) {
                localStorage.setItem('accessToken', newToken);
                setAccessToken(newToken);
            }
            return response;
        });

        return () => {
            axios.interceptors.request.eject(reqInterceptor);
            axios.interceptors.response.eject(resInterceptor);
        };
    }, []);

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
                if (parsedUser.role === 'admin') {
                    endpoint = '/api/admin/verify';
                } else if (parsedUser.role === 'dentist') {
                    endpoint = '/api/dentists/verify';
                } else {
                    endpoint = '/api/users/verify'
                }
            }

            const response = await axios.get(endpoint, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                // Keep accessToken state in sync after page refresh
                const storedToken = localStorage.getItem("accessToken");
                if (storedToken) setAccessToken(storedToken);
            } else {
                throw new Error("Verification failed");
            }

        } catch (error) {
            console.log("Verification error:", error.message);
            // localStorage.removeItem("user");
            // localStorage.removeItem("accessToken");
            // localStorage.removeItem("refreshToken");
            // setUser(null);
            // setAccessToken(null);
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

            const response = await axios.post('/api/admin/login', {
                email: email,
                password: password
            });

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
            if (error.status === 404) {
                toast.error("Email or Password Incorrect")
            }
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                'Login failed. Please try again.';
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

            const response = await axios.post('/api/dentists/login', {
                email: email,
                password: password
            });

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

                setTimeout(() => {
                    navigate('/dentist-dashboard/home');
                }, 1000);

                return { success: true };
            }
        } catch (error) {
            if (error.status === 404) {
                toast.error("Email or Password Incorrect")
            }
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                'Login failed. Please try again.';
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

            const response = await axios.post('/api/users/login', {
                email: email,
                password: password
            });

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

                setTimeout(() => {
                    navigate('/patient-dashboard/home');
                }, 1000);

                return { success: true };
            }
        } catch (error) {
            if (error.status === 404) {
                toast.error("Email or Password Incorrect")
            }
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                'Login failed. Please try again.';
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

            if (role === 'admin') {
                endpoint = '/api/admin/logout';
            } else if (role === 'dentist') {
                endpoint = '/api/dentists/logout';
            }

            const response = await axios.post(endpoint, {}, {
                withCredentials: true
            });

            if (response.success) {
                toast.success("Loggedout Successfull");
            }

            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            setUser(null);
            setAccessToken(null);
            setError('');
            setSuccess('');

            navigate('/home');

        } catch (error) {
            console.error('Logout API error:', error);

            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            setUser(null);
            setAccessToken(null);

            navigate('/home');
        }
    };


    const contextValue = {
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
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;