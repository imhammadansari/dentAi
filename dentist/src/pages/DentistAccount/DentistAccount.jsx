import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    UserCircleIcon, EnvelopeIcon, PhoneIcon,
    IdentificationIcon, BriefcaseIcon, CheckBadgeIcon, ClockIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const DentistAccount = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/dentists/verify`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProfile(res.data.user);
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin" />
            </div>
        );
    }

    const data = profile || user || {};
    const statusColor = data.approvalStatus === 'Approved'
        ? 'bg-emerald-100 text-emerald-700'
        : data.approvalStatus === 'Pending'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-red-100 text-red-700';

    const fields = [
        { icon: UserCircleIcon, label: 'Full Name', value: data.name,  },
        { icon: EnvelopeIcon, label: 'Email Address', value: data.email,  },
        { icon: PhoneIcon, label: 'Phone Number', value: data.phone || '—',  },
        { icon: BriefcaseIcon, label: 'Specialty', value: data.specialty || '—',  },
        { icon: IdentificationIcon, label: 'Licence Number', value: data.licenseNumber || '—',  },
    ];

    return (
        <div className="p-3 lg:p-4 w-full mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">My Account</h2>
                <p className="text-emerald-600">Your dentist profile details</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-green-400 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {data.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Dr. {data.name}</h3>
                            <p className="text-emerald-100 text-sm">{data.specialty || 'Dentist'}</p>
                        </div>
                        <div className="ml-auto">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusColor}`}>
                                {data.approvalStatus === 'Approved' && <CheckBadgeIcon className="w-4 h-4" />}
                                {data.approvalStatus === 'Pending' && <ClockIcon className="w-4 h-4" />}
                                {data.approvalStatus}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Fields */}
                <div className="p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Profile Information</h4>
                    <p className="text-sm text-gray-500 mb-5 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        Your profile details are pulled from your registration. To update any information, please contact the admin.
                    </p>

                    <div className="space-y-3">
                        {fields.map((field, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-emerald-100">
                                    <field.icon className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">{field.label}</p>
                                    <p className="font-semibold text-gray-900 mt-0.5">{field.value}</p>
                                </div>
                                <span className="text-xs text-gray-400">{field.note}</span>
                            </div>
                        ))}
                    </div>

                    {/* Approval Status Notice */}
                    {data.approvalStatus !== 'Approved' && (
                        <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <p className="text-sm font-semibold text-amber-800">Account Pending Approval</p>
                            <p className="text-xs text-amber-600 mt-1">Your account is awaiting admin approval. You will be able to manage patients and slots once approved.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DentistAccount;