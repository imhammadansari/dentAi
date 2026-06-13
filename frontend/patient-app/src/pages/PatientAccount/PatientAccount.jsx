import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    UserCircleIcon, EnvelopeIcon, PhoneIcon,
    CheckCircleIcon, ExclamationCircleIcon, PencilIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const PatientAccount = () => {
    const { user, setUser } = useAuth();
    const [form, setForm] = useState({ phone: '', gender: '', age: '' });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [editing, setEditing] = useState(false);

    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/users/verify`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const u = res.data.user;
                setForm({
                    phone: u.phone || '',
                    gender: u.gender || '',
                    age: u.age || ''
                });
            } catch (err) {
                console.log(err.message);
            } finally {
                setFetching(false);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isProfileComplete = form.phone && form.gender && form.age;

    const handleSave = async () => {
        if (!form.phone || !form.gender || !form.age) {
            toast.error('Phone, Gender and Age are required');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_SERVER_URL}/api/users/update-profile`,
                { phone: form.phone, gender: form.gender, age: parseInt(form.age) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                toast.success('Profile updated successfully!');
                setEditing(false);
                const updatedUser = { ...user, phone: form.phone, gender: form.gender, age: form.age };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-3 lg:p-4 w-full mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">My Account</h2>
                <p className="text-emerald-600">Manage your profile information</p>
            </div>

            {!isProfileComplete && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <ExclamationCircleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-amber-800">Complete your profile</p>
                        <p className="text-sm text-amber-600 mt-0.5">Please fill in your Phone Number, Gender, and Age to access all features.</p>
                    </div>
                </div>
            )}

            {isProfileComplete && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <p className="font-semibold text-emerald-800">Profile complete</p>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-green-400 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                            <p className="text-emerald-100 text-sm">Patient Account</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-50 rounded-xl">
                            <label className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Full Name</label>
                            <p className="mt-1 font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">From login credentials</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl">
                            <label className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Email Address</label>
                            <div className="flex items-center gap-1.5 mt-1">
                                <EnvelopeIcon className="w-4 h-4 text-emerald-400" />
                                <p className="font-semibold text-gray-900">{user?.email}</p>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">From login credentials</p>
                        </div>
                    </div>

                    <div className="border-t border-emerald-100 pt-5">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-900">Profile Details</h4>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-medium transition-colors"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {editing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <PhoneIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            placeholder="e.g. 0333-1234567"
                                            className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.gender}
                                            onChange={e => setForm({ ...form, gender: e.target.value })}
                                            className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Age <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="120"
                                            value={form.age}
                                            onChange={e => setForm({ ...form, age: e.target.value })}
                                            placeholder="e.g. 25"
                                            className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-400 text-white font-bold rounded-xl hover:shadow-md hover:shadow-emerald-200 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Profile'}
                                    </button>
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-emerald-50 rounded-xl">
                                    <label className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Phone</label>
                                    <p className="mt-1 font-semibold text-gray-900">
                                        {form.phone || <span className="text-gray-300 font-normal">Not set</span>}
                                    </p>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-xl">
                                    <label className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Gender</label>
                                    <p className="mt-1 font-semibold text-gray-900">
                                        {form.gender || <span className="text-gray-300 font-normal">Not set</span>}
                                    </p>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-xl">
                                    <label className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Age</label>
                                    <p className="mt-1 font-semibold text-gray-900">
                                        {form.age ? `${form.age} years` : <span className="text-gray-300 font-normal">Not set</span>}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientAccount;