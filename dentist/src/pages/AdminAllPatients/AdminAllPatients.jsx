import React, { useState } from 'react';
import {
    UserGroupIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';

const AdminAllPatients = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [newPatient, setNewPatient] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: 'male',
        address: '',
        status: 'active'
    });

    const patients = [
        {
            id: 1,
            name: 'Maaz Ilyas',
            email: 'maaz@example.com',
            phone: '0333-1234567',
            age: 22,
            gender: 'male',
            address: '123 Main Street, Karachi',
            bloodGroup: 'O+',
            joinDate: '2023-06-15',
            lastVisit: '2024-02-20',
            nextAppointment: '2024-03-10',
            totalVisits: 8,
            reports: 5,
            status: 'active',
            allergies: ['Penicillin']
        },
        {
            id: 2,
            name: 'Abdullah Faisal',
            email: 'abdullah@example.com',
            phone: '0333-9876543',
            age: 23,
            gender: 'male',
            address: '456 Park Avenue, Lahore',
            bloodGroup: 'A+',
            joinDate: '2023-08-22',
            lastVisit: '2024-02-18',
            nextAppointment: null,
            totalVisits: 4,
            reports: 3,
            status: 'active',
            allergies: ['Sulfa']
        },
        {
            id: 3,
            name: 'Michael Chen',
            email: 'michael@example.com',
            phone: '0333-4567890',
            age: 45,
            gender: 'male',
            address: '789 Beach Road, Islamabad',
            bloodGroup: 'B+',
            joinDate: '2023-11-10',
            lastVisit: '2024-01-25',
            nextAppointment: '2024-03-15',
            totalVisits: 6,
            reports: 4,
            status: 'active',
            medicalConditions: ['Hypertension'],
            allergies: ['Latex']
        }
    ];

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm) ||
            patient.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleAddPatient = (e) => {
        e.preventDefault();
        console.log('Adding new patient:', newPatient);
        setShowAddForm(false);
        setNewPatient({
            name: '',
            email: '',
            phone: '',
            age: '',
            gender: 'male',
            address: '',
            status: 'active'
        });
    };

    const handleDeletePatient = (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            console.log('Deleting patient:', id);
        }
    };

    const handleViewPatient = (id) => {
        console.log('Viewing patient details:', id);
        // Navigate to patient details page
        window.location.href = `/admin-dashboard/patients/${id}`;
    };

    const statusCounts = patients.reduce((acc, patient) => {
        acc[patient.status] = (acc[patient.status] || 0) + 1;
        return acc;
    }, {});

    const bloodGroups = [...new Set(patients.map(p => p.bloodGroup))];

    return (
        <div className="p-6 min-h-full">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-emerald-900">Patient Management</h3>
                        <p className="text-emerald-600">Manage all patients on the platform</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-6 py-3 bg-gradient-dent text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center gap-2"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add New Patient
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                        <p className="text-emerald-600 font-medium">Total Patients</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">{patients.length}</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                        <p className="text-emerald-600 font-medium">Active</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">{statusCounts.active || 0}</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                        <p className="text-emerald-600 font-medium">Avg. Visits</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                            {(patients.reduce((sum, p) => sum + p.totalVisits, 0) / patients.length).toFixed(1)}
                        </h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                        <p className="text-emerald-600 font-medium">Total Reports</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                            {patients.reduce((sum, p) => sum + p.reports, 0)}
                        </h3>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search patients by name, email, phone, or address..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <FunnelIcon className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-10 pr-8 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Patient Form Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-emerald-100">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-emerald-900">Add New Patient</h3>
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleAddPatient} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={newPatient.name}
                                            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                            className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={newPatient.email}
                                            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                                            className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={newPatient.phone}
                                            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                                            className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="0333-1234567"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="120"
                                            value={newPatient.age}
                                            onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                                            className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="25"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            value={newPatient.gender}
                                            onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                                            className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    {/* <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Blood Group
                                        </label>
                                        <select
                                            value={newPatient.bloodGroup}
                                            onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                                            className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="">Select Blood Group</option>
                                            {bloodGroups.map((bg) => (
                                                <option key={bg} value={bg}>{bg}</option>
                                            ))}
                                        </select>
                                    </div> */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            value={newPatient.address}
                                            onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                                            className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="123 Main Street, City"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4 pt-6 border-t border-emerald-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="px-6 py-3 bg-emerald-50 text-emerald-700 font-medium rounded-lg hover:bg-emerald-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-gradient-dent text-white font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-200 transition-all"
                                    >
                                        Add Patient
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Patients Table */}
                <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-emerald-50">
                                <tr>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Patient</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Contact</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Age/Gender</th>
                                    {/* <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Blood Group</th> */}
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Visits</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Status</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-100">
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-emerald-50/50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <h4 className="font-semibold text-emerald-900">{patient.name}</h4>
                                                    <p className="text-xs text-emerald-600">ID: PAT-{patient.id.toString().padStart(4, '0')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="space-y-1">
                                                <p className="text-emerald-700 text-sm flex items-center gap-1">
                                                    <EnvelopeIcon className="w-4 h-4 text-emerald-500" />
                                                    {patient.email}
                                                </p>
                                                <p className="text-emerald-700 text-sm flex items-center gap-1">
                                                    <PhoneIcon className="w-4 h-4 text-emerald-500" />
                                                    {patient.phone}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-emerald-700">{patient.age} years</p>
                                            <p className="text-sm text-emerald-600 capitalize">{patient.gender}</p>
                                        </td>
                                        {/* <td className="py-4 px-6">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                                                {patient.bloodGroup}
                                            </span>
                                        </td> */}
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-emerald-900">{patient.totalVisits}</p>
                                            {/* <p className="text-xs text-emerald-600">{patient.reports} reports</p> */}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${patient.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : patient.status === 'inactive'
                                                    ? 'bg-gray-100 text-gray-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                                            </span>
                                            {/* {patient.nextAppointment && (
                                                <p className="text-xs text-emerald-600 mt-1">
                                                    Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                                                </p>
                                            )} */}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewPatient(patient.id)}
                                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePatient(patient.id)}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredPatients.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserGroupIcon className="w-12 h-12 text-emerald-400" />
                            </div>
                            <h4 className="text-xl font-bold text-emerald-900 mb-2">No patients found</h4>
                            <p className="text-emerald-600">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>

                {/* Pagination and Summary */}
                <div className="mt-6 flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-center">
                    <p className="text-emerald-600">
                        Showing {filteredPatients.length} of {patients.length} patients
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100">
                            Previous
                        </button>
                        <button className="px-4 py-2 bg-gradient-dent text-white rounded-lg font-medium hover:shadow-emerald-200">
                            1
                        </button>
                        <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100">
                            2
                        </button>
                        <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100">
                            3
                        </button>
                        <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAllPatients;