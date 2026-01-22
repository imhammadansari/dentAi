import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    UserGroupIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarDaysIcon,
    PhoneIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';

const AdminPatients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const patients = [
        {
            id: 1,
            name: 'Hammad Ansari',
            email: 'hammad@example.com',
            phone: '+1 (555) 123-4567',
            age: 25,
            gender: 'male',
            joinDate: '2023-06-15',
            lastVisit: '2024-02-20',
            nextAppointment: '2024-03-10',
            totalVisits: 8,
            status: 'active',
            reports: 5,
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+1 (555) 987-6543',
            age: 32,
            gender: 'female',
            joinDate: '2023-08-22',
            lastVisit: '2024-02-18',
            nextAppointment: null,
            totalVisits: 4,
            status: 'active',
            reports: 3,
        },
        {
            id: 3,
            name: 'Michael Chen',
            email: 'michael@example.com',
            phone: '+1 (555) 456-7890',
            age: 45,
            gender: 'male',
            joinDate: '2023-11-10',
            lastVisit: '2024-01-25',
            nextAppointment: '2024-03-15',
            totalVisits: 6,
            status: 'active',
            reports: 4,
        },
        {
            id: 4,
            name: 'Emily Wilson',
            email: 'emily@example.com',
            phone: '+1 (555) 789-0123',
            age: 28,
            gender: 'female',
            joinDate: '2024-01-05',
            lastVisit: '2024-02-15',
            nextAppointment: '2024-02-28',
            totalVisits: 2,
            status: 'inactive',
            reports: 1,
        },
        {
            id: 5,
            name: 'Robert Brown',
            email: 'robert@example.com',
            phone: '+1 (555) 234-5678',
            age: 52,
            gender: 'male',
            joinDate: '2023-09-18',
            lastVisit: '2024-02-10',
            nextAppointment: null,
            totalVisits: 3,
            status: 'active',
            reports: 2,
        },
        {
            id: 6,
            name: 'Lisa Anderson',
            email: 'lisa@example.com',
            phone: '+1 (555) 876-5432',
            age: 38,
            gender: 'female',
            joinDate: '2023-12-01',
            lastVisit: '2024-01-20',
            nextAppointment: '2024-03-05',
            totalVisits: 5,
            status: 'active',
            reports: 3,
        },
    ];

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm);
        const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleDeletePatient = (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            console.log('Deleting patient:', id);
        }
    };

    const statusCounts = patients.reduce((acc, patient) => {
        acc[patient.status] = (acc[patient.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="p-6 min-h-full">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-primary-900">Patient Management</h3>
                        <p className="text-primary-600">Manage all patients on the platform</p>
                    </div>
                    <button className="px-6 py-3 bg-gradient-dent text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary-200 transition-all flex items-center gap-2">
                        <PlusIcon className="w-5 h-5" />
                        Add New Patient
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl border border-primary-100 p-6 shadow-sm">
                        <p className="text-primary-600 font-medium">Total Patients</p>
                        <h3 className="text-3xl font-bold text-primary-900 mt-2">{patients.length}</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-primary-100 p-6 shadow-sm">
                        <p className="text-primary-600 font-medium">Active Patients</p>
                        <h3 className="text-3xl font-bold text-primary-900 mt-2">{statusCounts.active || 0}</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-primary-100 p-6 shadow-sm">
                        <p className="text-primary-600 font-medium">Avg. Visits</p>
                        <h3 className="text-3xl font-bold text-primary-900 mt-2">
                            {(patients.reduce((sum, p) => sum + p.totalVisits, 0) / patients.length).toFixed(1)}
                        </h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-primary-100 p-6 shadow-sm">
                        <p className="text-primary-600 font-medium">Total Reports</p>
                        <h3 className="text-3xl font-bold text-primary-900 mt-2">
                            {patients.reduce((sum, p) => sum + p.reports, 0)}
                        </h3>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-2xl border border-primary-100 p-6 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="w-5 h-5 text-primary-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search patients by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-primary-50 border border-primary-100 rounded-xl text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <FunnelIcon className="w-5 h-5 text-primary-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-10 pr-8 py-3 bg-primary-50 border border-primary-100 rounded-xl text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="all">All Patients</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patients Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.map((patient) => (
                        <div key={patient.id} className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            {/* Patient Header */}
                            <div className="p-6 border-b border-primary-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-dent rounded-full flex items-center justify-center">
                                            <UserGroupIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-primary-900">{patient.name}</h4>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient.status === 'active'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {patient.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-primary-600">Total Visits</p>
                                        <p className="text-xl font-bold text-primary-900">{patient.totalVisits}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Patient Info */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <EnvelopeIcon className="w-5 h-5 text-primary-500" />
                                        <span className="text-primary-700">{patient.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <PhoneIcon className="w-5 h-5 text-primary-500" />
                                        <span className="text-primary-700">{patient.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CalendarDaysIcon className="w-5 h-5 text-primary-500" />
                                        <div>
                                            <p className="text-sm text-primary-600">Last Visit</p>
                                            <p className="text-primary-700">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {patient.nextAppointment && (
                                        <div className="flex items-center gap-3">
                                            <CalendarDaysIcon className="w-5 h-5 text-emerald-500" />
                                            <div>
                                                <p className="text-sm text-primary-600">Next Appointment</p>
                                                <p className="text-emerald-700 font-medium">
                                                    {new Date(patient.nextAppointment).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Reports Count */}
                                <div className="mt-6">
                                    <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                                        <span className="text-primary-700">Medical Reports</span>
                                        <span className="px-3 py-1 bg-white text-primary-700 font-medium rounded-full">
                                            {patient.reports} reports
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 grid grid-cols-3 gap-3">
                                    <Link
                                        to={`/admin-dashboard/patients/${patient.id}`}
                                        className="py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors text-center"
                                    >
                                        <EyeIcon className="w-4 h-4 inline mr-1" />
                                        View
                                    </Link>
                                    <button className="py-2 bg-primary-50 text-primary-700 font-medium rounded-lg hover:bg-primary-100 transition-colors">
                                        <PencilIcon className="w-4 h-4 inline mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeletePatient(patient.id)}
                                        className="py-2 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4 inline mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredPatients.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserGroupIcon className="w-12 h-12 text-primary-400" />
                        </div>
                        <h4 className="text-xl font-bold text-primary-900 mb-2">No patients found</h4>
                        <p className="text-primary-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPatients;