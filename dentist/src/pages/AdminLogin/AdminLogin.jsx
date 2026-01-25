import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    LockClosedIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    ArrowRightIcon,
    ShieldCheckIcon,
    KeyIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { handleAdminLogin, loading, error, setError } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await handleAdminLogin(formData.email, formData.password);

        if (result) {
            navigate('/admin-dashboard/home');
        }
    }



    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                            <ShieldCheckIcon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: '#16a34ax' }}>
                        Dent<span style={{ color: '#22c55e' }}>AI</span>
                    </h1>
                    <p className="text-lg" style={{ color: '#6b7280' }}>
                        Administrator Portal
                    </p>
                    <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
                        Secure system administration
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden" style={{ border: '1px solid #f3e8ff' }}>
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                                <p className="text-sm font-medium text-center" style={{ color: '#dc2626' }}>
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="mb-8 p-4 rounded-xl text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <KeyIcon className="w-5 h-5" style={{ color: '#22c55e' }} />
                                <p className="font-semibold" style={{ color: '#22c55e' }}>Restricted Access</p>
                            </div>
                            <p className="text-sm" style={{ color: '#6b7280' }}>
                                This portal is for authorized administrators only
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block mb-2 font-medium" style={{ color: '#374151' }}>Admin Email</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <EnvelopeIcon className="w-5 h-5" style={{ color: '#9ca3af' }} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="admin@dentai.com"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all"
                                        style={{
                                            borderColor: '#f3e8ff',
                                            backgroundColor: '#faf5ff',
                                            color: '#1f2937'
                                        }}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block mb-2 font-medium" style={{ color: '#374151' }}>Admin Password</label>
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
                                            borderColor: '#f3e8ff',
                                            backgroundColor: '#faf5ff',
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

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
                                style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Login as Administrator
                                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: '#f3e8ff' }}>
                            <p className="text-sm" style={{ color: '#6b7280' }}>
                                Forgot credentials? Contact{' '}
                                <span className="font-medium" style={{ color: '#22c55e' }}>system@dentai.com</span>
                            </p>
                        </div>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#faf5ff', border: '1px solid #f3e8ff' }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: '#f3e8ff' }}>
                                    <svg className="w-5 h-5" style={{ color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium" style={{ color: '#374151' }}>Encrypted</p>
                            </div>
                            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#faf5ff', border: '1px solid #f3e8ff' }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: '#f3e8ff' }}>
                                    <svg className="w-5 h-5" style={{ color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium" style={{ color: '#374151' }}>Secure</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs" style={{ color: '#9ca3af' }}>
                        © 2024 DentAI Admin Portal. All rights reserved.
                    </p>
                    <div className="mt-4 flex justify-center gap-6">
                        <Link to="/patient-login" className="text-xs font-medium hover:underline" style={{ color: '#22c55e' }}>
                            Patient Portal
                        </Link>
                        <Link to="/dentist-login" className="text-xs font-medium hover:underline" style={{ color: '#22c55e' }}>
                            Dentist Portal
                        </Link>
                        <Link to="/terms" className="text-xs font-medium hover:underline" style={{ color: '#22c55e' }}>
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;