import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SparklesIcon } from '@heroicons/react/24/outline';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                navigate('/patient-dashboard/home');
            } else {
                alert(result.error || 'Login failed');
            }
        } catch (error) {
            alert('An error occurred during login');
            console.error('Login error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickLogin = () => {
        setEmail('hammad@example.com');
        setPassword('demo123');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-primary-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-dent rounded-xl flex items-center justify-center">
                            <SparklesIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-primary-900">Dent<span className="text-primary-600">AI</span></h1>
                            <p className="text-sm text-primary-600">Patient Portal</p>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-primary-900">Patient Login</h2>
                    <p className="text-primary-600 mt-2">Sign in to access your dashboard</p>
                </div>

                {/* Quick Login Button */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={handleQuickLogin}
                        className="w-full py-3 bg-primary-100 text-primary-700 font-medium rounded-lg hover:bg-primary-200 transition-colors mb-4"
                    >
                        Quick Demo Login
                    </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-primary-50 border border-primary-100 rounded-lg text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-primary-50 border border-primary-100 rounded-lg text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-gradient-dent text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Demo Info */}
                <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                    <p className="text-sm text-primary-700">
                        <strong>Demo Credentials:</strong>
                    </p>
                    <p className="text-sm text-primary-600 mt-1">
                        • Email: hammad@example.com
                    </p>
                    <p className="text-sm text-primary-600">
                        • Password: demo123
                    </p>
                    <p className="text-sm text-primary-600 mt-2">
                        <em>Or use any email/password combination</em>
                    </p>
                </div>

                {/* Register Link (Optional) */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-primary-600">
                        Don't have an account?{' '}
                        <button
                            onClick={() => alert('Registration will be added later')}
                            className="font-medium text-primary-700 hover:text-primary-800"
                        >
                            Contact admin
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;