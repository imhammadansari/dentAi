import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    UserCircleIcon,
    CalendarDaysIcon,
    PhoneIcon,
    EnvelopeIcon,
    HomeIcon,
    MapPinIcon,
    DocumentTextIcon,
    ClockIcon,
    UserGroupIcon,
    ArrowLeftIcon,
    PrinterIcon,
    ShareIcon,
} from '@heroicons/react/24/outline';

const PatientDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    const patient = {
        id: id || 1,
        name: 'Hammad Ansari',
        email: 'hammad@example.com',
        phone: '+1 (555) 123-4567',
        age: 25,
        gender: 'male',
        address: '123 Main Street, New York, NY 10001',
        joinDate: '2023-06-15',
        lastVisit: '2024-02-20',
        nextAppointment: '2024-03-10',
        totalVisits: 8,
        status: 'active',
        bloodGroup: 'O+',
        allergies: ['Penicillin', 'Latex'],
        medicalConditions: ['Asthma', 'Diabetes Type 2'],
        emergencyContact: {
            name: 'Ali Ansari',
            phone: '+1 (555) 999-8888',
            relationship: 'Brother'
        }
    };

    const reports = [
        { id: 1, date: '2024-02-15', type: 'Dental Scan', dentist: 'Dr. Sarah Johnson', findings: ['Cavity detected', 'Mild gingivitis'] },
        { id: 2, date: '2024-01-28', type: 'Full Mouth X-Ray', dentist: 'Dr. Michael Chen', findings: ['Wisdom tooth impacted', 'No cavities'] },
        { id: 3, date: '2024-01-10', type: 'Panoramic X-Ray', dentist: 'Dr. Emily Wilson', findings: ['Bone loss detected', 'Gum recession'] },
        { id: 4, date: '2023-12-05', type: 'CT Scan', dentist: 'Dr. Robert Kim', findings: ['Sinus involvement', 'Tooth #3 impacted'] },
    ];

    const appointments = [
        { id: 1, date: '2024-03-10', time: '10:30 AM', dentist: 'Dr. Sarah Johnson', type: 'Follow-up', status: 'scheduled' },
        { id: 2, date: '2024-02-20', time: '2:00 PM', dentist: 'Dr. Michael Chen', type: 'Regular Checkup', status: 'completed' },
        { id: 3, date: '2024-01-25', time: '11:15 AM', dentist: 'Dr. Emily Wilson', type: 'Tooth Filling', status: 'completed' },
        { id: 4, date: '2023-12-15', time: '9:45 AM', dentist: 'Dr. Robert Kim', type: 'Cleaning', status: 'completed' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'reports':
                return (
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div key={report.id} className="bg-white border border-primary-100 rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-primary-900">{report.type}</h4>
                                        <p className="text-primary-600 text-sm">
                                            {new Date(report.date).toLocaleDateString()} • {report.dentist}
                                        </p>
                                    </div>
                                    <button className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100">
                                        View Full Report
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-primary-600 mb-2">Findings:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {report.findings.map((finding, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">
                                                {finding}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'appointments':
                return (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className="bg-white border border-primary-100 rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${appointment.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-primary-100 text-primary-600'
                                            }`}>
                                            <CalendarDaysIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-primary-900">{appointment.type}</h4>
                                            <p className="text-primary-600">
                                                {new Date(appointment.date).toLocaleDateString()} • {appointment.time}
                                            </p>
                                            <p className="text-sm text-primary-500">{appointment.dentist}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${appointment.status === 'completed'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-primary-100 text-primary-700'
                                        }`}>
                                        {appointment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-primary-100 rounded-xl p-6 shadow-sm">
                            <h4 className="font-bold text-primary-900 mb-6">Personal Information</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <UserCircleIcon className="w-5 h-5 text-primary-500" />
                                    <div>
                                        <p className="text-sm text-primary-600">Full Name</p>
                                        <p className="text-primary-900 font-medium">{patient.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <EnvelopeIcon className="w-5 h-5 text-primary-500" />
                                    <div>
                                        <p className="text-sm text-primary-600">Email</p>
                                        <p className="text-primary-900 font-medium">{patient.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <PhoneIcon className="w-5 h-5 text-primary-500" />
                                    <div>
                                        <p className="text-sm text-primary-600">Phone</p>
                                        <p className="text-primary-900 font-medium">{patient.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPinIcon className="w-5 h-5 text-primary-500" />
                                    <div>
                                        <p className="text-sm text-primary-600">Address</p>
                                        <p className="text-primary-900 font-medium">{patient.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-primary-100 rounded-xl p-6 shadow-sm">
                            <h4 className="font-bold text-primary-900 mb-6">Medical Information</h4>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-primary-600">Age</p>
                                        <p className="text-primary-900 font-medium">{patient.age} years</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-primary-600">Gender</p>
                                        <p className="text-primary-900 font-medium">{patient.gender}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-primary-600">Blood Group</p>
                                    <p className="text-primary-900 font-medium">{patient.bloodGroup}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-primary-600 mb-2">Allergies</p>
                                    <div className="flex flex-wrap gap-2">
                                        {patient.allergies.map((allergy, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full">
                                                {allergy}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-primary-600 mb-2">Medical Conditions</p>
                                    <div className="flex flex-wrap gap-2">
                                        {patient.medicalConditions.map((condition, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full">
                                                {condition}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-primary-100 rounded-xl p-6 shadow-sm">
                            <h4 className="font-bold text-primary-900 mb-6">Emergency Contact</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-primary-600">Name</p>
                                    <p className="text-primary-900 font-medium">{patient.emergencyContact.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-primary-600">Phone</p>
                                    <p className="text-primary-900 font-medium">{patient.emergencyContact.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-primary-600">Relationship</p>
                                    <p className="text-primary-900 font-medium">{patient.emergencyContact.relationship}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-primary-100 rounded-xl p-6 shadow-sm">
                            <h4 className="font-bold text-primary-900 mb-6">Visit Summary</h4>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-primary-600">Total Sessions</p>
                                        <p className="text-2xl font-bold text-primary-900">{patient.totalVisits}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-primary-600">Status</p>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${patient.status === 'active'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {patient.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-primary-600">Last Visit</p>
                                    <p className="text-primary-900 font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-primary-600">Next Appointment</p>
                                    <p className="text-primary-900 font-medium">
                                        {patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'Not scheduled'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="p-6 min-h-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/admin-dashboard/patients"
                            className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>
                        <div>
                            <h3 className="text-2xl font-bold text-primary-900">Patient Details</h3>
                            <p className="text-primary-600">View and manage patient information</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-primary-50 text-primary-700 font-medium rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-2">
                            <PrinterIcon className="w-4 h-4" />
                            Print
                        </button>
                        <button className="px-4 py-2 bg-gradient-dent text-white font-medium rounded-lg hover:shadow-primary-200 transition-all flex items-center gap-2">
                            <ShareIcon className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-primary-100 p-6 shadow-sm mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gradient-dent rounded-full flex items-center justify-center">
                                <UserCircleIcon className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-primary-900">{patient.name}</h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-primary-600">
                                        <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                                        {patient.email}
                                    </span>
                                    <span className="text-primary-600">
                                        <PhoneIcon className="w-4 h-4 inline mr-1" />
                                        {patient.phone}
                                    </span>
                                    <span className="text-primary-600">
                                        <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                                        Member since {new Date(patient.joinDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-primary-600">Patient ID</p>
                            <p className="text-xl font-bold text-primary-900">PAT-{patient.id.toString().padStart(4, '0')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-primary-100 p-2 mb-6 shadow-sm">
                    <div className="flex gap-2">
                        {[
                            { id: 'overview', label: 'Overview', icon: UserGroupIcon },
                            { id: 'reports', label: 'Medical Reports', icon: DocumentTextIcon },
                            { id: 'appointments', label: 'Appointments', icon: CalendarDaysIcon },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === tab.id
                                        ? 'bg-gradient-dent text-white'
                                        : 'text-primary-700 hover:bg-primary-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {renderContent()}
            </div>
        </div>
    );
};

export default PatientDetails;