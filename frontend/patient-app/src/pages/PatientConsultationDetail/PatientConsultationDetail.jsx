import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarDaysIcon, ArrowLeftIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

const PatientConsultationDetail = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const consultation = state?.consultation;

    if (!consultation) {
        return (
            <div className="p-4 text-center text-emerald-600">
                <p>No consultation data found.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const statusColors = {
        completed: 'bg-green-100 text-green-700',
        booked: 'bg-amber-100 text-amber-700',
        cancelled: 'bg-red-100 text-red-700',
    };
    const statusKey = consultation.status?.toLowerCase();

    return (
        <div className="p-3 lg:p-4 w-full mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 mb-6 font-medium"
            >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Consultations
            </button>

            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-green-400 p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <CalendarDaysIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Consultation Details</h2>
                            <p className="text-emerald-100 text-sm">Booking ID: #{String(consultation.id).slice(-6).toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <UserIcon className="w-5 h-5 text-emerald-600" />
                            <div>
                                <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide">Dentist</p>
                                <p className="font-semibold text-emerald-900">Dr. {consultation.dentist}</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[statusKey] || 'bg-gray-100 text-gray-700'}`}>
                            {consultation.status?.charAt(0).toUpperCase() + consultation.status?.slice(1)}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-50 rounded-xl">
                            <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide mb-1">Date</p>
                            <p className="font-semibold text-emerald-900">
                                {new Date(consultation.date).toLocaleDateString('en-US', {
                                    weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                                <ClockIcon className="w-3 h-3 text-emerald-500" />
                                <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide">Time Slot</p>
                            </div>
                            <p className="font-semibold text-emerald-900">{consultation.time}</p>
                        </div>
                    </div>

                    {consultation.notes && (
                        <div className="p-4 bg-emerald-50 rounded-xl">
                            <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide mb-2">Notes</p>
                            <p className="text-emerald-800">{consultation.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientConsultationDetail;