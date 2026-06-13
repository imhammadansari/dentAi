import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    UserCircleIcon,
    LockClosedIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    ArrowRightIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PatientLogin = ({ isLogin = true }) => {
    const [isLoginMode, setIsLoginMode] = useState(isLogin);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState('');
    const { setError, error, handlePatientLogin } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [loading, setLoading] = useState(false)

    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleSignup = async () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await axios.post('/api/users/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                setSuccess('Registration successful! Please login.');

                setTimeout(() => {
                    setIsLoginMode(true);
                    setSuccess('');
                    setFormData(prev => ({
                        ...prev,
                        password: '',
                        confirmPassword: ''
                    }));
                }, 2000);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError(error.response?.data || error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            if (isLoginMode) {
                await handlePatientLogin(formData.email, formData.password);
                // Loading true hi rahega until redirect/navigation happens
            } else {
                await handleSignup();
            }
        } catch (error) {
            console.error(error);
        } finally {
            if (!isLoginMode) {
                setLoading(false);
            }
        }
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setLoading(true);

        } catch (error) {
            setError('Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-2" style={{ background: 'linear-gradient(135deg, #f0f9f0 0%, #e6f7e6 100%)' }}>
            <div className="w-full max-w-md">

                <div className="text-center">
                    <div className="flex justify-center mb-1">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                            <ShieldCheckIcon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: '#14532d' }}>
                        Dent<span style={{ color: '#22c55e' }}>AI</span>
                    </h1>
                    <p className="text-lg pb-2" style={{ color: '#4b5563' }}>
                        {isLoginMode ? 'Welcome back to your Dental Care' : 'Join our Dental Care Community'}
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden" style={{ border: '1px solid #d1fae5' }}>
                    <div className="p-6">
                        {error && (
                            <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                                <p className="text-sm font-medium text-center" style={{ color: '#dc2626' }}>
                                    {error}
                                </p>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                <p className="text-sm font-medium text-center" style={{ color: '#16a34a' }}>
                                    {success}
                                </p>
                            </div>
                        )}

                        <div className="flex mb-4">
                            <button
                                onClick={() => setIsLoginMode(true)}
                                disabled={loading}
                                className={`flex-1 cursor-pointer py-3 text-center font-semibold rounded-xl transition-all ${isLoginMode ? 'text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                style={isLoginMode ? { background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' } : { backgroundColor: '#f9fafb' }}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setIsLoginMode(false)}
                                disabled={loading}
                                className={`flex-1 cursor-pointer py-3 text-center font-semibold rounded-xl transition-all ml-4 ${!isLoginMode ? 'text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                style={!isLoginMode ? { background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' } : { backgroundColor: '#f9fafb' }}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {!isLoginMode && (
                                <div className="mb-2">
                                    <label className="block mb-2 font-medium" style={{ color: '#374151' }}>Full Name</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <UserCircleIcon className="w-5 h-5" style={{ color: '#9ca3af' }} />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all"
                                            style={{
                                                borderColor: '#d1fae5',
                                                backgroundColor: '#f0fdf4',
                                                color: '#1f2937'
                                            }}
                                            required={!isLoginMode}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mb-2">
                                <label className="block mb-2 font-medium" style={{ color: '#374151' }}>Email Address</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <EnvelopeIcon className="w-5 h-5" style={{ color: '#9ca3af' }} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all"
                                        style={{
                                            borderColor: '#d1fae5',
                                            backgroundColor: '#f0fdf4',
                                            color: '#1f2937'
                                        }}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 font-medium" style={{ color: '#374151' }}>Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <LockClosedIcon className="w-5 h-5" style={{ color: '#9ca3af' }} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        className="w-full pl-12 pr-12 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all"
                                        style={{
                                            borderColor: '#d1fae5',
                                            backgroundColor: '#f0fdf4',
                                            color: '#1f2937'
                                        }}
                                        required
                                        disabled={loading}
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                        style={{ color: '#6b7280' }}
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {!isLoginMode && (
                                <div className="mb-8">
                                    <label className="block mb-2 font-medium" style={{ color: '#374151' }}>Confirm Password</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <LockClosedIcon className="w-5 h-5" style={{ color: '#9ca3af' }} />
                                        </div>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirm your password"
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all"
                                            style={{
                                                borderColor: '#d1fae5',
                                                backgroundColor: '#f0fdf4',
                                                color: '#1f2937'
                                            }}
                                            required={!isLoginMode}
                                            disabled={loading}
                                            minLength="6"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* {isLoginMode && (
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            className="mr-2 rounded"
                                            style={{ accentColor: '#22c55e' }}
                                            disabled={loading}
                                        />
                                        <label htmlFor="remember" className="text-sm" style={{ color: '#6b7280' }}>
                                            Remember me
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="font-medium hover:underline transition-all text-sm"
                                        style={{ color: '#16a34a' }}
                                        disabled={loading}
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )} */}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
                                style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>

                                        {isLoginMode ? "Loading..." : "Creating Account..."}
                                    </>
                                ) : (
                                    <>
                                        {isLoginMode ? "Login to Account" : "Create Account"}
                                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-2 pt-2 border-t text-center" style={{ borderColor: '#d1fae5' }}>
                            <p className="text-gray-600">
                                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => {
                                        setIsLoginMode(!isLoginMode);
                                        setError('');
                                        setSuccess('');
                                    }}
                                    className="font-semibold hover:underline transition-all"
                                    style={{ color: '#16a34a' }}
                                    disabled={loading}
                                >
                                    {isLoginMode ? 'Sign up here' : 'Login here'}
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* <div className="px-8 pb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#f0fdf4', border: '1px solid #d1fae5' }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: '#dcfce7' }}>
                                    <svg className="w-5 h-5" style={{ color: '#16a34a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium" style={{ color: '#374151' }}>Secure & Safe</p>
                            </div>
                            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#f0fdf4', border: '1px solid #d1fae5' }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: '#dcfce7' }}>
                                    <svg className="w-5 h-5" style={{ color: '#16a34a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium" style={{ color: '#374151' }}>Privacy First</p>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* <div className="mt-8 text-center">
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                        By continuing, you agree to our{' '}
                        <Link to="/terms" className="font-medium hover:underline" style={{ color: '#16a34a' }}>Terms</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="font-medium hover:underline" style={{ color: '#16a34a' }}>Privacy Policy</Link>
                    </p>
                </div> */}
            </div>
        </div>
    );
};

export default PatientLogin;