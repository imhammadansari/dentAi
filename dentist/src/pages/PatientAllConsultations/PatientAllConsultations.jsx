import React from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

const mockConsultations = [
    { id: 1, date: '2024-02-20', time: '10:30 AM', dentist: 'Dr. Sarah Johnson', status: 'upcoming' },
    { id: 2, date: '2024-02-10', time: '2:00 PM', dentist: 'Dr. Michael Chen', status: 'completed', notes: 'Regular checkup - all good' },
    { id: 3, date: '2024-01-25', time: '11:15 AM', dentist: 'Dr. Emily Wilson', status: 'completed', notes: 'Tooth filling procedure' },
];

const PatientAllConsultations = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-emerald-900">Consultation History</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium">All</button>
                        <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">Upcoming</button>
                        <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">Completed</button>
                    </div>
                </div>
                <div className="space-y-4">
                    {mockConsultations.map((consultation) => (
                        <div key={consultation.id} className={`p-6 rounded-xl ${consultation.status === 'upcoming'
                                ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100'
                                : 'bg-white border border-emerald-100'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${consultation.status === 'completed'
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        <CalendarDaysIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-900 text-lg">{consultation.dentist}</h4>
                                        <p className="text-emerald-600">
                                            {new Date(consultation.date).toLocaleDateString()} • {consultation.time}
                                        </p>
                                        {consultation.notes && (
                                            <p className="text-emerald-700 mt-2">{consultation.notes}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-4 py-2 rounded-full font-medium ${consultation.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : consultation.status === 'upcoming'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                                    </span>
                                    <div className="mt-3">
                                        {consultation.status === 'upcoming' ? (
                                            <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                                                Chat
                                            </button>
                                        ) : (
                                            <button className="px-6 py-2 border-2 border-emerald-200 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                                                View Details
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatientAllConsultations;