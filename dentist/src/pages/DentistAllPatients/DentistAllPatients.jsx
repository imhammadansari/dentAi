import React, { useState } from 'react';
import {
    UserCircleIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarDaysIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const DentistAllPatients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const patients = [
        {
            id: 1,
            name: 'Ejaz',
            email: 'ejaz@example.com',
            phone: '0333333333',
            lastVisit: '2024-02-15',
            nextAppointment: '2024-03-10',
            totalVisits: 2,
            treatments: ['Cavity Detecting'],
        },
        {
            id: 2,
            name: 'Mohsin',
            email: 'mohsin@example.com',
            phone: '033333333',
            lastVisit: '2024-02-18',
            nextAppointment: '2024-03-05',
            totalVisits: 2,
            treatments: ['Detect Cavity'],
        },
        {
            id: 3,
            name: 'ABCD',
            email: 'sbcd@example.com',
            phone: '033333333',
            lastVisit: '2024-02-10',
            nextAppointment: null,
            totalVisits: 5,
            treatments: ["Cavity"],
        }
    ];

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const statusCounts = patients.reduce((acc, patient) => {
        acc[patient.status] = (acc[patient.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="p-6 min-h-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-black">My Patients</h3>
                        <p className="text-emerald-600">Manage and view patient records and history</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                        <p className="text-emerald-600 font-medium">Total Patients</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">{patients.length}</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                        <p className="text-emerald-600 font-medium">Active Patients</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">{statusCounts.active || 0}</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                        <p className="text-emerald-600 font-medium">Avg. Visits</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                            {(patients.reduce((sum, p) => sum + p.totalVisits, 0) / patients.length).toFixed(1)}
                        </h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                        <p className="text-emerald-600 font-medium">Upcoming Appointments</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                            {patients.filter(p => p.nextAppointment).length}
                        </h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="w-5 h-5 text-black absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search patients by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-black text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="relative">
                                <FunnelIcon className="w-5 h-5 text-black absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-10 pr-8 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                                >
                                    <option value="all">All Patients</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <button className="px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 hover:bg-emerald-100 transition-colors">
                                <ArrowPathIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPatients.map((patient) => (
                        <div key={patient.id} className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6 border-b border-emerald-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center">
                                            <UserCircleIcon className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-black">{patient.name}</h4>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-emerald-600">Total Visits</p>
                                        <p className="text-xl font-bold text-black">{patient.totalVisits}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <EnvelopeIcon className="w-5 h-5 text-emerald-500" />
                                        <span className="text-black">{patient.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <PhoneIcon className="w-5 h-5 text-emerald-500" />
                                        <span className="text-black">{patient.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CalendarDaysIcon className="w-5 h-5 text-emerald-500" />
                                        <div>
                                            <p className="text-sm text-black">Last Visit</p>
                                            <p className="text-black">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {patient.nextAppointment && (
                                        <div className="flex items-center gap-3">
                                            <ClockIcon className="w-5 h-5 text-emerald-500" />
                                            <div>
                                                <p className="text-sm text-black">Next Appointment</p>
                                                <p className="text-black font-medium">
                                                    {new Date(patient.nextAppointment).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <p className="text-sm text-black mb-2">Recent Treatments</p>
                                    <div className="flex flex-wrap gap-2">
                                        {patient.treatments.map((treatment, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">
                                                {treatment}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <button className="py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors">
                                        View Profile
                                    </button>
                                    <button className="py-2 bg-white border-2 border-emerald-200 text-emerald-700 font-medium rounded-lg hover:bg-emerald-50 transition-colors">
                                        Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPatients.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserCircleIcon className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h4 className="text-xl font-bold text-emerald-900 mb-2">No patients found</h4>
                        <p className="text-emerald-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DentistAllPatients;