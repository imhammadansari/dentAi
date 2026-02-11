import React, { useState } from 'react';
import {
    UsersIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    CheckBadgeIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

const AdminDentist = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [newDentist, setNewDentist] = useState({
        name: '',
        email: '',
        phone: '',
        organization: '',
        expertise: '',
        age: '',
        gender: 'male',
        experience: '',
        status: 'pending'
    });

    const dentists = [
        {
            id: 1,
            name: 'Dr. Hammad',
            email: 'hammad@dentclinic.com',
            phone: '0333333',
            organization: 'Dental Care Center',
            expertise: 'Dentist',
            age: 23,
            gender: 'male',
            experience: '2 years',
            patients: 22,
            status: 'verified',
            joinDate: '2022-03-15'
        },
        {
            id: 2,
            name: 'Dr. Faran',
            email: 'faran@smiledental.com',
            phone: '0333333',
            organization: 'Dental Clinic',
            expertise: 'Dentist',
            age: 25,
            gender: 'male',
            experience: '2 years',
            patients: 20,
            status: 'verified',
            joinDate: '2021-08-22'
        },
        {
            id: 3,
            name: 'Dr. Aqwdus',
            email: 'aqdus@dentalpro.com',
            phone: '03333333',
            organization: 'Dental Professionals',
            expertise: 'Dentist',
            age: 25,
            gender: 'male',
            experience: '1 years',
            patients: 20,
            status: 'verified',
            joinDate: '2023-01-10'
        }
    ];

    const filteredDentists = dentists.filter(dentist => {
        const matchesSearch = dentist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dentist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dentist.expertise.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || dentist.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleAddDentist = (e) => {
        e.preventDefault();
        console.log('Adding new dentist:', newDentist);
        setShowAddForm(false);
        setNewDentist({
            name: '',
            email: '',
            phone: '',
            organization: '',
            expertise: '',
            age: '',
            gender: 'male',
            experience: '',
            status: 'pending'
        });
    };

    const handleDeleteDentist = (id) => {
        if (window.confirm('Are you sure you want to delete this dentist?')) {
            console.log('Deleting dentist:', id);
        }
    };

    const handleVerifyDentist = (id) => {
        console.log('Verifying dentist:', id);
    };

    return (
        <div className="p-2 p-4 min-h-full">
            <div className="w-full mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-emerald-900">Dentist Management</h3>
                        <p className="text-emerald-600">Manage all dental professionals on the platform</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <p className="text-black font-medium">Total Dentists</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">{dentists.length}</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <p className="text-black font-medium">Verified</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                            {dentists.filter(d => d.status === 'verified').length}
                        </h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <p className="text-black font-medium">Avg. Patients</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                            {Math.round(dentists.reduce((sum, d) => sum + d.patients, 0) / dentists.length)}
                        </h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="w-5 h-5 text-black absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search dentists by name, email, or expertise..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                    <option value="verified">Verified</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-emerald-50">
                                <tr>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Dentist</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Expertise</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Organization</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Patients</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Status</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-emerald-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-100">
                                {filteredDentists.map((dentist) => (
                                    <tr key={dentist.id} className="hover:bg-emerald-50/50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <h4 className="font-semibold text-emerald-900">{dentist.name}</h4>
                                                    <p className="text-sm text-emerald-600">{dentist.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                                                {dentist.expertise}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-emerald-700">{dentist.organization}</p>
                                            <p className="text-sm text-emerald-600">{dentist.experience}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-emerald-900">{dentist.patients}</p>
                                            <p className="text-sm text-emerald-600">patients</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${dentist.status === 'verified'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {dentist.status === 'verified' ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleVerifyDentist(dentist.id)}
                                                    className={`p-2 rounded-lg ${dentist.status === 'verified'
                                                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                        }`}
                                                    title={dentist.status === 'verified' ? 'Already Verified' : 'Verify Dentist'}
                                                >
                                                    {dentist.status === 'verified' ? (
                                                        <CheckBadgeIcon className="w-4 h-4" />
                                                    ) : (
                                                        <EyeIcon className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDentist(dentist.id)}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
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
                    {filteredDentists.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UsersIcon className="w-12 h-12 text-emerald-400" />
                            </div>
                            <h4 className="text-xl font-bold text-emerald-900 mb-2">No dentists found</h4>
                            <p className="text-emerald-600">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>

                {/* Pagination (optional) */}
                <div className="mt-6 flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-center">
                    <p className="text-emerald-600">
                        Showing {filteredDentists.length} of {dentists.length} dentists
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
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDentist;